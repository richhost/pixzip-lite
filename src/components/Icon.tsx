import React from "react";
import * as IconPrimitive from "@radix-ui/react-icons";

type Props = {
  name?: string;
  className?: string;
  style?: React.CSSProperties;
};

const Icon = React.forwardRef<HTMLOrSVGElement, Props>(
  ({ name, ...props }, forwardRef) => {
    if (!name) return <></>;

    return React.createElement((IconPrimitive as any)[name], {
      ...props,
      ref: forwardRef,
    });
  }
);

export default Icon;
