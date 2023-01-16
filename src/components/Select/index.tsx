import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import type { SelectProps, SelectItemProps } from "@radix-ui/react-select";
import Icon from "../Icon";
import "./select.scss";

export const Select = React.forwardRef<
  HTMLButtonElement,
  SelectProps & { id?: string }
>(({ children, id, ...props }, forwardedRef) => (
  <SelectPrimitive.Root {...props}>
    <SelectPrimitive.Trigger
      ref={forwardedRef}
      id={id}
      className="select-trigger"
    >
      <SelectPrimitive.Value />
      <SelectPrimitive.Icon className="select-icon">
        <Icon name="ChevronDownIcon" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>

    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className="select-content">
        <SelectPrimitive.ScrollUpButton className="select-scroll-button">
          <Icon name="ChevronUpIcon" />
        </SelectPrimitive.ScrollUpButton>

        <SelectPrimitive.Viewport className="select-viewport">
          {children}
        </SelectPrimitive.Viewport>

        <SelectPrimitive.ScrollDownButton className="select-scroll-button">
          <Icon name="ChevronDownIcon" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
));

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <SelectPrimitive.Item
      className={"select-item " + className}
      {...props}
      ref={forwardedRef}
    >
      <SelectPrimitive.ItemIndicator className="select-item-indicator">
        <Icon name="CheckIcon" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);
