/** Minimal types so the TS content checker can read the plain-ESM résumé source. */
export declare const contact: {
  name: string; email: string; phone: string; location: string;
  website: string; linkedin: string; github: string;
};
export declare const education: { school: string; detail: string; date: string }[];
export declare const certifications: string[];
export declare function experience(variant: string): {
  company: string; title: string; location: string; date: string; bullets: string[];
}[];
export declare const variants: Record<string, any>;
