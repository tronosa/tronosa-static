import type { ComponentPropsWithRef } from "react";

import type { Link } from "@/i18n/navigation";

export type IntentLinkProps = Omit<
  ComponentPropsWithRef<typeof Link>,
  "prefetch"
>;
