"use client";

import { Link } from "@/i18n/navigation";

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  AccordionIndicator,
} from "@/components/ui/Accordion";

import {
  footerAccordionVariants,
  footerAccordionItemVariants,
  footerAccordionHeadingVariants,
  footerAccordionDesktopHeadingVariants,
  footerAccordionTriggerVariants,
  footerAccordionNumberVariants,
  footerAccordionTitleVariants,
  footerAccordionLinksVariants,
} from "./footer-navigation.variants";

import { footerLinkVariants, footerLinkArrowVariants } from "./footer.variants";

export type FooterNavigationLink = {
  id: string;
  href: string;
  label: string;
};

export type FooterNavigationGroup = {
  id: string;
  label: string;
  links: readonly FooterNavigationLink[];
};

export type FooterNavigationProps = {
  label: string;
  groups: readonly FooterNavigationGroup[];
};

function FooterLinkArrow() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={footerLinkArrowVariants()}
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function FooterNavigation({ label, groups }: FooterNavigationProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <nav aria-label={label} data-footer-navigation>
      <Accordion type="multiple" className={footerAccordionVariants()}>
        {groups.map((group, index) => {
          const number = String(index + 1).padStart(2, "0");

          return (
            <AccordionItem
              key={group.id}
              value={group.id}
              data-footer-group={group.id}
              className={footerAccordionItemVariants()}
            >
              <AccordionHeader asChild>
                <h2 className={footerAccordionHeadingVariants()}>
                  <AccordionTrigger
                    className={footerAccordionTriggerVariants()}
                  >
                    <span
                      aria-hidden="true"
                      className={footerAccordionNumberVariants()}
                    >
                      {number}
                    </span>

                    <span className={footerAccordionTitleVariants()}>
                      {group.label}
                    </span>

                    <AccordionIndicator />
                  </AccordionTrigger>

                  <span className={footerAccordionDesktopHeadingVariants()}>
                    <span
                      aria-hidden="true"
                      className={footerAccordionNumberVariants()}
                    >
                      {number}
                    </span>

                    <span className={footerAccordionTitleVariants()}>
                      {group.label}
                    </span>
                  </span>
                </h2>
              </AccordionHeader>

              <AccordionContent
                persistentOnDesktop
                role="presentation"
                aria-labelledby={undefined}
              >
                <ul role="list" className={footerAccordionLinksVariants()}>
                  {group.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        prefetch={false}
                        className={footerLinkVariants()}
                      >
                        <span>{link.label}</span>

                        <FooterLinkArrow />
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </nav>
  );
}
