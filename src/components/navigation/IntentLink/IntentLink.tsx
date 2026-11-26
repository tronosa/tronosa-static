"use client";

import { useState } from "react";

import { Link } from "@/i18n/navigation";

import type { IntentLinkProps } from "./types";

export function IntentLink({
  onMouseEnter,
  onFocus,
  ...props
}: IntentLinkProps) {
  const [active, setActive] = useState(false);

  return (
    <Link
      {...props}
      prefetch={active ? null : false}
      onMouseEnter={(event) => {
        setActive(true);
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        setActive(true);
        onFocus?.(event);
      }}
    />
  );
}
