"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import { Alert } from "@/components/ui";
import { Send, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { getStoredReferralCode } from "@/components/refer/ReferralCapture";

function SuccessState() {
  return (
    <div className="rounded-lg border border-border bg-background p-8 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle className="h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Message Sent</h2>
      <p className="text-muted-foreground mb-8">
        Thank you for reaching out. We&apos;ll review your message and respond within 2 business hours.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button href="/">Return Home</Button>
        <Button variant="outline" href="/get-help">
          Need IT Help?
        </Button>
      </div>
    </div>
  );
}

export default function ContactFormClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
    honeypot: "",
  });
  // Stamp when the form first rendered (fill-time spam trap, checked server-side).
  const [startedAt] = useState(() => new Date().toISOString());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\+?1?\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Invalid phone number (10 digits)";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    if (formData.honeypot) newErrors.honeypot = "Spam detected";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, startedAt, referralCode: getStoredReferralCode() ?? undefined }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        trackEvent("contact_submit", { subject: formData.subject });
        setFormData({ name: "", email: "", phone: "", subject: "general", message: "", honeypot: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  };

  if (submitStatus === "success") {
    return <SuccessState />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {submitStatus === "error" && (
        <Alert variant="destructive" title="Submission Failed">
          Something went wrong. Please try again or call us directly at {siteConfig.phone}.
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Full Name" error={errors.name} required>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            required
            autoComplete="name"
            error={errors.name}
          />
        </FormField>
        <FormField label="Email" error={errors.email} required>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
            required
            autoComplete="email"
            error={errors.email}
          />
        </FormField>
        <FormField label="Phone" error={errors.phone} required>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(813) 555-0123"
            required
            autoComplete="tel"
            error={errors.phone}
          />
        </FormField>
        <FormField label="Subject" error={errors.subject} required>
          <Select
            id="subject"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            options={[
              { value: "general", label: "General Inquiry" },
              { value: "sales", label: "Sales / New Service" },
              { value: "support", label: "Technical Support" },
              { value: "other", label: "Other" },
            ]}
            placeholder="Select a subject"
            required
            error={errors.subject}
          />
        </FormField>
      </div>

      <FormField label="Message" error={errors.message} required>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="How can we help? Include any relevant details..."
          rows={5}
          required
          error={errors.message}
        />
      </FormField>

      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={(e) => handleChange("honeypot", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ display: "none" }}
        aria-hidden="true"
      />

      <Button className="w-full sm:w-auto" loading={submitStatus === "submitting"}>
        {submitStatus === "submitting" ? "Sending..." : "Send Message"}
        <Send className="h-4 w-4" aria-hidden="true" />
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        By submitting this form, you agree to be contacted regarding your inquiry. We don&apos;t share your information with third parties.
      </p>
    </form>
  );
}
