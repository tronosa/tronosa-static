const baseUrl = __ENV.BASE_URL ?? "http://localhost:3000";

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://web:3000",
  "http://nginx:8080",
];

if (!allowedOrigins.includes(baseUrl)) {
  throw new Error(`Reliability testing is not allowed against: ${baseUrl}`);
}

export const environment = {
  baseUrl,
  requestTimeout: "10s",
} as const;
