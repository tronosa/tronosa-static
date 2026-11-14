type EnvironmentVariables = {
  NETLIFY?: string;
  CONTEXT?: string;
  SITE_URL?: string;
  SEO_INDEXING_ENABLED?: string;
};

type Environment = {
  siteUrl: string;
  isProduction: boolean;
  isIndexable: boolean;
};

export function getEnvironment(
  env: EnvironmentVariables = {
    NETLIFY: process.env.NETLIFY,
    CONTEXT: process.env.CONTEXT,
    SITE_URL: process.env.SITE_URL,
    SEO_INDEXING_ENABLED: process.env.SEO_INDEXING_ENABLED,
  },
): Environment {
  const isProduction = env.NETLIFY === "true" && env.CONTEXT === "production";

  const rawSiteUrl = env.SITE_URL?.trim();

  if (!rawSiteUrl && env.NETLIFY === "true") {
    throw new Error("SITE_URL is required on Netlify.");
  }

  const url = new URL(rawSiteUrl || "http://localhost:3000");

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

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("SITE_URL must use HTTP or HTTPS.");
  }

  return {
    siteUrl: url.origin,
    isProduction,
    isIndexable: isProduction && env.SEO_INDEXING_ENABLED === "true",
  };
}
