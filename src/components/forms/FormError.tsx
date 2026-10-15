import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message: string;
}

export function FormError({ message, className, ...props }: FormErrorProps) {
  return (
    <p
      className={cn("flex items-center gap-1.5 text-sm text-destructive", className)}
      role="alert"
      {...props}
    >
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}