import * as Icons from "@radix-ui/react-icons";
import React from "react";

type Props = React.SVGAttributes<SVGElement> & {
  name: string;
  children?: never;
  color?: string;
};

const WorkspaceIcon = React.forwardRef<SVGSVGElement, Props>(
  ({ name, ...rest }, ref) => {
    const Comp = Icons[name as keyof typeof Icons];
    return <Comp {...rest} ref={ref} />;
  },
);

WorkspaceIcon.displayName = "WorkspaceIcon";

export { WorkspaceIcon };
