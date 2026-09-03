import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DECK_BEATS_101, DEMO_TRACKS, WORKFLOWS } from "@/lib/workflows/meta";

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

    expect(DECK_BEATS_101.map((beat) => beat.id)).toEqual([
      "ask",
      "plan",
      "agent-build",
      "model",
      "debug",
      "create-rule",
      "create-skill",
      "allowlist",
      "stop",
      "interrupt-steer",
    ]);
    expect(DECK_BEATS_101[0]?.example).toBe("/ask Tell me what Ledgerly does in 3 sentences");
    expect(DECK_BEATS_101[1]?.example).toBe("/plan I want a new feature to update the customer email");
    expect("example" in DECK_BEATS_101[2]!).toBe(false);
    expect(DECK_BEATS_101[3]?.example).toBe("/model");
    expect(DECK_BEATS_101[4]?.example).toBe("/debug the failing test");
    expect(DECK_BEATS_101[5]?.example).toBe(
      "/create-rule Customer emails should be redacted in the UI. Show the first two letters and domain in plaintext, redact the other letters.",
    );
    expect(DECK_BEATS_101[6]?.example).toBe(
      "/create-skill Break down a plan into individual tickets in backlog.",
    );
    expect(DECK_BEATS_101[7]?.example).toBe("Force shutdown the application servers");
    expect(DECK_BEATS_101[7]?.detail).toContain("Allowlist");
    expect(DECK_BEATS_101[8]?.example).toBe("Start the application on port 48080.");
    expect(DECK_BEATS_101[9]?.example).toBe("Start the application on its original port");
    expect(DECK_BEATS_101[9]?.detail).toContain("open the invoices view");

    const loop = WORKFLOWS.find((workflow) => workflow.slug === "loop");

    expect(loop?.prompt.startsWith("/loop")).toBe(true);
    expect(loop?.prompt).toContain("POST http://127.0.0.1:43173/api/demo/job");
    expect(autopilot?.prompt).toContain("no open pull request");
  });
});
