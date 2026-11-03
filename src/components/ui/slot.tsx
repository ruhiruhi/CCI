"use client";

import * as React from "react";

type AnyProps = Record<string, unknown>;

function mergeRefs<T>(refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(node);
      else if (ref && typeof ref === "object")
        (ref as React.MutableRefObject<T>).current = node;
    });
  };
}

/** Minimal Radix-style Slot: merges props onto a single child element. */
export const Slot = React.forwardRef<HTMLElement, { children?: React.ReactNode } & AnyProps>(
  ({ children, ...slotProps }, ref) => {
    if (!React.isValidElement(children)) return null;

    const child = children as React.ReactElement<AnyProps & { ref?: React.Ref<unknown> }>;
    const childProps = child.props;

    const merged: AnyProps = { ...childProps, ...slotProps };

    // Merge className
    if (childProps.className || slotProps.className) {
      merged.className = [slotProps.className, childProps.className]
        .filter(Boolean)
        .join(" ");
    }

    return React.cloneElement(child, {
      ...merged,
      ref: mergeRefs([ref, child.props.ref as React.Ref<unknown>]),
    } as AnyProps);
  },
);
Slot.displayName = "Slot";
