"use client";

import * as RadixSelect from "@radix-ui/react-select";

import { Typography } from "@/components/ui/Typography";

import { cn } from "@/lib/cn";

import type { SelectProps } from "./types";

import {
  selectTriggerVariants,
  selectContentVariants,
  selectViewportVariants,
  selectItemVariants,
  selectIndicatorVariants,
  selectIconVariants,
  selectScrollButtonVariants,
} from "./select.variants";

function Chevron({ direction = "down" }: { direction?: "up" | "down" }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(selectIconVariants(), direction === "up" && "rotate-180")}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Select({
  id,
  name,
  value,
  options,
  placeholder,
  disabled,
  required,
  className,
  onValueChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SelectProps) {
  return (
    <RadixSelect.Root
      name={name}
      value={value}
      disabled={disabled}
      required={required}
      onValueChange={onValueChange}
    >
      <RadixSelect.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(selectTriggerVariants(), className)}
      >
        <Typography
          as="span"
          variant="small"
          tone={null}
          className="min-w-0 truncate"
        >
          <RadixSelect.Value placeholder={placeholder} />
        </Typography>

        <RadixSelect.Icon asChild>
          <Chevron />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={8}
          collisionPadding={16}
          className={selectContentVariants()}
        >
          <RadixSelect.ScrollUpButton className={selectScrollButtonVariants()}>
            <Chevron direction="up" />
          </RadixSelect.ScrollUpButton>

          <RadixSelect.Viewport className={selectViewportVariants()}>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={selectItemVariants()}
              >
                <Typography as="span" variant="small" tone={null}>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </Typography>

                <RadixSelect.ItemIndicator
                  className={selectIndicatorVariants()}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>

          <RadixSelect.ScrollDownButton
            className={selectScrollButtonVariants()}
          >
            <Chevron />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
