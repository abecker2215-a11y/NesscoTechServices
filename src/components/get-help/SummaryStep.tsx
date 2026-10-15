import { HelpRequestData } from "@/lib/types";
import { Button } from "@/components/ui";
import { formatPhone } from "@/lib/utils";

interface SummaryStepProps {
  data: HelpRequestData;
  onSubmit: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
  isSubmitting?: boolean;
}

const categoryLabels: Record<string, string> = {
  computer: "Computer",
  wifi: "Wi-Fi / Networking",
  email: "Email",
  m365: "Microsoft 365",
  security: "Security",
  printer: "Printer",
  business: "Business IT",
  other: "Something Else",
};

const contactMethodLabels: Record<string, string> = {
  call: "Phone Call",
  email: "Email",
  text: "Text Message",
};

const preferenceLabels: Record<string, string> = {
  remote: "Remote Support",
  onsite: "On-Site Visit",
  either: "Either Works",
};

export function SummaryStep({ data, onSubmit, onBack, onEdit, isSubmitting }: SummaryStepProps) {
  const photoCount = data.photos?.length ?? 0;
  const sections = [
    {
      title: "Problem Category",
      value: categoryLabels[data.category] || data.category,
      editStep: 1,
    },
    {
      title: "Details",
      value: Object.entries(data.answers).map(([k, v]) => `${k}: ${v}`).join("; ") || "No additional details",
      editStep: 2,
    },
    {
      title: "Contact Information",
      value: `${data.contact.name} • ${data.contact.email} • ${formatPhone(data.contact.phone)} • ${contactMethodLabels[data.contact.preferredContact]} • ${preferenceLabels[data.contact.preference]}`,
      editStep: 3,
    },
    {
      title: "Problem Description",
      value: data.contact.description,
      editStep: 3,
    },
    data.contact.preferredTime ? {
      title: "Preferred Time",
      value: data.contact.preferredTime,
      editStep: 3,
    } : null,
    photoCount > 0 ? {
      title: `Photos (${photoCount})`,
      value: (data.photoNames ?? []).join(", ") || `${photoCount} photo(s) attached`,
      editStep: 2,
    } : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {photoCount > 0 && data.photos && (
        <div className="flex gap-3 overflow-x-auto rounded-lg border border-border p-4">
          {data.photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Attached photo ${i + 1}`}
              className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover"
            />
          ))}
        </div>
      )}
      <div className="rounded-lg border border-border p-6 space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1 min-w-0">
              <dt className="text-sm font-medium text-muted-foreground">{section!.title}</dt>
              <dd className="text-sm text-foreground mt-1 whitespace-pre-wrap">{section!.value}</dd>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(section!.editStep)}>
              Edit
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-accent p-4 border border-accent-foreground/20">
        <p className="text-sm text-accent-foreground">
          <strong>Important:</strong> Submitting this request does not guarantee an appointment time or technician assignment.
          We will contact you during business hours ({data.contact.preferredContact === "call" ? "by phone" : "via " + data.contact.preferredContact}) to discuss your issue and schedule service if needed.
        </p>
      </div>

      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} loading={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Confirm & Submit"}
        </Button>
      </div>
    </div>
  );
}