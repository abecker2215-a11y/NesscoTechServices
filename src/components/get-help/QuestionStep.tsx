"use client";

import { HelpQuestion } from "@/lib/types";
import { FormField } from "@/components/forms";
import { Input, Textarea, Select, Button } from "@/components/ui";

interface QuestionStepProps {
  questions: HelpQuestion[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
}

export function QuestionStep({ questions, values, onChange, onNext, onBack, errors }: QuestionStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {questions.map((question) => (
          <FormField
            key={question.id}
            label={question.label}
            error={errors?.[question.id]}
            required={question.required}
          >
            {question.type === "textarea" && (
              <Textarea
                id={question.id}
                value={values[question.id] || ""}
                onChange={(e) => onChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                rows={3}
                required={question.required}
                aria-invalid={errors?.[question.id] ? "true" : "false"}
              />
            )}
            {question.type === "select" && question.options && (
              <Select
                id={question.id}
                value={values[question.id] || ""}
                onChange={(e) => onChange(question.id, e.target.value)}
                options={question.options}
                placeholder={question.placeholder || "Select an option"}
                required={question.required}
                error={errors?.[question.id]}
              />
            )}
            {question.type === "radio" && question.options && (
              <fieldset className="space-y-3" role="radiogroup" aria-label={question.label}>
                {question.options.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={values[question.id] === option.value}
                      onChange={() => onChange(question.id, option.value)}
                      className="h-5 w-5 rounded-full border-border text-primary focus-visible:ring-2 focus-visible:ring-ring"
                      required={question.required}
                    />
                    <span className="text-sm text-foreground">{option.label}</span>
                  </label>
                ))}
              </fieldset>
            )}
            {question.type === "text" && (
              <Input
                id={question.id}
                type="text"
                value={values[question.id] || ""}
                onChange={(e) => onChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                required={question.required}
                error={errors?.[question.id]}
              />
            )}
          </FormField>
        ))}
      </div>
      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}