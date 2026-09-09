/**
 * Cursor workflows as they appear on /workflows and in the README.
 * Prompts are the source of truth — the README test requires them verbatim.
 */

export type DemoTrack = "101" | "201" | "advanced";

export type WorkflowMeta = {
  slug: "multitask" | "loop" | "autopilot" | "goal" | "orchestrate";
  command: string;
  title: string;
  handsOver: string;
  when: string;
  blurb: string;
  tracks: DemoTrack[];
  setup?: string;
  demoPrompt: string;
  prompt: string;
};

/**
 * Outline `prompt_type`. Not rendered on /workflows — a later skill uses it to
 * keep reusable prompts, rewrite adaptable ones for a non-Ledgerly demo, and
 * skip beats with none.
 */
export type BeatPromptType = "reusable" | "adaptable" | "none";

export const DECK_BEATS_101 = [
  {
    id: "ask",
    title: "Ask",
    section: "How do I write my first prompt?",
    prompt_type: "reusable" as const,
    detail:
      "Let’s ask questions about the application. In Ask mode, the agent understands the files. It is read-only.",
    example: "/ask Tell me what this application does in 3 sentences",
  },
  {
    id: "plan",
    title: "Plan",
    section: "How do I write my first prompt?",
    prompt_type: "adaptable" as const,
    detail: "Let’s plan out the feature. In Plan mode, the agent maps its approach.",
    example: "/plan I want a new feature to update the customer email in the invoice detail customer card. Don’t implement email validation.",
  },
  {
    id: "agent-build",
    title: "Build in Agent mode",
    section: "How do I write my first prompt?",
    prompt_type: "none" as const,
    detail:
      "Agent mode is the default. It makes the change. Build the plan locally. Check the feature in the UI.",
  },
  {
    id: "debug",
    title: "Debug",
    section: "How do I write my first prompt?",
    prompt_type: "reusable" as const,
    detail:
      "Let’s try to fix it using Debug mode. In Debug mode, you verify the change and investigate and fix any issues.",
    example: "/debug the failing test",
  },
  {
    id: "model-fast",
    title: "Change to a fast model",
    section: "How do I write my first prompt?",
    prompt_type: "adaptable" as const,
    detail: "Let’s change the model to something faster. Change model from Auto to Fast.",
    example: "/model.",
  },
  {
    id: "fix",
    title: "Plan to fix the bug",
    section: "How do I write my first prompt?",
    prompt_type: "adaptable" as const,
    detail: "Show shift-tab to toggle between modes.",
    example: "/plan draft a plan to fix the bug",
  },
  {
    id: "allowlist",
    title: "Run Mode Allowlist",
    section: "How do I work with an AI agent?",
    prompt_type: "none" as const,
    detail: "Go to Settings → Agents → Executions & Approvals → Run Mode → Allowlist.",
  },
  {
    id: "model-deep",
    title: "Change to a deep / intelligent model",
    section: "How do I work with an AI agent?",
    prompt_type: "reusable" as const,
    detail: "Change model to intelligent model.",
    example: "/model",
  },
  {
    id: "start-and-stop",
    title: "Redact (partial)",
    section: "How do I work with an AI agent?",
    prompt_type: "adaptable" as const,
    detail:
      "Update the email feature; security recommended redacting a portion of the customer email.",
    example: "Redact the customer email in the UI. The first two characters and domain are plaintext.",
  },
  {
    id: "stop",
    title: "Stop the prompt",
    section: "How do I work with an AI agent?",
    prompt_type: "none" as const,
    detail: "Stop the prompt with the Stop button.",
  },
  {
    id: "interrupt-steer",
    title: "Interrupt and steer",
    section: "How do I work with an AI agent?",
    prompt_type: "adaptable" as const,
    detail: "Steer the prompt. Show how the agent pauses for your approval. Continue each file.",
    example: "Redact the customer email in the UI. Show it in plaintext if I click an icon. Stop every time you change a file for me to review.",
  },
  {
    id: "diffs",
    title: "Review diffs",
    section: "How do I work with an AI agent?",
    prompt_type: "none" as const,
    detail: "Show diffs from agent’s last turn.",
  },
  {
    id: "rule",
    title: "Create a user rule",
    section: "How do I govern my agent?",
    prompt_type: "adaptable" as const,
    detail:
      "Let’s create a user rule so the agent doesn’t do it again. Show the user rule in the UI and how it can be changed.",
    example:
      "/create-rule New features should use the new API instead of the legacy API. This is a personal rule.",
  },
  {
    id: "test-rule",
    title: "Test the rule",
    section: "How do I govern my agent?",
    prompt_type: "adaptable" as const,
    detail: "Check the rule is applied.",
    example:
      "Add a new feature to show the current cap for dispute credit. Make clear which API you’re referencing.",
  },
  {
    id: "skill",
    title: "Create a user skill",
    section: "How do I govern my agent?",
    prompt_type: "adaptable" as const,
    detail:
      "Let’s create a user skill that tells me the domain breakdown and available APIs. Show the user skill in the UI and how it can be changed.",
    example:
      "/create-skill Use domain-driven design to break down the domains in this application and match it to available APIs or data schemas. This is a personal skill.",
  },
  {
    id: "test-skill",
    title: "Test the skill",
    section: "How do I govern my agent?",
    prompt_type: "adaptable" as const,
    detail: "Use the skill (no file edits).",
    example: "Use domain-driven design on this application. Do not edit files.",
  },
  {
    id: "canvas",
    title: "Canvas",
    section: "How do I govern my agent?",
    prompt_type: "reusable" as const,
    detail:
      "Use Canvas to generate interactive artifacts that render next to the chat.",
    example: "Create a canvas explaining what we did today.",
  },
  {
    id: "mcp",
    title: "MCP / Figma",
    section: "How do I govern my agent?",
    prompt_type: "adaptable" as const,
    detail:
      "Ask Cursor to create a slideshow in Figma using MCP Servers. Enable a MCP server for slideshow generation in Cursor. Go to Customize > MCP > Figma.",
    example:
      "Create three slides in Figma Slides outlining how I used Cursor to develop a new feature. I want to use this as part of my demo showcase.",
  },
] as const;

export type DeckBeat101 = (typeof DECK_BEATS_101)[number];

export function deckBeats101Sequence(): string {
  return DECK_BEATS_101.map((beat) => beat.title).join(" → ");
}

export function groupDeckBeats101BySection(): {
  demo: number;
  section: DeckBeat101["section"];
  beats: DeckBeat101[];
}[] {
  const groups: {
    demo: number;
    section: DeckBeat101["section"];
    beats: DeckBeat101[];
  }[] = [];

  for (const beat of DECK_BEATS_101) {
    const last = groups[groups.length - 1];
    if (last && last.section === beat.section) {
      last.beats.push(beat);
    } else {
      groups.push({ demo: groups.length + 1, section: beat.section, beats: [beat] });
    }
  }

  return groups;
}

export const DEMO_TRACKS = [
  {
    id: "101" as const,
    title: "101",
    description:
      "You will explore different ways to work in Cursor, use modes and models for the right tasks, apply rules and skills to ensure consistent quality, and complete at least one task with an agent.",
    workflowSlugs: [] as const,
  },
  {
    id: "201" as const,
    title: "201",
    description:
      "Deck-aligned: orient, migrate the v1 client selection to v2, create the v2-only rule live, customize the agent, choose models, show Cloud Agents and Automations, then breadth, time, PR ownership, planning, and verification.",
    workflowSlugs: ["multitask", "loop", "autopilot", "orchestrate"] as const,
  },
  {
    id: "advanced" as const,
    title: "Advanced",
    description:
      "Deeper Ledgerly scenarios: Cursor CLI primer, durable goals, parallel workers, scheduled checking, PR supervision, planner trees, and verifier evidence.",
    workflowSlugs: ["goal", "multitask", "loop", "autopilot", "orchestrate"] as const,
  },
] as const;

export const WORKFLOWS: WorkflowMeta[] = [
  {
    slug: "multitask",
    command: "/multitask",
    title: "Hands over breadth",
    handsOver: "breadth",
    when: "Many independent pieces of one request.",
    blurb:
      "Four API surfaces, four workers, one finish line. Independent steps run at once; you review one diff per task.",
    tracks: ["201", "advanced"],
    demoPrompt:
      "/multitask Read the multitask entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
    prompt: `/multitask Add the same small request-log helper to Ledgerly's four independent API surfaces: invoices, disputes, Nudge, and Pulse.

Use the dispatch-subagents skill. Launch four api-instrumenter subagents in one parallel turn — one route each:
- app/api/invoices/route.ts and app/api/invoices/[id]/route.ts
- app/api/disputes/route.ts and app/api/disputes/[id]/route.ts
- app/api/mock/nudge/route.ts
- app/api/mock/pulse/route.ts

A shared helper may live under lib/. Each worker starts with clean context; the dispatch prompt must name the files, the helper, and the constraint. After the diffs land, launch the ledgerly-reviewer subagent. Do not touch prices, prisma/seed.ts, prisma/extra-accounts.ts, lib/disputes/suggested-credit-api.ts, or tests/suggested-credit-api.test.ts. I will review one diff per task.`,
  },
  {
    slug: "loop",
    command: "/loop",
    title: "Hands over time",
    handsOver: "time",
    when: "You would otherwise sit and watch a job finish.",
    blurb:
      "Start the local invoice backfill, then let the agent check it on a schedule until it completes — or until you stop the loop.",
    tracks: ["201", "advanced"],
    setup: "Dev server on 43173 (`npm run dev`). The invoice backfill is idle → running → complete over about 45 seconds.",
    demoPrompt:
      "/loop Read the loop entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
    prompt: `/loop 10s Start the invoice backfill if it is idle (POST http://127.0.0.1:43173/api/demo/job), then GET that URL until status is complete, or until I stop the loop.

Do not add GitHub Actions. Do not write to the Ledgerly database. I still review the result.`,
  },
  {
    slug: "autopilot",
    command: "/autopilot",
    title: "Hands over the pull request",
    handsOver: "the pull request",
    when: "An open pull request must become merge-ready.",
    blurb:
      "Current name for the deck's /babysit workflow. It triages comments, resolves clear conflicts, and fixes scoped CI failures. You still merge.",
    tracks: ["201", "advanced"],
    setup:
      "Prepare an open pull request for the current feature branch with one actionable review comment or a scoped failing check.",
    demoPrompt:
      "/autopilot Read the autopilot entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
    prompt: `/autopilot Keep the pull request for the current branch merge-ready.

If this branch has no open pull request, stop and say so. Do not open a PR or merge.

Refresh the live PR state before every pass. Work in this order: merge conflicts, active unresolved review comments (including Bugbot), then failing required checks. Validate each finding before acting. Fix only issues caused by this PR and keep every change inside its scope.

Never change CI checks, workflows, the Ledgerly catalog, prisma/seed.ts, prisma/extra-accounts.ts, or tests/suggested-credit-api.test.ts to get green. Preserve both suggested-credit API routes. Stop and ask if branch intent is ambiguous or a billing, security, privacy, migration, or concurrency comment needs judgment. Report ready only when the PR is mergeable, required checks are green, and every active comment is triaged. Do not merge or enable auto-merge; I still review and merge.`,
  },
  {
    slug: "goal",
    command: "/goal",
    title: "Hands over the objective",
    handsOver: "the objective",
    when: "One objective with a clear finish, and you are still steering.",
    blurb:
      "Pin dispute resolution as one long-lived objective. The agent keeps going across turns until the checks pass. You review the result.",
    tracks: ["advanced"],
    demoPrompt:
      "/goal Read the goal entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
    prompt: `/goal Make Ledgerly demo-complete for dispute resolution.

1. Diagnose why the dispute page still uses the deprecated suggested-credit API, then switch lib/disputes/suggested-credit-api.ts from v1 to v2. Preserve both routes.
2. Implement resolveDispute in lib/disputes/resolve.ts.
3. Make POST /api/disputes/[id]/resolve persist ACCEPTED or DECLINED with the reviewer note.
4. Enable the Accept credit / Decline buttons on app/disputes/[id]/page.tsx.
5. Keep going across turns until npm test is fully green and http://127.0.0.1:43173/disputes/dsp_1043 shows suggested credit at or below the Scale catalog price of $249.

Do not change either suggested-credit route, prisma/seed.ts, prisma/extra-accounts.ts, or tests/suggested-credit-api.test.ts. Preserve the $400 claim. Do not invent a fourth price. When the checks pass, launch the dispute-verifier subagent to report evidence. I still review the result.`,
  },
  {
    slug: "orchestrate",
    command: "/orchestrate",
    title: "Hands over the plan itself",
    handsOver: "the plan itself",
    when: "One objective that first needs its own plan, staffed across agents.",
    blurb:
      "A root planner decomposes dispute resolution and staffs isolated workers. Verifiers check the work. This one is a plugin.",
    tracks: ["201", "advanced"],
    setup: "Install the /orchestrate plugin; put bun on PATH and provide a CURSOR_API_KEY.",
    demoPrompt:
      "/orchestrate Read the orchestrate entry in WORKFLOWS from lib/workflows/meta.ts and run its prompt exactly.",
    prompt: `/orchestrate Make Ledgerly demo-complete for dispute resolution. This is a plugin workflow — you need bun on PATH and a CURSOR_API_KEY (personal key or team service account, not a team admin key). Slack is optional.

Decompose the work. The root planner writes no code. Workers are isolated; every handoff points up. Staff at least:

- Worker: diagnose the deprecated suggested-credit client selection and switch lib/disputes/suggested-credit-api.ts from v1 to v2. Preserve both routes; do not touch tests/suggested-credit-api.test.ts or the seed.
- Worker: implement resolveDispute and POST /api/disputes/[id]/resolve.
- Worker: enable Accept / Decline on app/disputes/[id]/page.tsx.

Launch the dispute-verifier subagent as the verifier: it checks tests/suggested-credit-api.test.ts (or npm test), confirms both suggested-credit routes still work, POSTs accept/decline against dsp_1043, and loads http://127.0.0.1:43173/disputes/dsp_1043. Republish a task if a verifier fails. I still review and merge. Do not invent a fourth price.`,
  },
];

export const PROJECT_AGENTS = [
  {
    name: "ledgerly-reviewer",
    path: ".cursor/agents/ledgerly-reviewer.md",
    when: "After any code change. Diff-only review against catalog prices, seed names, and protected paths.",
  },
  {
    name: "api-instrumenter",
    path: ".cursor/agents/api-instrumenter.md",
    when: "/multitask worker. Add the request-log helper to one named API route and nothing else.",
  },
  {
    name: "dispute-verifier",
    path: ".cursor/agents/dispute-verifier.md",
    when: "/goal and /orchestrate finish line. Report pass/fail evidence; write no product code.",
  },
] as const;

export const PROJECT_SKILLS = [
  {
    name: "choose-cursor-workflow",
    path: ".cursor/skills/choose-cursor-workflow/SKILL.md",
    when: "Pick the 101, 201, or Advanced track, then choose the command from the shape of the work.",
  },
  {
    name: "break-down-plan-to-tickets",
    path: ".cursor/skills/break-down-plan-to-tickets/SKILL.md",
    when: "Turn a plan into individual backlog tickets with acceptance criteria.",
  },
  {
    name: "dispatch-subagents",
    path: ".cursor/skills/dispatch-subagents/SKILL.md",
    when: "Many independent pieces. Launch Task subagents in one parallel turn.",
  },
  {
    name: "hand-to-cloud-agent",
    path: ".cursor/skills/hand-to-cloud-agent/SKILL.md",
    when: "Cloud /goal, /autopilot PR supervision, or an /orchestrate planner tree.",
  },
  {
    name: "autopilot",
    path: "~/.cursor/skills-cursor/autopilot/SKILL.md",
    when: "Current built-in skill for the deck's former /babysit PR workflow.",
  },
  {
    name: "automate",
    path: "~/.cursor/skills-cursor/automate/SKILL.md",
    when: "Open the Cursor Automations editor with a reviewed event- or schedule-driven draft.",
  },
] as const;

export function getWorkflow(slug: string): WorkflowMeta | undefined {
  return WORKFLOWS.find((workflow) => workflow.slug === slug);
}
