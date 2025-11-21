import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
      hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
      return (
            <div
                  className={cn(
                        "bg-card rounded-lg p-4 border border-transparent transition-colors duration-200",
                        hover && "hover:bg-card-hover cursor-pointer",
                        className
                  )}
                  {...props}
            >
                  {children}
            </div>
      );
}
