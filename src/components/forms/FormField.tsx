import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, error, hint, required, children, id, ...props }, ref) => {
    const fieldId = id || `field-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${fieldId}-error` : undefined;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {label && (
          <label htmlFor={fieldId} className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div id={fieldId} aria-describedby={describedBy}>
          {children}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export { FormField };