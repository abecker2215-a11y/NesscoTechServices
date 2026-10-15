"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  category: z.string().min(1, "Please select a category"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  description: z.string().min(20, "Please provide more details (at least 20 characters)").max(5000),
});

type TicketForm = z.infer<typeof ticketSchema>;

const categories = [
  { value: "HARDWARE", label: "Hardware", description: "Computers, servers, printers, peripherals" },
  { value: "SOFTWARE", label: "Software", description: "Applications, OS, updates, licensing" },
  { value: "NETWORK", label: "Network", description: "Wi-Fi, connectivity, VPN, firewall" },
  { value: "SECURITY", label: "Security", description: "Viruses, malware, phishing, access issues" },
  { value: "EMAIL", label: "Email / Microsoft 365", description: "Outlook, Teams, SharePoint, MFA" },
  { value: "BACKUP", label: "Backup / Data Recovery", description: "Failed backups, lost files, restore" },
  { value: "ACCESS", label: "Access / Permissions", description: "Password resets, MFA, user provisioning" },
  { value: "ONBOARDING", label: "New Employee Setup", description: "Hardware, accounts, access for new hires" },
  { value: "OFFBOARDING", label: "Employee Departure", description: "Account closure, data transfer, access removal" },
  { value: "OTHER", label: "Other", description: "Anything else" },
] as const;

const priorities = [
  { value: "LOW", label: "Low", description: "Minor issue, no urgency", color: "bg-gray-100 text-gray-800" },
  { value: "MEDIUM", label: "Medium", description: "Normal business impact", color: "bg-blue-100 text-blue-800" },
  { value: "HIGH", label: "High", description: "Significant impact, needs attention soon", color: "bg-orange-100 text-orange-800" },
  { value: "URGENT", label: "Urgent", description: "Critical impact, immediate attention needed", color: "bg-red-100 text-red-800" },
] as const;

export function NewTicketClient({ initialData }: { initialData: { clientId: string; userId: string; categories: { value: string; label: string }[] } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: "MEDIUM" },
  });

  const selectedCategory = useWatch({ control, name: "category" });
  const selectedPriority = useWatch({ control, name: "priority" });

  const onSubmit = async (data: TicketForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/portal/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          clientId: initialData.clientId,
          createdById: initialData.userId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create ticket");
      }

      router.push(`/portal/tickets/${result.id}`);
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/portal/tickets" className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors" aria-label="Back to tickets">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
          <p className="text-gray-500 mt-1">Describe your issue and we&apos;ll get it routed to the right team</p>
        </div>
      </div>

      {submitError && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            id="title"
            type="text"
            className={cn(
              "w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              errors.title ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
            )}
            placeholder="Brief summary of the issue"
            disabled={isSubmitting}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setValue("category", cat.value, { shouldValidate: true })}
                className={cn(
                  "relative p-4 border-2 rounded-lg text-left transition-all",
                  errors.category
                    ? "border-red-300 bg-red-50"
                    : selectedCategory === cat.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                )}
                aria-pressed={selectedCategory === cat.value}
              >
                <div className="font-medium text-gray-900">{cat.label}</div>
                <div className="mt-1 text-sm text-gray-500">{cat.description}</div>
                {selectedCategory === cat.value && (
                  <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="mt-1.5 text-sm text-red-600" role="alert">{errors.category.message}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Priority <span className="text-red-500">*</span>
          </label>
          <div className="grid gap-2 sm:grid-cols-4">
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setValue("priority", p.value, { shouldValidate: true })}
                className={cn(
                  "relative p-4 border-2 rounded-lg text-center transition-all",
                  selectedPriority === p.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                )}
                aria-pressed={selectedPriority === p.value}
              >
                <span className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium", p.color)}>
                  {p.label}
                </span>
                <p className="mt-1 text-xs text-gray-500">{p.description}</p>
                {selectedPriority === p.value && (
                  <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              {...register("description")}
              id="description"
              rows={6}
              className={cn(
                "w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                errors.description ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
              )}
              placeholder="Describe the issue in detail:\n- What happened?\n- When did it start?\n- What have you tried?\n- Any error messages?"
              disabled={isSubmitting}
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby={errors.description ? "description-error" : "description-hint"}
            />
          </div>
          {errors.description && (
            <p id="description-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.description.message}
            </p>
          )}
          <p id="description-hint" className="mt-1.5 text-sm text-gray-500">
            Include steps to reproduce, error messages, and any troubleshooting you&apos;ve already done.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link href="/portal/tickets" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-6 py-2.5 rounded-lg font-medium text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSubmitting
                ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating ticket…
              </span>
            ) : (
              "Submit Ticket"
            )}
          </button>
        </div>
      </form>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">What happens next?</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Your ticket will be triaged within 15 minutes during business hours</li>
              <li>You&apos;ll receive an email confirmation with the ticket number</li>
              <li>Track progress anytime in the <Link href="/portal/tickets" className="underline hover:text-blue-600">Tickets</Link> section</li>
              <li>For emergencies, contact us through the portal or reply to the confirmation email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}