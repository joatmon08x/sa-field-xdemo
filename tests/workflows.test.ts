import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DECK_BEATS_101, DEMO_TRACKS, WORKFLOWS, deckBeats101Sequence } from "@/lib/workflows/meta";

const root = process.cwd();

describe("prompt sync", () => {
  it("keeps README prompts and howto demo prompts in sync with metadata", () => {
    const readme = readFileSync(join(root, "README.md"), "utf8");
    const howto = readFileSync(join(root, "demo-howto.md"), "utf8");
    for (const workflow of WORKFLOWS) {
      expect(
        readme,
        `README is missing the ${workflow.slug} prompt from lib/workflows/meta.ts`,
      ).toContain(workflow.prompt);
      expect(
        howto,
        `demo-howto.md is missing the ${workflow.slug} demo prompt from lib/workflows/meta.ts`,
      ).toContain(workflow.demoPrompt);
      expect(workflow.demoPrompt).toContain("lib/workflows/meta.ts");
      expect(workflow.demoPrompt).toContain(workflow.slug);
    }

    const track101 = DEMO_TRACKS.find((track) => track.id === "101");
    const track201 = DEMO_TRACKS.find((track) => track.id === "201");
    const advanced = DEMO_TRACKS.find((track) => track.id === "advanced");

    expect(track101?.workflowSlugs).toEqual([]);
    expect(track101?.description).toBe(
      "You will explore different ways to work in Cursor, use modes and models for the right tasks, apply rules and skills to ensure consistent quality, and complete at least one task with an agent.",
    );
    expect(track201?.workflowSlugs).toEqual(["multitask", "loop", "autopilot", "orchestrate"]);
    expect(advanced?.workflowSlugs).toContain("goal");
    expect(track101?.workflowSlugs).not.toContain("goal");
    expect(track201?.workflowSlugs).not.toContain("goal");

    for (const workflow of WORKFLOWS) {
      const expectedTracks = DEMO_TRACKS.filter((track) =>
        track.workflowSlugs.some((slug) => slug === workflow.slug),
      ).map((track) => track.id);
      expect(workflow.tracks).toEqual(expectedTracks);
    }

    const autopilot = WORKFLOWS.find((workflow) => workflow.slug === "autopilot");

    expect(autopilot?.command).toBe("/autopilot");
    expect(autopilot?.prompt.startsWith("/autopilot")).toBe(true);
    expect(autopilot?.prompt).not.toContain("/goal");
    expect(autopilot?.blurb).toContain("/babysit");

    const skill = readFileSync(
      join(root, ".cursor/skills/choose-cursor-workflow/SKILL.md"),
      "utf8",
    );
    expect(skill).toContain(track101?.description ?? "");
    expect(deckBeats101Sequence()).toBe(
      "Ask → Plan → Build in Agent mode → Debug → Change to a fast model → Plan to fix the bug → Run Mode Allowlist → Change to a deep / intelligent model → Redact (partial) → Stop the prompt → Interrupt and steer → Review diffs → Create a user rule → Test the rule → Create a user skill → Test the skill → Canvas → MCP / Figma",
    );

    expect(DECK_BEATS_101.map((beat) => beat.id)).toEqual([
      "ask",
      "plan",
      "agent-build",
      "debug",
      "model-fast",
      "fix",
      "allowlist",
      "model-deep",
      "start-and-stop",
      "stop",
      "interrupt-steer",
      "diffs",
      "rule",
      "test-rule",
      "skill",
      "test-skill",
      "canvas",
      "mcp",
    ]);

    const beat = (id: (typeof DECK_BEATS_101)[number]["id"]) =>
      DECK_BEATS_101.find((entry) => entry.id === id);
    const example = (id: (typeof DECK_BEATS_101)[number]["id"]) => {
      const entry = beat(id);
      return entry && "example" in entry ? entry.example : undefined;
    };

    expect(example("ask")).toBe("/ask Tell me what this application does in 3 sentences");
    expect(example("plan")).toBe(
      "/plan I want a new feature to update the customer email in the invoice detail customer card. Don’t implement email validation.",
    );
    expect("example" in beat("agent-build")!).toBe(false);
    expect(example("debug")).toBe("/debug the failing test");
    expect(example("model-fast")).toBe("/model.");
    expect(example("fix")).toBe("/plan draft a plan to fix the bug");
    expect("example" in beat("allowlist")!).toBe(false);
    expect(beat("allowlist")?.detail).toBe(
      "Go to Settings → Agents → Executions & Approvals → Run Mode → Allowlist.",
    );
    expect(example("model-deep")).toBe("/model");
    expect(beat("start-and-stop")?.title).toBe("Redact (partial)");
    expect(example("start-and-stop")).toBe(
      "Redact the customer email in the UI. The first two characters and domain are plaintext.",
    );
    expect("example" in beat("stop")!).toBe(false);
    expect(beat("stop")?.detail).toBe("Stop the prompt with the Stop button.");
    expect(example("interrupt-steer")).toBe(
      "Redact the customer email in the UI. Show it in plaintext if I click an icon. Stop every time you change a file for me to review.",
    );
    expect("example" in beat("diffs")!).toBe(false);
    expect(example("rule")).toBe(
      "/create-rule New features should use the new API instead of the legacy API. This is a personal rule.",
    );
    expect(example("test-rule")).toBe(
      "Add a new feature to show the current cap for dispute credit. Make clear which API you’re referencing.",
    );
    expect(example("skill")).toBe(
      "/create-skill Use domain-driven design to break down the domains in this application and match it to available APIs or data schemas. This is a personal skill.",
    );
    expect(example("test-skill")).toBe("Use domain-driven design on this application. Do not edit files.");
    expect(beat("canvas")?.title).toBe("Canvas");
    expect(example("canvas")).toBe("Create a canvas explaining what we did today.");
    expect(beat("mcp")?.title).toBe("MCP / Figma");
    expect(beat("mcp")?.detail).toContain("Customize > MCP > Figma");
    expect(example("mcp")).toContain("Figma Slides");

    const loop = WORKFLOWS.find((workflow) => workflow.slug === "loop");

    expect(loop?.prompt.startsWith("/loop")).toBe(true);
    expect(loop?.prompt).toContain("POST http://127.0.0.1:43173/api/demo/job");
    expect(autopilot?.prompt).toContain("no open pull request");
  });
});
