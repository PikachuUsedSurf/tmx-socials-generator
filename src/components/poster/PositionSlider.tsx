"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { POSTER_WIDTH } from "@/lib/types";

interface PositionSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

interface PositionSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const PositionSlider: React.FC<PositionSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = POSTER_WIDTH,
}) => (
  <div className="flex flex-col gap-2">
    <Label className="text-sm font-medium">
      {label}: {value}px
    </Label>
    <Slider
      value={[value]}
      onValueChange={(values) => onChange(values[0])}
      min={min}
      max={max}
      step={1}
      className="w-full"
    />
  </div>
);