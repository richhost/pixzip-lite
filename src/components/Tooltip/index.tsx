import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { PopperContentProps } from "@radix-ui/react-tooltip";
import "./tooltip.scss";

type Props = PopperContentProps & {
  content?: React.ReactNode;
};

export const Tooltip: React.FC<Props> = ({
  children,
  content,
  side,
  ...props
}) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side={side}
          align="center"
          className="tooltip-content"
          {...props}
        >
          {content}
          <TooltipPrimitive.Arrow
            width={11}
            height={5}
            className="tooltip-arrow"
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
