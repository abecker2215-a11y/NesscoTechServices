"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { CloudLightning, CheckCircle2, AlertTriangle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { stormQuestions, stormVerdict } from "@/lib/storm-report";
import { StormLeadForm } from "./StormLeadForm";

function verdict(score: number) {
  const v = stormVerdict(score);
  const icon = v.key === "ready" ? CheckCircle2 : v.key === "gaps" ? AlertTriangle : XCircle;
  const tone = v.key === "ready" ? "text-success" : v.key === "gaps" ? "text-warning" : "text-destructive";
  return { ...v, icon, tone };
}

export function StormQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const answered = Object.keys(answers).length;
  const v = verdict(score);

  const finish = () => {
    setDone(true);
    trackEvent("get_help_start", { category: "storm-quiz", score });
  };

  const reset = () => {
    setAnswers({});
    setLabels({});
    setDone(false);
  };

  if (done) {
    const Icon = v.icon;
    return (
      <div className="rounded-2xl border border-border bg-background p-6 lg:p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Icon className={cn("h-7 w-7", v.tone)} aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Your storm-readiness score</p>
        <p className="text-5xl font-bold text-foreground">{score}<span className="text-2xl text-muted-foreground">/100</span></p>
        <h2 className="mt-3 text-2xl font-bold text-foreground">{v.title}</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">{v.body}</p>
        <div className="mx-auto mt-6 max-w-xl text-left">
          <StormLeadForm score={score} answers={answers} labels={labels} />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" href="/get-help?category=other">
            Fix my gaps
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="outline" href="/guides/backup-checklist-small-business">
            Run the backup checklist
          </Button>
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Retake the quiz
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Question {Math.min(answered + 1, 5)} of 5
        </span>
        <span className="text-muted-foreground">{answered * 20}/100 so far</span>
      </div>
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(answered / 5) * 100}%` }} />
      </div>
      <div className="space-y-8">
        {stormQuestions.map((qq, qi) => (
          <fieldset key={qq.id} disabled={qi > answered} className={cn(qi > answered && "opacity-40")}>
            <legend className="mb-3 text-lg font-semibold text-foreground">
              {qi + 1}. {qq.q}
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {qq.options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => {
                    setAnswers((a) => ({ ...a, [qq.id]: o.score }));
                    setLabels((l) => ({ ...l, [qq.id]: o.label }));
                    if (qi === 4) finish();
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left text-sm transition-all hover:-translate-y-0.5",
                    answers[qq.id] === o.score
                      ? "border-primary bg-primary/10 font-medium text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <CloudLightning className="h-4 w-4 text-primary" aria-hidden="true" />
        Takes 60 seconds. No email required — your answers stay on this device.
      </p>
    </div>
  );
}
