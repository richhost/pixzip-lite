import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import type { SliderProps } from "@radix-ui/react-slider";
import "./slider.scss";

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, ...props }, forwardedRef) => {
    const value = props.value || props.defaultValue;

    return (
      <SliderPrimitive.Slider
        className={"slider-root " + className}
        {...props}
        ref={forwardedRef}
      >
        <SliderPrimitive.Track className="slider-track">
          <SliderPrimitive.Range className="slider-range" />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb className="slider-thumb" />
      </SliderPrimitive.Slider>
    );
  }
);
