import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FAQAccordion } from "./FAQAccordion";

const items = [
  { q: "Question one?", a: "Answer one." },
  { q: "Question two?", a: "Answer two." },
];

function getButton(text: string): HTMLButtonElement {
  const btn = screen.getByText(text).closest("button");
  if (!btn) throw new Error(`Button not found for text: ${text}`);
  return btn;
}

describe("FAQAccordion", () => {
  it("renders all questions", () => {
    render(<FAQAccordion items={items} />);
    expect(screen.getByText("Question one?")).toBeDefined();
    expect(screen.getByText("Question two?")).toBeDefined();
  });

  it("starts with all answers collapsed", () => {
    render(<FAQAccordion items={items} />);
    expect(getButton("Question one?").getAttribute("aria-expanded")).toBe("false");
    expect(getButton("Question two?").getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles aria-expanded on click", () => {
    render(<FAQAccordion items={items} />);
    const btn1 = getButton("Question one?");
    fireEvent.click(btn1);
    expect(btn1.getAttribute("aria-expanded")).toBe("true");
    expect(getButton("Question two?").getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles same answer off on second click", () => {
    render(<FAQAccordion items={items} />);
    const btn1 = getButton("Question one?");
    fireEvent.click(btn1);
    expect(btn1.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(btn1);
    expect(btn1.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders answer text in DOM", () => {
    render(<FAQAccordion items={items} />);
    expect(() => screen.getByText("Answer one.")).not.toThrow();
    expect(() => screen.getByText("Answer two.")).not.toThrow();
  });
});
