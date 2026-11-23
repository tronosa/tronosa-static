import type { Page } from "@playwright/test";

export const HCAPTCHA_TEST_TOKEN = "e2e-hcaptcha-test-token";

const HCAPTCHA_URL = /^https:\/\/(?:[^/]+\.)?hcaptcha\.com(?:\/|$)/;

export async function mockHCaptcha(page: Page) {
  const scriptRequests: string[] = [];

  await page.route(HCAPTCHA_URL, async (route) => {
    const url = new URL(route.request().url());

    if (!url.pathname.endsWith("/api.js")) {
      await route.abort();

      return;
    }

    scriptRequests.push(url.href);

    const token = JSON.stringify(HCAPTCHA_TEST_TOKEN);

    const callback = JSON.stringify(url.searchParams.get("onload"));

    await route.fulfill({
      status: 200,
      contentType: "application/javascript",

      body: `
        (() => {
          const widgets = new Map();
          let nextId = 0;

          window.hcaptcha = {
            render(container, options) {
              const element =
                typeof container === "string"
                  ? document.getElementById(container)
                  : container;

              if (!element) {
                throw new Error("Missing CAPTCHA container");
              }

              const id = nextId++;

              const wrapper = document.createElement("div");
              wrapper.dataset.testid = "mock-hcaptcha";

              const verifyButton = document.createElement("button");
              verifyButton.type = "button";
              verifyButton.textContent = "Mock CAPTCHA verify";
              verifyButton.dataset.testid = "captcha-verify";

              const expireButton = document.createElement("button");
              expireButton.type = "button";
              expireButton.textContent = "Mock CAPTCHA expire";
              expireButton.dataset.testid = "captcha-expire";

              const widget = {
                wrapper,
                options,
                token: "",
                resetCount: 0,
              };

              verifyButton.addEventListener("click", () => {
                widget.token = ${token};

                options.callback?.(widget.token);
              });

              expireButton.addEventListener("click", () => {
                widget.token = "";

                options["expired-callback"]?.();
              });

              wrapper.dataset.resetCount = "0";

              wrapper.append(verifyButton, expireButton);

              element.appendChild(wrapper);

              widgets.set(id, widget);

              return id;
            },

            getResponse(id) {
              return widgets.get(id)?.token ?? "";
            },

            getRespKey() {
              return "e2e-response-key";
            },

            reset(id) {
              const widget = widgets.get(id);

              if (!widget) {
                throw new Error("Unknown CAPTCHA widget");
              }

              widget.token = "";
              widget.resetCount += 1;

              widget.wrapper.dataset.resetCount =
                String(widget.resetCount);
            },

            remove(id) {
              widgets.get(id)?.wrapper.remove();
              widgets.delete(id);
            }
          };

          const callbackName = ${callback};

          if (callbackName) {
            const onLoad = window[callbackName];

            if (typeof onLoad === "function") {
              onLoad();
            }
          }
        })();
      `,
    });
  });

  return {
    scriptRequests,

    widget: page.getByTestId("mock-hcaptcha"),

    verify: page.getByTestId("captcha-verify"),

    expire: page.getByTestId("captcha-expire"),
  };
}
