import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

// lucide je izbacio brend ikone — držimo svoje.
export function InstagramIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.3l-4.5 1.2z" />
      <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.1.2-.1.3 0 .5a6 6 0 0 0 2.8 2.6c.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .4-.2 1.2-.7 1.5-.5.4-1.2.5-1.8.3a9 9 0 0 1-5.6-4.9c-.4-.9-.2-1.9.3-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ViberIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3.5c-4.8 0-8 2.6-8 7.4 0 2.6 1 4.6 2.8 5.9v3.7l3-1.9c.7.1 1.4.2 2.2.2 4.8 0 8-2.6 8-7.4s-3.2-7.9-8-7.9z" />
      <path d="M12 7.5c1.9 0 3.3 1.3 3.3 3.2" />
      <path d="M12 9.3c.9 0 1.5.6 1.5 1.5" />
      <path d="M9.6 9.1c.2-.3.5-.3.7-.2l.9 1c.2.2.1.4 0 .6l-.4.4c.3.9 1.1 1.7 2 2l.4-.4c.2-.2.4-.2.6 0l1 .9c.2.2.2.5-.1.7-.6.5-1.3.6-2 .3a6.3 6.3 0 0 1-3.4-3.4c-.3-.7-.2-1.4.3-1.9z" fill="currentColor" stroke="none" />
    </svg>
  );
}
