import iconsData from '@/lib/icons-bundle.json';

type IconData = { body: string; width?: number; height?: number };
const ICONS = iconsData as Record<string, IconData>;

type IconProps = {
  icon: string;
  className?: string;
  // Tolerate decorative attributes (aria-hidden, etc.) callers pass; the
  // component hardcodes aria-hidden="true" since icons are always decorative.
  [key: string]: unknown;
};

/**
 * Lightweight, offline icon renderer — no @iconify runtime (~57KB saved).
 * Renders the icon body via dangerouslySetInnerHTML so React treats the SVG
 * as opaque (cheap to hydrate), keeps colored logos' own fills, and lets
 * monochrome icons inherit `currentColor`. Aspect ratio is preserved.
 */
export function Icon({ icon, className }: IconProps) {
  const data = ICONS[icon];
  if (!data) return null;

  const w = data.width ?? 24;
  const h = data.height ?? 24;
  const width = w === h ? '1em' : `${(w / h).toFixed(3)}em`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={{ height: '1em', width }}
      dangerouslySetInnerHTML={{ __html: data.body }}
    />
  );
}

export default Icon;
