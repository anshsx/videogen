// components/ui/slider.tsx

import React, { useState } from "react";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, step = 1, onChange }) => {
  const [value, setValue] = useState(min);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-300 rounded-lg"
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;
