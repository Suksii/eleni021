import type { JSX } from "react";

// CMS naslov sa *istaknutom* rečju: deo između zvezdica ide u kurziv malinom.
export default function RichTitle({
  text,
  as: Tag = "h1",
  className,
  id,
}: {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  id?: string;
}) {
  const parts = text.split(/\*([^*]+)\*/);
  return (
    <Tag id={id} className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="text-primary font-normal italic">
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </Tag>
  );
}
