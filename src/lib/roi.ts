import { monthlyPlans, type BusinessPlan } from "./plans";

/**
 * Downtime-ROI math — single source of truth shared by the /roi calculator,
 * the business-case PDF, and the emailed report. Same numbers everywhere.
 */

export interface RoiInputs {
  employees: number;
  hourlyCost: number;
  incidentsPerYear: number;
  hoursEach: number;
}

export interface RoiPlanRow {
  plan: BusinessPlan;
  annual: number;
  avoided: number;
  net: number;
}

export interface RoiResult {
  inputs: RoiInputs;
  downtimeYear: number;
  devices: number;
  rows: RoiPlanRow[];
  best: RoiPlanRow;
}

const PREVENTED: Record<string, number> = {
  essentials: 0.4,
  managed: 0.7,
  complete: 0.85,
};

export function computeRoi(inputs: RoiInputs): RoiResult {
  const downtimeYear =
    inputs.employees * inputs.hourlyCost * inputs.incidentsPerYear * inputs.hoursEach;
  const devices = Math.ceil(inputs.employees * 1.2);
  const rows = monthlyPlans.map((plan) => {
    const annual = plan.price * 12;
    const prevented = PREVENTED[plan.id] ?? 0.5;
    const avoided = Math.round(downtimeYear * prevented);
    return { plan, annual, avoided, net: avoided - annual };
  });
  const best = rows.reduce((a, b) => (b.net > a.net ? b : a));
  return { inputs, downtimeYear, devices, rows, best };
}

export function money0(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
