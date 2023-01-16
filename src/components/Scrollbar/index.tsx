import React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "./scrollbar.scss";

type Props = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const Scrollbar: React.FC<Props> = ({ children, style }) => {
  return (
    <ScrollArea.Root className="scroll-area-root" style={style}>
      <ScrollArea.Viewport className="scroll-area-viewport">
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="scroll-area-scrollbar"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="scroll-area-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export default Scrollbar;
