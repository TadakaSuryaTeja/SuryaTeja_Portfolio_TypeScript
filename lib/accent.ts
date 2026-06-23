export type Accent = 'accent' | 'violet' | 'success';

type AccentClasses = {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  ring: string;
  via: string;
  gradient: string;
  shadow: string;
};

/**
 * Static class maps so Tailwind's content scanner keeps every variant.
 * Never build accent classes via string interpolation — they would be purged.
 */
export const accentMap: Record<Accent, AccentClasses> = {
  accent: {
    text: 'text-accent',
    bg: 'bg-accent',
    bgSoft: 'bg-accent/10',
    border: 'border-accent/30',
    ring: 'ring-accent/30',
    via: 'via-accent',
    gradient: 'from-accent/25 to-accent/0',
    shadow: 'shadow-[0_12px_40px_-12px_rgba(59,130,246,0.5)]',
  },
  violet: {
    text: 'text-violet',
    bg: 'bg-violet',
    bgSoft: 'bg-violet/10',
    border: 'border-violet/30',
    ring: 'ring-violet/30',
    via: 'via-violet',
    gradient: 'from-violet/25 to-violet/0',
    shadow: 'shadow-[0_12px_40px_-12px_rgba(139,92,246,0.5)]',
  },
  success: {
    text: 'text-success',
    bg: 'bg-success',
    bgSoft: 'bg-success/10',
    border: 'border-success/30',
    ring: 'ring-success/30',
    via: 'via-success',
    gradient: 'from-success/25 to-success/0',
    shadow: 'shadow-[0_12px_40px_-12px_rgba(34,197,94,0.5)]',
  },
};
