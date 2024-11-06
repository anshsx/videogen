// components/ui/card.tsx

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default Card;
