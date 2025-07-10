import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-gray-50 rounded-md shadow p-4 space-y-3 text-center ${className}`}
    >
      {children}
    </div>
  );
}
