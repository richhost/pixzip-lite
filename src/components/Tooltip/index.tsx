import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { TooltipProps } from "@radix-ui/react-tooltip";

type Props = TooltipProps & {
  content?: React.ReactNode;
};

export const Tooltip: React.FC<Props> = (props) => {
  return <TooltipPrimitive.Root></TooltipPrimitive.Root>;
};
