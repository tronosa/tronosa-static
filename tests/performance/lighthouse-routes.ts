import { getContentTestRoutes } from "../shared/routes";

const pathnames = getContentTestRoutes()
  .filter((route) => route.expectedStatus === 200)
  .map((route) => route.pathname);

const uniquePathnames = [...new Set(pathnames)];

if (uniquePathnames.length === 0) {
  throw new Error(
    "Lighthouse route discovery failed: no published routes were found.",
  );
}

process.stdout.write(JSON.stringify(uniquePathnames));
