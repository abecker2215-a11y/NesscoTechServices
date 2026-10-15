import { useId, type FieldsetHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  label: string;
  options: RadioOption[];
  error?: string;
  hint?: string;
  orientation?: "horizontal" | "vertical";
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

function RadioGroup({
  className,
  label,
  options,
  error,
  hint,
  orientation = "vertical",
  id,
  name,
  value,
  onChange,
  ...props
}: RadioGroupProps) {
  const generatedId = useId();
  const groupId = id || `radiogroup-${generatedId}`;
  const errorId = error ? `${groupId}-error` : undefined;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  return (
    <fieldset className={cn("w-full", className)} aria-describedby={describedBy} {...props}>
      <legend className="text-sm font-medium text-foreground mb-2">{label}</legend>
      <div
        className={cn(
          "flex gap-4",
          orientation === "horizontal" ? "flex-wrap" : "flex-col gap-3"
        )}
        role="radiogroup"
        aria-labelledby={groupId}
      >
        {options.map((option) => {
          const radioId = `${groupId}-${option.value}`;
          const isChecked = value === option.value;
          return (
            <label key={option.value} className={cn("flex items-start gap-2 cursor-pointer", orientation === "horizontal" && "flex-col items-start")}>
              <input
                type="radio"
                id={radioId}
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={() => handleChange(option.value)}
                className={cn(
                  "mt-0.5 h-4 w-4 rounded-full border-border text-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "transition-colors"
                )}
              />
              <div>
                <span className="text-sm font-medium text-foreground">{option.label}</span>
                {option.description && (
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                )}
              </div>
            </label>
          );
        })}
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
    </fieldset>
  );
}

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };