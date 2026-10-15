"use client";

import { FormField } from "@/components/forms";
import { Input, Select, Textarea, Button } from "@/components/ui";
import { RadioGroup } from "@/components/ui";
import { TimeSlotPicker } from "./TimeSlotPicker";

interface ContactFormProps {
  values: {
    name: string;
    email: string;
    phone: string;
    preferredContact: "call" | "email" | "text";
    preference: "remote" | "onsite" | "either";
    description: string;
    preferredTime?: string;
    honeypot?: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
  isSubmitting?: boolean;
}

export function ContactForm({ values, onChange, onSubmit, onBack, errors, isSubmitting }: ContactFormProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Full Name" error={errors?.name} required>
          <Input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="John Doe"
            required
            autoComplete="name"
            error={errors?.name}
          />
        </FormField>
        <FormField label="Email" error={errors?.email} required>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="john@example.com"
            required
            autoComplete="email"
            inputMode="email"
            error={errors?.email}
          />
        </FormField>
        <FormField label="Phone" error={errors?.phone} required>
          <Input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="(813) 555-0123"
            required
            autoComplete="tel"
            inputMode="tel"
            error={errors?.phone}
          />
        </FormField>
        <FormField label="Preferred Contact" error={errors?.preferredContact} required>
          <Select
            id="preferredContact"
            value={values.preferredContact}
            onChange={(e) => onChange("preferredContact", e.target.value)}
            options={[
              { value: "call", label: "Phone Call" },
              { value: "email", label: "Email" },
              { value: "text", label: "Text Message" },
            ]}
            placeholder="Select preference"
            required
            error={errors?.preferredContact}
          />
          {values.preferredContact === "text" && (
            <p className="mt-2 text-xs text-muted-foreground">
              We&apos;ll text you from our business line — reply STOP to opt out anytime.
            </p>
          )}
        </FormField>
      </div>

      <FormField label="Service Preference" error={errors?.preference} required>
        <RadioGroup
          name="preference"
          label="Service Preference"
          value={values.preference}
          onChange={(value) => onChange("preference", value)}
          options={[
            { value: "remote", label: "Remote Support", description: "Starting at $75 - We connect securely to your computer" },
            { value: "onsite", label: "On-Site Visit", description: "Starting at $125 - We come to your business or office" },
            { value: "either", label: "Either Works", description: "Let us recommend the best option" },
          ]}
          orientation="vertical"
          error={errors?.preference}
        />
      </FormField>

      <FormField label="Describe the Problem" error={errors?.description} required>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="What's happening? When did it start? What have you tried?"
          rows={4}
          required
          error={errors?.description}
        />
      </FormField>

      <FormField label="Preferred Time" hint="Pick a window — we'll confirm the exact time">
        <TimeSlotPicker
          value={values.preferredTime}
          onChange={(v) => onChange("preferredTime", v)}
        />
        <Input
          id="preferredTime"
          type="text"
          value={values.preferredTime || ""}
          onChange={(e) => onChange("preferredTime", e.target.value)}
          placeholder="Or describe another time: e.g., Thursday after 2pm"
          autoComplete="off"
          className="mt-3"
        />
      </FormField>

      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button loading={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>

      {/* Honeypot — invisible to humans, irresistible to bots. */}
      <input
        type="text"
        name="website"
        value={values.honeypot || ""}
        onChange={(e) => onChange("honeypot", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ display: "none" }}
        aria-hidden="true"
      />
    </form>
  );
}