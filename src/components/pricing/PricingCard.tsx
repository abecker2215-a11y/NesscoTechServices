import { PricingPlan } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <Card variant={plan.popular ? "elevated" : "outlined"} padding="none" className={cn("relative flex flex-col h-full", plan.popular && "ring-2 ring-primary")}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">Most Popular</span>
        </div>
      )}
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-foreground">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.period}</span>
        </div>
        <ul className="space-y-3 mb-6 flex-1" role="list">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" variant={plan.popular ? "primary" : "outline"} href={plan.ctaHref}>
          {plan.ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}