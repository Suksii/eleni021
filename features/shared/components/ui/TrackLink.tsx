"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackContact, type ContactChannel } from "@/lib/track";

interface TrackLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  channel: ContactChannel;
  /** Deo sajta odakle je klik (header, footer, kontakt…) — ide uz putanju. */
  where: string;
}

// Običan <a> koji pri kliku zabeleži kontakt-događaj; navigacija ide dalje normalno.
export default function TrackLink({ channel, where, onClick, children, ...rest }: TrackLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackContact(channel, where);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
