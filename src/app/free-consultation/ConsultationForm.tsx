"use client";

import { Button, Input, Textarea, Select, Alert } from "@/components/ui";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    employees: "",
    currentIt: "none",
    painPoints: "",
    honeypot: "",
  });
  const [startedAt] = useState(() => new Date().toISOString());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\+?1?\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Invalid phone number (10 digits)";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.employees) newErrors.employees = "Number of employees is required";
    if (!formData.currentIt) newErrors.currentIt = "Current IT setup is required";
    if (!formData.painPoints.trim()) newErrors.painPoints = "Tell us about your challenges";
    else if (formData.painPoints.trim().length < 10) newErrors.painPoints = "Please provide more detail (at least 10 characters)";
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
        body: JSON.stringify({ ...formData, startedAt, subject: "consultation" }),
      });
      if (response.ok) {
        setSubmitStatus("success");
        trackEvent("consultation_request", { employees: formData.employees, currentIt: formData.currentIt });
      } else setSubmitStatus("error");
    } catch { setSubmitStatus("error"); }
  };

  if (submitStatus === "success") {
    return (
      <div className="rounded-lg border border-border bg-background p-8 text-center">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-success" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-foreground mb-4">Consultation Requested</h2>
        <p className="text-muted-foreground mb-8">Thanks! We&apos;ll review your submission and reach out within 2 business hours to schedule your free consultation.</p>
        <Button href="/">Return Home</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {submitStatus === "error" && <Alert variant="destructive" title="Submission Failed">Something went wrong. Please try again or call us directly.</Alert>}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Full Name <span className="text-red-500">*</span></label>
          <Input id="name" type="text" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="John Doe" required autoComplete="name" error={errors.name} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Work Email <span className="text-red-500">*</span></label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="john@company.com" required autoComplete="email" error={errors.email} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">Phone <span className="text-red-500">*</span></label>
          <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="(813) 555-0123" required autoComplete="tel" error={errors.phone} />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1">Company Name <span className="text-red-500">*</span></label>
          <Input id="company" type="text" value={formData.company} onChange={(e) => handleChange("company", e.target.value)} placeholder="Acme Corp" required autoComplete="organization" error={errors.company} />
        </div>
        <div>
          <label htmlFor="employees" className="block text-sm font-medium text-foreground mb-1">Number of Employees <span className="text-red-500">*</span></label>
          <Select
            id="employees"
            value={formData.employees}
            onChange={(e) => handleChange("employees", e.target.value)}
            options={[
              { value: "1-4", label: "1-4 employees" },
              { value: "5-10", label: "5-10 employees" },
              { value: "11-25", label: "11-25 employees" },
              { value: "26-50", label: "26-50 employees" },
              { value: "51-100", label: "51-100 employees" },
              { value: "100+", label: "100+ employees" },
            ]}
            placeholder="Select employee count"
            required
            error={errors.employees}
          />
        </div>
        <div>
          <label htmlFor="currentIt" className="block text-sm font-medium text-foreground mb-1">Current IT Setup <span className="text-red-500">*</span></label>
          <Select
            id="currentIt"
            value={formData.currentIt}
            onChange={(e) => handleChange("currentIt", e.target.value)}
            options={[
              { value: "none", label: "No dedicated IT (you handle it)" },
              { value: "internal", label: "Internal IT staff (1-2 people)" },
              { value: "team", label: "Internal IT team (3+ people)" },
              { value: "msp", label: "Current MSP/outsourced IT" },
              { value: "break-fix", label: "Break-fix as needed" },
            ]}
            placeholder="Select current setup"
            required
            error={errors.currentIt}
          />
        </div>
      </div>

      <div>
        <label htmlFor="painPoints" className="block text-sm font-medium text-foreground mb-1">Biggest IT Challenges <span className="text-red-500">*</span></label>
        <Textarea
          id="painPoints"
          value={formData.painPoints}
          onChange={(e) => handleChange("painPoints", e.target.value)}
          placeholder="What&apos;s not working? (e.g., frequent downtime, security concerns, slow support, no backup testing, compliance needs, scaling issues)"
          rows={4}
          required
          error={errors.painPoints}
        />
      </div>

      <input type="text" name="honeypot" value={formData.honeypot} onChange={(e) => handleChange("honeypot", e.target.value)} tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />

      <Button className="w-full sm:w-auto" loading={submitStatus === "submitting"}>
        {submitStatus === "submitting" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : <>Send Request<Send className="ml-2 h-4 w-4" aria-hidden="true" /></>}
      </Button>

      <p className="text-sm text-muted-foreground text-center">By submitting, you agree to be contacted about your consultation request. We don&apos;t share your information.</p>
    </form>
  );
}