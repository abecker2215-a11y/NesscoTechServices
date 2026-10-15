"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Check, ArrowRight, ChevronRight, ChevronLeft, Briefcase, Shield, CloudLightning, Headset } from "lucide-react";
import { cn } from "@/lib/utils";

const comparisonPlans = [
  {
    id: "hourly",
    name: "Hourly Support",
    icon: Briefcase,
    price: "$75/hr",
    features: [
      "Remote support from $75/hr",
      "On-site from $125/hr",
      "No long-term commitment",
      "Pay for what you need",
      "No contract required",
    ],
    bestFor: "Occasional IT needs",
  },
  {
    id: "essentials",
    name: "Essentials Plan",
    icon: Shield,
    price: "$149/mo",
    features: [
      "Up to 10 devices",
      "24/7 monitoring",
      "Proactive patching",
      "Helpdesk support",
      "Basic security",
      "Monthly billing",
    ],
    bestFor: "Small businesses (5-25 employees)",
    popular: true,
  },
  {
    id: "managed",
    name: "Managed IT",
    icon: CloudLightning,
    price: "$349/mo",
    features: [
      "Up to 25 devices",
      "All Essentials features",
      "Virtual CIO consulting",
      "Strategic planning",
      "Vendor management",
      "Priority support",
    ],
    bestFor: "Growing businesses (25-50 employees)",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Headset,
    price: "Custom",
    features: [
      "Unlimited devices",
      "All Managed features",
      "Dedicated support team",
      "Custom SLAs",
      "Disaster recovery",
      "24/7 on-site availability",
    ],
    bestFor: "Large organizations (50+ employees)",
  },
];

const questions = [
  {
    id: "employees",
    question: "How many employees do you have?",
    options: [
      { value: "1-10", label: "1-10 employees", recommended: "hourly" },
      { value: "11-25", label: "11-25 employees", recommended: "essentials" },
      { value: "26-50", label: "26-50 employees", recommended: "managed" },
      { value: "50+", label: "50+ employees", recommended: "enterprise" },
    ],
  },
  {
    id: "it-budget",
    question: "What's your monthly IT budget?",
    options: [
      { value: "under-500", label: "Under $500/month", recommended: "hourly" },
      { value: "500-1500", label: "$500-$1,500/month", recommended: "essentials" },
      { value: "1500-5000", label: "$1,500-$5,000/month", recommended: "managed" },
      { value: "5000+", label: "$5,000+/month", recommended: "enterprise" },
    ],
  },
  {
    id: "priority",
    question: "What's your biggest IT priority?",
    options: [
      { value: "cost", label: "Minimize costs", recommended: "hourly" },
      { value: "reliability", label: "Maximize reliability", recommended: "managed" },
      { value: "growth", label: "Support growth", recommended: "managed" },
      { value: "compliance", label: "Meet compliance requirements", recommended: "enterprise" },
    ],
  },
  {
    id: "support",
    question: "How much hands-on support do you need?",
    options: [
      { value: "minimal", label: "Minimal - we handle most ourselves", recommended: "hourly" },
      { value: "moderate", label: "Moderate - need help sometimes", recommended: "essentials" },
      { value: "comprehensive", label: "Comprehensive - need full IT management", recommended: "managed" },
      { value: "dedicated", label: "Dedicated - need our own team", recommended: "enterprise" },
    ],
  },
];

export function ServiceComparisonWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendedPlan, setRecommendedPlan] = useState<string | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      calculateRecommendation();
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const calculateRecommendation = () => {
    const recommendations = answers ? Object.values(answers) : [];
    const counts: Record<string, number> = {};
    
    recommendations.forEach((rec) => {
      counts[rec] = (counts[rec] || 0) + 1;
    });

    const topRecommendation = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    setRecommendedPlan(topRecommendation || "essentials");
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendedPlan(null);
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  if (recommendedPlan) {
    const plan = comparisonPlans.find((p) => p.id === recommendedPlan);
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">We Recommend</h2>
          <p className="text-muted-foreground">Based on your answers, here&apos;s our recommendation:</p>
        </div>

        {plan && (
          <Card className={cn("border-2 border-primary bg-primary/5", plan.popular && "shadow-lg")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                  <plan.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-2xl font-bold text-primary">{plan.price}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{plan.bestFor}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Button size="lg" className="flex-1" href={`/get-help?plan=${plan.id}`}>
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
                <Button size="lg" variant="outline" onClick={resetWizard}>
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Not sure? Compare all plans:</p>
          <Button variant="outline" href="/pricing">
            View Full Pricing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            {currentQuestion.question}
          </h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleAnswer(currentQuestion.id, option.value);
                  handleNext();
                }}
                className={cn(
                  "w-full text-left p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:bg-muted/50 transition-all",
                  answers[currentQuestion.id] === option.value && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{option.label}</span>
                  {answers[currentQuestion.id] === option.value && (
                    <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              {currentStep === questions.length - 1 ? "See Recommendation" : "Next"}
              <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
