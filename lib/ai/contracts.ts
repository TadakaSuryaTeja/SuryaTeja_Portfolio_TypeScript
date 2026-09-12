/**
 * The wire contract between the chat API and the chat UI.
 *
 * Both sides import these types, and both sides validate against the same
 * predicates, so a change to the protocol breaks the build rather than
 * producing a panel that silently renders nothing. The client parses bytes off
 * a network stream — that input is untrusted in exactly the same way a request
 * body is, and is validated rather than cast.
 *
 * These are hand-written guards rather than a schema library on purpose: the
 * validators run inside the lazily-loaded chat bundle, and a runtime schema
 * package would cost more bytes than the entire panel does, to check six
 * object shapes.
 */

export type ChatRole = 'user' | 'assistant';

export type ChatSourceMeta = {
  id: string;
  title: string;
  url: string;
  section: string;
  dateRange?: string;
  score: number;
};

/** Non-sensitive per-request facts, surfaced in the "How this works" panel. */
export type ChatMeta = {
  requestId: string;
  provider: string | null;
  model: string | null;
  cached: boolean;
  retrievedCount: number;
  topScore: number | null;
  retrievalMs: number;
  ttftMs: number | null;
  totalMs: number;
  promptTokens: number;
  completionTokens: number;
  droppedSources: number;
  droppedTurns: number;
  indexVersion: string | null;
};

export type ServerEvent =
  | { type: 'sources'; sources: ChatSourceMeta[] }
  | { type: 'token'; text: string }
  | { type: 'meta'; meta: ChatMeta }
  | { type: 'error'; message: string; code: string }
  | { type: 'done'; provider: string | null; refused: boolean };

/* ------------------------------- primitives ------------------------------- */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/* ------------------------------ request shape ----------------------------- */

export type ChatRequest = {
  question: string;
  history: { role: ChatRole; content: string }[];
};

export const MAX_HISTORY_MESSAGES = 8;

/**
 * Parses a request body without trusting any of it. Returns the reason on
 * failure so the route can answer with something a human can act on, rather
 * than a bare 400.
 */
export function parseChatRequest(
  body: unknown,
): { ok: true; value: ChatRequest } | { ok: false; reason: string } {
  if (!isRecord(body)) return { ok: false, reason: 'Expected a JSON object.' };
  if (!isString(body.question)) return { ok: false, reason: 'A question is required.' };

  const rawHistory = Array.isArray(body.history) ? body.history : [];

  const history = rawHistory
    .filter(
      (turn): turn is { role: ChatRole; content: string } =>
        isRecord(turn) &&
        (turn.role === 'user' || turn.role === 'assistant') &&
        isString(turn.content),
    )
    .slice(-MAX_HISTORY_MESSAGES);

  return { ok: true, value: { question: body.question, history } };
}

/* -------------------------------- SSE frames ------------------------------ */

export function encodeEvent(event: ServerEvent): string {
  const { type, ...data } = event;
  return `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
}

export function isChatSourceMeta(value: unknown): value is ChatSourceMeta {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.url) &&
    isString(value.section) &&
    isFiniteNumber(value.score) &&
    (value.dateRange === undefined || isString(value.dateRange))
  );
}

/**
 * Rebuilds a typed event from an SSE frame, or returns null.
 *
 * Null means "ignore this frame", which is the right response to a truncated
 * or malformed chunk mid-stream: the answer so far is still valid and the rest
 * of the stream may still be fine. Throwing here would discard a good partial
 * answer because one frame was damaged in transit.
 */
export function decodeEvent(type: string, raw: string): ServerEvent | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(data)) return null;

  switch (type) {
    case 'token':
      return isString(data.text) ? { type: 'token', text: data.text } : null;

    case 'sources': {
      if (!Array.isArray(data.sources)) return null;
      return { type: 'sources', sources: data.sources.filter(isChatSourceMeta) };
    }

    case 'meta':
      return isRecord(data.meta) ? { type: 'meta', meta: data.meta as ChatMeta } : null;

    case 'error':
      return isString(data.message)
        ? {
            type: 'error',
            message: data.message,
            code: isString(data.code) ? data.code : 'unknown',
          }
        : null;

    case 'done':
      return {
        type: 'done',
        provider: isString(data.provider) ? data.provider : null,
        refused: data.refused === true,
      };

    default:
      return null;
  }
}
