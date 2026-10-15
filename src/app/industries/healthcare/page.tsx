import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Shield, Server, Database, Lock, FileText, CheckCircle, Clock, Headset, Activity, Users, Stethoscope } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Services for Healthcare & Medical Practices | Tampa Bay",
  description: "HIPAA-compliant IT support for Tampa Bay healthcare providers. Secure EHR management, patient data protection, and reliable infrastructure for medical practices.",
  alternates: { canonical: "https://nesscotech.com/industries/healthcare" },
};

const healthcareFaqs = [
  { q: "Are you HIPAA compliant?", a: "We implement technical controls required by HIPAA (access controls, encryption, audit logging, business associate agreements). For formal attestation, we partner with specialized compliance auditors." },
  { q: "Do you support specific EHR systems?", a: "Yes. We support major EHR platforms including Epic, Cerner, Athenahealth, Allscripts, and eClinicalWorks. We also handle custom practice management systems." },
  { q: "How do you handle patient data security?", a: "Multi-layered security: encrypted connections, role-based access controls, automated backups with immutable storage, security monitoring, and incident response procedures." },
  { q: "Can you help with Meaningful Use and MIPS reporting?", a: "We ensure your IT infrastructure supports Meaningful Use requirements and MIPS data submission. We don't handle the reporting itself but ensure your systems can." },
  { q: "What about remote access for physicians?", a: "Secure remote access via VPN, zero-trust network access, and HIPAA-compliant telehealth infrastructure. All remote sessions are logged and encrypted." },
  { q: "Do you offer 24/7 support?", a: "Emergency after-hours support is available for managed IT clients. We understand healthcare doesn't stop at 5pm." },
];

const services = [
  {
    icon: Shield,
    title: "HIPAA-Compliant Security",
    description: "Technical controls, access management, encryption, and audit logging to protect patient data.",
  },
  {
    icon: Server,
    title: "EHR Infrastructure",
    description: "Reliable servers, networking, and cloud infrastructure for EHR systems and practice management.",
  },
  {
    icon: Database,
    title: "Secure Backups & Recovery",
    description: "Automated, encrypted backups with HIPAA-compliant retention and tested recovery procedures.",
  },
  {
    icon: Lock,
    title: "Access Control & Identity",
    description: "Role-based access, MFA, SSO integration, and privileged access management for clinical staff.",
  },
  {
    icon: FileText,
    title: "Compliance Documentation",
    description: "Security policies, risk assessments, and business associate agreements ready for auditors.",
  },
  {
    icon: Activity,
    title: "Network Monitoring",
    description: "24/7 monitoring of clinical systems with automated alerting and rapid incident response.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Patient Data Protection",
    description: "Multi-layered security keeps PHI secure while maintaining clinician access.",
  },
  {
    icon: Clock,
    title: "Minimal Downtime",
    description: "Proactive monitoring and redundant systems keep EHR available when patients need care.",
  },
  {
    icon: Headset,
    title: "Healthcare-Experienced Support",
    description: "Our team understands clinical workflows and the unique pressures of medical practices.",
  },
  {
    icon: Users,
    title: "Scalable Solutions",
    description: "From solo practitioners to multi-location clinics, we scale with your practice.",
  },
];

export default function HealthcarePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Healthcare", path: "/industries/healthcare" }])} />
      <JsonLd data={faqPageSchema(healthcareFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
              Healthcare & Medical Practices
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              HIPAA-Compliant IT for Tampa Bay Healthcare Providers
            </h1>
            <p className="text-lg text-muted-foreground">
              Secure, reliable technology infrastructure that protects patient data, keeps EHR systems running, 
              and lets clinicians focus on patient care — not IT problems.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule a Healthcare IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Healthcare Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Healthcare-Specific IT Services
            </h2>
            <p className="text-muted-foreground">
              Designed for the unique compliance, security, and reliability requirements of medical practices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="p-6 rounded-lg border border-border bg-background lift-hover">
                <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4 w-fit">
                  <service.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="benefits-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="benefits-heading" className="text-3xl font-bold text-foreground mb-4">
              Why Healthcare Providers Choose Us
            </h2>
            <p className="text-muted-foreground">
              We understand clinical workflows, HIPAA requirements, and the stakes of healthcare IT.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                  <benefit.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="compliance-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="compliance-heading" className="text-3xl font-bold text-foreground mb-4">
                HIPAA Compliance Framework
              </h2>
              <p className="text-muted-foreground">
                We implement the technical controls required by HIPAA Security Rule. For formal attestation, 
                we partner with specialized compliance auditors.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                    Administrative Safeguards
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Security policies and procedures
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Risk assessment and management
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Workforce security training
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Business associate agreements
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                    Technical Safeguards
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Access control and authentication
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Encryption at rest and in transit
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Audit logging and monitoring
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Secure transmission controls
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">
              Healthcare IT FAQ
            </h2>
          </div>
          <FAQAccordion items={healthcareFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Secure Your Practice&apos;s IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your HIPAA compliance needs, EHR infrastructure, 
              and healthcare-specific IT requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Healthcare IT Consultation
              </Button>
              <Button size="lg" variant="outline" href="/services">
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
