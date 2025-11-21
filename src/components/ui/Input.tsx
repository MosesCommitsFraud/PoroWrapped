import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
      icon?: React.ReactNode;
}

export function Input({ className, icon, ...props }: InputProps) {
      return (
            <div className="relative w-full">
                  {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                              {icon}
                        </div>
                  )}
                  <input
                        className={cn(
                              "w-full bg-white/10 border border-transparent rounded-full py-3 px-6 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all",
                              icon && "pl-12",
                              className
                        )}
                        {...props}
                  />
            </div>
      );
}
