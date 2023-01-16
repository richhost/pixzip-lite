import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { PopoverContentProps } from "@radix-ui/react-popover";
import "./popover.scss";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      sideOffset={0}
      className={"popover-content " + className}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <PopoverPrimitive.Arrow className="popover-arrow" />
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
