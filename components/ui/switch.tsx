// src/components/ui/switch.tsx

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils"; // This is a utility to combine class names (if you don't have this, you can skip it or use `clsx` instead).

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitives.Root> {
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({ className, ...props }) => {
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none",
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className="block h-4 w-4 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 peer-checked:translate-x-5"
      />
    </SwitchPrimitives.Root>
  );
};

export { Switch };
