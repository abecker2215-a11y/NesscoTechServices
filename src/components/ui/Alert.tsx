import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning";
  title?: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, children, ...props }, ref) => {
    const variants = {
      default: "bg-accent text-accent-foreground border-accent-foreground/20",
      destructive: "bg-destructive/10 text-destructive border-destructive/20",
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
    };

    const icons = {
      default: <Info className="h-4 w-4" aria-hidden="true" />,
      destructive: <AlertCircle className="h-4 w-4" aria-hidden="true" />,
      success: <CheckCircle className="h-4 w-4" aria-hidden="true" />,
      warning: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
    };

    const roles = {
      default: "status",
      destructive: "alert",
      success: "status",
      warning: "alert",
    };

    return (
      <div
        ref={ref}
        role={roles[variant]}
        className={cn(
          "relative w-full rounded-lg border p-4",
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0" aria-hidden="true">
            {icons[variant]}
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-medium">{title}</h4>
            )}
            <div className={cn("text-sm", title && "mt-1")}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert };