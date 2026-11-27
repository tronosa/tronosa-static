import { contactFormDecorationVariants } from "./contact-form.variants";

const WAVE_PATHS = [
  "M-50 130 C60 -30 160 -30 260 110 S420 220 540 35",
  "M-50 142 C60 -20 160 -20 260 118 S420 216 540 45",
  "M-50 154 C60 -10 160 -10 260 126 S420 212 540 55",
  "M-50 166 C60 0 160 0 260 134 S420 208 540 65",
  "M-50 178 C60 10 160 10 260 142 S420 204 540 75",
  "M-50 190 C60 20 160 20 260 150 S420 200 540 85",
  "M-50 202 C60 30 160 30 260 158 S420 196 540 95",
  "M-50 214 C60 40 160 40 260 166 S420 192 540 105",
  "M-50 226 C60 50 160 50 260 174 S420 188 540 115",
  "M-50 238 C60 60 160 60 260 182 S420 184 540 125",
  "M-50 250 C60 70 160 70 260 190 S420 180 540 135",
  "M-50 262 C60 80 160 80 260 198 S420 176 540 145",
] as const;

export function ContactFormDecoration() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-contact-decoration
      viewBox="0 0 480 240"
      fill="none"
      preserveAspectRatio="xMidYMax slice"
      className={contactFormDecorationVariants()}
    >
      {WAVE_PATHS.map((path) => (
        <path
          key={path}
          d={path}
          stroke="currentColor"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
