// src/components/ui/label.tsx

import * as React from "react";
import { cn } from "@/lib/utils"; // This is a utility to combine class names (if you don't have this, you can skip it or use `clsx` instead).

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Label: React.FC<LabelProps> = ({ className, children, ...props }) => {
  return (
    <label className={cn("text-sm font-medium text-gray-700", className)} {...props}>
      {children}
    </label>
  );
};

export { Label };
