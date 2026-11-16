export const appEnvironments = [
  "development",
  "staging",
  "production",
] as const;

export type AppEnvironment = (typeof appEnvironments)[number];

type EnvironmentVariables = {
  APP_ENV?: string;
  SITE_URL?: string;
  SEO_INDEXING_ENABLED?: string;
};

type Environment = {
  appEnv: AppEnvironment;
  siteUrl: string;
  isProduction: boolean;
  isIndexable: boolean;
};

function parseAppEnvironment(value: string | undefined): AppEnvironment {
  if (value === undefined || value === "") {
    return "development";
  }

  if (appEnvironments.includes(value as AppEnvironment)) {
    return value as AppEnvironment;
  }

  throw new Error(`Invalid APP_ENV: ${value}`);
}

export function getEnvironment(
  env: EnvironmentVariables = {
    APP_ENV: process.env.APP_ENV,
    SITE_URL: process.env.SITE_URL,
    SEO_INDEXING_ENABLED: process.env.SEO_INDEXING_ENABLED,
  },
): Environment {
  const appEnv = parseAppEnvironment(env.APP_ENV);
  const isProduction = appEnv === "production";

  const rawSiteUrl = env.SITE_URL?.trim();

  if (!rawSiteUrl && appEnv !== "development") {
    throw new Error("SITE_URL is required in staging and production.");
  }

  let url: URL;

  try {
    url = new URL(rawSiteUrl || "http://localhost:3000");
  } catch {
    throw new Error("SITE_URL must be a valid URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("SITE_URL must use HTTP or HTTPS.");
  }

  if (
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error("SITE_URL must be a valid origin.");
  }

  if (isProduction && url.protocol !== "https:") {
    throw new Error("Production SITE_URL must use HTTPS.");
  }

  return {
    appEnv,
    siteUrl: url.origin,
    isProduction,
    isIndexable: isProduction && env.SEO_INDEXING_ENABLED === "true",
  };
}
