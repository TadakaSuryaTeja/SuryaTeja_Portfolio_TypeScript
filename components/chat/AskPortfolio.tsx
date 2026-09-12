import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { trackEvent } from '@/lib/analytics';

/**
 * The only part of "Ask My Portfolio" that reaches the initial page: a button.
 *
 * The panel pulls in a streaming client, a transcript renderer and the chat
 * state machine — none of which a visitor who never opens it should pay for.
 * Dynamically importing on first open keeps the added cost of this feature to
 * the homepage at zero, which was a hard constraint rather than a nicety.
 */
const ChatPanel = dynamic(() => import('@/components/chat/ChatPanel'), {
  ssr: false,
});

export default function AskPortfolio() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const toggle = () => {
    if (!open) trackEvent('ask_portfolio_open');
    setOpen((current) => !current);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="btn-primary fixed bottom-5 right-5 z-[80] h-12 w-12 !px-0 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:!px-5"
      >
        <Icon icon={open ? 'ph:x-bold' : 'ph:sparkle-bold'} className="text-base" />
        <span className="sr-only sm:not-sr-only">{open ? 'Close' : 'Ask about his work'}</span>
      </button>

      {open && <ChatPanel onClose={close} returnFocusTo={buttonRef.current} />}
    </>
  );
}
