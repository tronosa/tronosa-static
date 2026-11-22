import { sourceClosingDecorationVariants } from "./source-closing.variants";

const DROP_COUNT = 15;

const DROP_SCALES = Array.from(
  { length: DROP_COUNT },
  (_, index) => 1 - index * 0.052,
);

const DROP_PATH = [
  "M 160 12",
  "C 146 58 32 158 32 232",
  "C 32 303 89 348 160 348",
  "C 231 348 288 303 288 232",
  "C 288 158 174 58 160 12",
  "Z",
].join(" ");

export function SourceClosingDecoration() {
  return (
    <div aria-hidden="true" className={sourceClosingDecorationVariants()}>
      <svg
        viewBox="0 0 320 360"
        fill="none"
        focusable="false"
        className="block h-auto w-full"
      >
        {DROP_SCALES.map((scale, index) => (
          <path
            key={index}
            d={DROP_PATH}
            transform={[
              "translate(160 180)",
              `scale(${scale})`,
              "translate(-160 -180)",
            ].join(" ")}
            stroke="currentColor"
            strokeWidth={0.8}
            opacity={0.35 + index * 0.025}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
