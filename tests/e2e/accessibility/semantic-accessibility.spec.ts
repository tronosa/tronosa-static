import { expect, test } from "@playwright/test";

import {
  getContentTestRoutes,
  getNegativeTestRoutes,
} from "../../shared/routes";

const contentRoutes = getContentTestRoutes();

const negativeRoutes = getNegativeTestRoutes(contentRoutes);

const routes = [...contentRoutes, ...negativeRoutes];

const viewports = [
  {
    name: "desktop",
    width: 1440,
    height: 900,
  },
  {
    name: "mobile",
    width: 390,
    height: 844,
  },
] as const;

test.describe("Semantic accessibility @a11y", () => {
  for (const viewport of viewports) {
    test.describe(viewport.name, () => {
      test.use({
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
      });

      for (const route of routes) {
        test(`${route.locale} | ${route.kind} | ${route.id} | ${route.pathname}`, async ({
          page,
        }) => {
          await test.step("Validate HTTP response", async () => {
            const response = await page.goto(route.pathname);

            expect(response?.status()).toBe(route.expectedStatus);
          });

          const main = page.getByRole("main");

          await test.step("Validate global banner landmark", async () => {
            const banner = page.getByRole("banner");

            await expect.soft(banner).toHaveCount(1);

            await expect
              .soft(page.locator("header[data-site-header]"))
              .toHaveCount(1);

            if ((await banner.count()) === 1) {
              await expect.soft(banner).toHaveAttribute("data-site-header");
            }
          });

          await test.step("Validate main landmark", async () => {
            await expect.soft(main).toHaveCount(1);

            await expect.soft(page.locator("main")).toHaveCount(1);

            if ((await main.count()) === 1) {
              await expect.soft(main).toHaveAttribute("id", "main-content");

              await expect.soft(main).toHaveAttribute("tabindex", "-1");
            }
          });

          await test.step("Validate landmark boundaries", async () => {
            await expect
              .soft(page.locator("main [data-site-header]"))
              .toHaveCount(0);

            await expect
              .soft(page.locator("[data-site-header] main"))
              .toHaveCount(0);

            await expect.soft(page.locator("main main")).toHaveCount(0);

            const contentInfo = page.getByRole("contentinfo");

            expect.soft(await contentInfo.count()).toBeLessThanOrEqual(1);
          });

          await test.step("Validate primary heading", async () => {
            const headings = main.getByRole("heading", {
              level: 1,
            });

            await expect.soft(headings).toHaveCount(1);

            if ((await headings.count()) === 1) {
              await expect.soft(headings).toHaveAccessibleName(/\S/);
            }
          });

          await test.step("Validate heading hierarchy", async () => {
            const headings = await main
              .getByRole("heading")
              .evaluateAll((elements) =>
                elements.map((element) => ({
                  level: Number(
                    element.getAttribute("aria-level") ??
                      element.tagName.slice(1),
                  ),
                  text: element.textContent?.trim() ?? "",
                })),
              );

            expect.soft(headings.length).toBeGreaterThan(0);

            expect
              .soft(
                headings[0]?.level,
                "The first accessible heading must be H1.",
              )
              .toBe(1);

            const violations: string[] = [];

            for (let index = 0; index < headings.length; index++) {
              const current = headings[index];

              if (!Number.isInteger(current.level) || current.level < 1) {
                violations.push(`Invalid heading level: "${current.text}"`);

                continue;
              }

              if (index === 0) {
                continue;
              }

              const previous = headings[index - 1];

              if (current.level > previous.level + 1) {
                violations.push(
                  `H${previous.level} "${previous.text}" -> H${current.level} "${current.text}"`,
                );
              }
            }

            expect
              .soft(
                violations,
                `Invalid heading hierarchy on ${route.pathname} (${viewport.name})`,
              )
              .toEqual([]);
          });

          await test.step("Validate accessible heading names", async () => {
            const headings = main.getByRole("heading");

            const count = await headings.count();

            for (let index = 0; index < count; index++) {
              await expect
                .soft(headings.nth(index), `Heading at index ${index}`)
                .toHaveAccessibleName(/\S/);
            }
          });

          await test.step("Validate unique element identifiers", async () => {
            const duplicates = await page
              .locator("[id]")
              .evaluateAll((elements) => {
                const counts = new Map<string, number>();

                for (const element of elements) {
                  const id = element.id;

                  counts.set(id, (counts.get(id) ?? 0) + 1);
                }

                return [...counts.entries()]
                  .filter(([, count]) => count > 1)
                  .map(([id, count]) => ({
                    id,
                    count,
                  }));
              });

            expect
              .soft(duplicates, `Duplicate identifiers on ${route.pathname}`)
              .toEqual([]);
          });

          await test.step("Validate ARIA label references", async () => {
            const invalidReferences = await page
              .locator("[aria-labelledby], [aria-describedby]")
              .evaluateAll((elements) => {
                const violations: string[] = [];

                for (const element of elements) {
                  for (const attribute of [
                    "aria-labelledby",
                    "aria-describedby",
                  ]) {
                    const value = element.getAttribute(attribute);

                    if (value === null) {
                      continue;
                    }

                    const references = value
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean);

                    if (references.length === 0) {
                      violations.push(
                        `${element.tagName.toLowerCase()} has an empty ${attribute}`,
                      );
                    }

                    for (const reference of references) {
                      if (!document.getElementById(reference)) {
                        violations.push(
                          `${element.tagName.toLowerCase()} ${attribute} references missing ID "${reference}"`,
                        );
                      }
                    }
                  }
                }

                return violations;
              });

            expect
              .soft(
                invalidReferences,
                `Invalid ARIA references on ${route.pathname}`,
              )
              .toEqual([]);
          });

          await test.step("Validate accessible region names", async () => {
            const regions = page.getByRole("region");

            const count = await regions.count();

            for (let index = 0; index < count; index++) {
              await expect
                .soft(regions.nth(index), `Region at index ${index}`)
                .toHaveAccessibleName(/\S/);
            }
          });

          if (route.kind === "article") {
            await test.step("Validate editorial article semantics", async () => {
              await expect.soft(page.locator("main > article")).toHaveCount(1);
            });
          }
        });
      }
    });
  }
});
