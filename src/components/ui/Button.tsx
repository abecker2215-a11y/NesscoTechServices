"use client";

import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type RefCallback } from "react";
import { cn } from "@/lib/utils";

type ButtonOwnProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
};

type SharedProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | keyof ButtonOwnProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type" | keyof ButtonOwnProps>;

type ButtonProps = ButtonOwnProps & SharedProps;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, fullWidth, href, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm tap-feedback";

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-border bg-background hover:bg-muted",
      ghost: "hover:bg-muted hover:text-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm gap-1.5",
      md: "h-10 px-4 py-2 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2",
    };

    const isLink = !!href;
    const Comp = isLink ? "a" : "button";
    const linkProps = isLink ? { href, ...props } : props;

    const refCallback: RefCallback<HTMLButtonElement | HTMLAnchorElement> = (instance) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | HTMLAnchorElement | null>).current = instance;
      }
    };

    return (
      <Comp
        ref={refCallback}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className)}
        disabled={disabled || loading}
        {...linkProps}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };