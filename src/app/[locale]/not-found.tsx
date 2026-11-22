import { getTranslations } from "next-intl/server";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <>
      <h1>404</h1>

      <p>{t("description")}</p>
    </>
  );
}
