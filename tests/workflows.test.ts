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
      "Ask → Plan → Build in Agent mode → Debug → Plan the fix → Change to a fast model → Change to a deep model → Stop → Interrupt and steer → Build and review diffs → Create a project rule → Create a project skill → Canvas → MCP server",
    );

    for (const beat of DECK_BEATS_101) {
      expect(beat.example, `${beat.id} is missing an example prompt`).toBeTruthy();
    }

    expect(DECK_BEATS_101.map((beat) => beat.id)).toEqual([
      "ask",
      "plan",
      "agent-build",
      "debug",
      "plan-fix",
      "model-fast",
      "model-intelligent",
      "stop",
      "interrupt-steer",
      "diffs",
      "rule",
      "skill",
      "canvas",
      "mcp",
    ]);

    const beat = (id: (typeof DECK_BEATS_101)[number]["id"]) =>
      DECK_BEATS_101.find((entry) => entry.id === id);

    expect(beat("ask")?.example).toBe("/ask Tell me what this application does in 3 sentences");
    expect(beat("plan")?.example).toBe("/plan I want a new feature to update the customer email");
    expect(beat("agent-build")?.example).toBe("Build the plan locally.");
    expect(beat("debug")?.example).toBe("/debug the failing test");
    expect(beat("plan-fix")?.example).toBe("/plan draft a plan to fix the bug");
    expect(beat("model-fast")?.example).toBe("/model build the fix");
    expect(beat("model-intelligent")?.example).toBe(
      "/model /plan Redact the customer email in the UI. The first two characters and domain are plaintext.",
    );
    expect(beat("stop")?.example).toBe("Ask me questions if you are uncertain. Start the plan again.");
    expect(beat("interrupt-steer")?.example).toBe(
      "/plan Redact the customer email in the UI. Show it in plaintext if I click an icon.",
    );
    expect(beat("diffs")?.example).toBe(
      "Go build it, I’m going to do something else. Let me know when you have a working feature.",
    );
    expect(beat("rule")?.example).toBe(
      "/create-rule New features should use the new API instead of the legacy API.",
    );
    expect(beat("skill")?.example).toBe(
      "/create-skill Use domain-driven design to break down the domains in this application and match it to available APIs or data schemas.",
    );
    expect(beat("canvas")?.title).toBe("Canvas");
    expect(beat("canvas")?.example).toBe("Create a canvas explaining what we did today.");
    expect(beat("mcp")?.title).toBe("MCP server");
    expect(beat("mcp")?.detail).toContain("Customize → MCP");
    expect(beat("mcp")?.example).toContain("Google Slides");

    const loop = WORKFLOWS.find((workflow) => workflow.slug === "loop");

    expect(loop?.prompt.startsWith("/loop")).toBe(true);
    expect(loop?.prompt).toContain("POST http://127.0.0.1:43173/api/demo/job");
    expect(autopilot?.prompt).toContain("no open pull request");
  });
});
