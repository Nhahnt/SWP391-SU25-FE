import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>; // thêm dòng này
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`bg-gray-50 rounded-md shadow p-4 space-y-3 text-center ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
