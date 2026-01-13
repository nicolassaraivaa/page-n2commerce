"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function InteractiveHoverButton({
  children,
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 300);
    onClick?.(e);
  };

  return (
    <button
      className={cn(
        "group bg-primary relative w-auto cursor-pointer overflow-hidden rounded-full py-3 px-6 text-center font-semibold",
        "touch-manipulation select-none",
        "active:scale-95 transition-transform duration-200",
        className
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
      onClick={handleClick}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setTimeout(() => setIsActive(false), 300)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="bg-white h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8] group-active:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-active:translate-x-12 group-active:opacity-0">
          {children}
        </span>
      </div>
      <div className={cn(
        "absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300",
        "group-hover:-translate-x-5 group-hover:opacity-100 group-hover:text-black",
        isActive && "-translate-x-5 opacity-100 text-black"
      )}>
        <span className="text-white group-hover:text-black group-active:text-black">{children}</span>
        <ArrowRight className="group-hover:text-black group-active:text-black" />
      </div>
    </button>
  );
}
