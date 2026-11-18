import { statsBannerThemes, type StatsBannerTheme } from "./stats-banner.theme";

const polygons = [
  "0,0 175,0 0,125",
  "175,0 115,100 0,125",
  "175,0 365,0 320,150",
  "175,0 320,150 115,100",
  "365,0 570,0 320,150",
  "570,0 510,85 320,150",
  "570,0 790,0 750,145",
  "570,0 750,145 510,85",
  "790,0 1000,0 750,145",
  "1000,0 1000,105 750,145",

  "0,125 115,100 205,235",
  "0,125 205,235 0,275",
  "115,100 320,150 205,235",
  "320,150 390,295 205,235",
  "320,150 510,85 620,220",
  "320,150 620,220 390,295",
  "510,85 750,145 620,220",
  "750,145 865,270 620,220",
  "750,145 1000,105 1000,265",
  "750,145 1000,265 865,270",

  "0,275 205,235 0,400",
  "205,235 155,400 0,400",
  "205,235 390,295 350,400",
  "205,235 350,400 155,400",
  "390,295 620,220 350,400",
  "620,220 590,400 350,400",
  "620,220 865,270 800,400",
  "620,220 800,400 590,400",
  "865,270 1000,265 800,400",
  "1000,265 1000,400 800,400",
] as const;

type StatsBannerMosaicProps = {
  theme: StatsBannerTheme;
};

export function StatsBannerMosaic({ theme }: StatsBannerMosaicProps) {
  const palette = statsBannerThemes[theme];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 400"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full"
      style={{ opacity: palette.opacity }}
    >
      {polygons.map((points, index) => (
        <polygon
          key={points}
          points={points}
          fill={
            palette.triangles[
              (index * 5 + Math.floor(index / 4)) % palette.triangles.length
            ]
          }
        />
      ))}
    </svg>
  );
}
