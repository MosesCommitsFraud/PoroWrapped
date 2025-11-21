import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: "primary" | "secondary" | "ghost" | "outline";
      size?: "sm" | "md" | "lg";
}

export function Button({ className, variant = "primary", size = "md", children, ...props }: ButtonProps) {
      const variants = {
            primary: "bg-primary text-primary-foreground hover:opacity-90 font-bold",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "bg-transparent hover:bg-white/10 text-foreground",
            outline: "bg-transparent border border-muted text-foreground hover:border-primary hover:text-primary",
      };

      const sizes = {
            sm: "px-3 py-1 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
      };

      return (
            <button
                  className={cn(
                        "rounded-full transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                        variants[variant],
                        sizes[size],
                        className
                  )}
                  {...props}
            >
                  {children}
            </button>
      );
}
