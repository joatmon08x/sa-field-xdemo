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

export const DEMO_TRACKS = [
  {
    id: "101" as const,
    title: "101",
    description:
      "Ask → Plan → Agent, then /model, /debug, /create-rule, and /create-skill: orient on Ledgerly, plan and build a customer email update, change the model, fix a failing test, and add a project rule and skill.",
    workflowSlugs: [] as const,
  },
  {
    id: "201" as const,
    title: "201",
    description:
      "Deck-aligned: orient, customize the agent, choose models, show Cloud Agents and Automations, then breadth, time, PR ownership, planning, and verification.",
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

export const DECK_BEATS_101 = [
  {
    id: "ask",
    title: "Ask",
    detail: "Read-only orientation before planning.",
    example: "/ask Tell me what Ledgerly does in 3 sentences",
  },
  {
    id: "plan",
    title: "Plan",
    detail: "Switch to Plan mode and scope the customer email feature.",
    example: "/plan I want a new feature to update the customer email",
  },
  {
    id: "agent-build",
    title: "Agent mode to build",
    detail: "Switch to Agent mode and implement the plan. Review the diff before accepting.",
  },
  {
    id: "model",
    title: "Model",
    detail: "Change the model for the next pass.",
    example: "/model",
  },
  {
    id: "debug",
    title: "Debug",
    detail: "Fix a bug with Debug mode on the failing test.",
    example: "/debug the failing test",
  },
  {
    id: "create-rule",
    title: "Create a rule",
    detail:
      "Use /create-rule to add a project guardrail, then open `.cursor/rules` to review what was written.",
    example:
      "/create-rule Customer emails should be redacted in the UI. Show the first two letters and domain in plaintext, redact the other letters.",
  },
  {
    id: "create-skill",
    title: "Create a project skill",
    detail:
      "Use /create-skill to add a project skill, then open `.cursor/skills` to review what was written.",
    example: "/create-skill Break down a plan into individual tickets in backlog.",
  },
  {
    id: "allowlist",
    title: "Allowlist",
    detail:
      "Go to Settings → Agent → Execution & Approvals and change to Allowlist. Paste the prompt; Cursor should ask to allow Run before shutting the app down.",
    example: "Force shutdown the application servers",
  },
  {
    id: "stop",
    title: "Stop",
    detail: "Paste the prompt so the agent starts a long-running command, then stop the command.",
    example: "Start the application on port 48080.",
  },
  {
    id: "interrupt-steer",
    title: "Interrupt and steer",
    detail:
      'Submit the prompt, then edit inline to: "Start the application on its original port and open the invoices view".',
    example: "Start the application on its original port",
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

A shared helper may live under lib/. Each worker starts with clean context; the dispatch prompt must name the files, the helper, and the constraint. After the diffs land, launch the ledgerly-reviewer subagent. Do not touch prices, prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. I will review one diff per task.`,
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

Never change CI checks, workflows, the Ledgerly catalog, prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts to get green. Stop and ask if branch intent is ambiguous or a billing, security, privacy, migration, or concurrency comment needs judgment. Report ready only when the PR is mergeable, required checks are green, and every active comment is triaged. Do not merge or enable auto-merge; I still review and merge.`,
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

1. Cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price from lib/plans.ts.
2. Implement resolveDispute in lib/disputes/resolve.ts.
3. Make POST /api/disputes/[id]/resolve persist ACCEPTED or DECLINED with the reviewer note.
4. Enable the Accept credit / Decline buttons on app/disputes/[id]/page.tsx.
5. Keep going across turns until npm test is fully green and http://127.0.0.1:43173/disputes/dsp_1043 shows suggested credit at or below the Scale catalog price of $249.

Do not change prisma/seed.ts, prisma/extra-accounts.ts, or tests/dispute-credit.test.ts. Do not invent a fourth price. When the checks pass, launch the dispute-verifier subagent to report evidence. I still review the result.`,
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

- Worker: cap suggestDisputeCredit in lib/dispute-credit.ts at the catalog plan price. Do not touch tests/dispute-credit.test.ts or the seed.
- Worker: implement resolveDispute and POST /api/disputes/[id]/resolve.
- Worker: enable Accept / Decline on app/disputes/[id]/page.tsx.

Launch the dispute-verifier subagent as the verifier: it checks tests/dispute-credit.test.ts (or npm test), POSTs accept/decline against dsp_1043, and loads http://127.0.0.1:43173/disputes/dsp_1043. Republish a task if a verifier fails. I still review and merge. Do not invent a fourth price.`,
  },
];

export const PROJECT_AGENTS = [
  {
    name: "ledgerly-reviewer",
    path: ".cursor/agents/ledgerly-reviewer.md",
    when: "After any code change. Diff-only review against catalog prices, seed names, and planted seams.",
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
