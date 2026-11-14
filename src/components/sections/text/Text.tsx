import type { TextProps } from "./text.schema";

export function Text({ heading, paragraphs }: TextProps) {
  return (
    <section>
      {heading && <h2>{heading}</h2>}

      <div>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
