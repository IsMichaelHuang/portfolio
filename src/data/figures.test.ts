import { describe, expect, it } from "vitest";
import { experience, heroFigure } from "./experience";
import { featured, hackathons } from "./work";

const runs = (highlights: string[]) =>
  highlights.join(" ").split("**").filter((_, i) => i % 2 === 1);

const leads = (value: string, highlights: string[]) =>
  runs(highlights).some((r) => r === value || r.startsWith(`${value} `));

const entries = [...experience, ...featured];

describe("figures", () => {
  it("each figure leads a bold run in its own entry", () => {
    for (const e of entries) {
      if (e.figure) expect(leads(e.figure.value, e.highlights)).toBe(true);
    }
  });

  it("the hero figure leads a bold run of credit-karma", () => {
    const ck = experience.find((e) => e.id === "credit-karma")!;
    expect(leads(heroFigure.value, ck.highlights)).toBe(true);
  });

  it("matches the agreed values and units", () => {
    const got = Object.fromEntries(entries.map((e) => [e.id, e.figure]));
    expect(got).toMatchObject({
      "credit-karma": {
        value: "~15,000",
        unit: "AI workflow runs per day",
      },
      "dynamic-experts": { value: "157", unit: "unit tests" },
      solidigm: {
        value: "~30%",
        unit: "fewer false-positive failures",
      },
      "budget-tracker": {
        value: "249",
        unit: "Vitest and Supertest tests",
      },
      "resume-builder": { value: "61", unit: "pytest tests" },
    });
    expect(got["light-commands"]).toBeUndefined();
    expect(heroFigure).toEqual({
      value: "~70",
      unit:
        "pull requests a day, reviewed by an AI code review agent " +
        "I built at Intuit Credit Karma.",
    });
  });

  it("every hackathon place is the same", () => {
    expect(new Set(hackathons.map((h) => h.place))).toEqual(
      new Set(["2nd"]),
    );
  });
});
