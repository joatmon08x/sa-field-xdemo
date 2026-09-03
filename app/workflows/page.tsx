import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DECK_BEATS_101,
  DEMO_TRACKS,
  getWorkflow,
  type WorkflowMeta,
} from "@/lib/workflows/meta";

export const metadata = { title: "Workflows" };

function PasteBlock({
  text,
  label = "Paste in Cursor",
  compact = true,
}: {
  text: string;
  label?: string;
  compact?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <CopyButton text={text} label="Copy" />
      </div>
      <pre
        className={
          compact
            ? "max-h-52 overflow-auto rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed whitespace-pre-wrap"
            : "overflow-auto rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed whitespace-pre-wrap"
        }
      >
        {text}
      </pre>
    </div>
  );
}

function WorkflowCard({ workflow }: { workflow: WorkflowMeta }) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.08em] text-indigo uppercase">
              {workflow.command}
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">{workflow.title}</h3>
          </div>
          <Badge variant="secondary" className="shrink-0 font-normal">
            {workflow.handsOver}
          </Badge>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{workflow.blurb}</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">When:</span> {workflow.when}
        </p>
        {workflow.setup ? (
          <p className="rounded-md bg-indigo-soft px-3 py-2 text-xs leading-relaxed text-foreground">
            <span className="font-medium">Before you paste:</span> {workflow.setup}
          </p>
        ) : null}
        <div className="mt-auto space-y-3">
          <PasteBlock text={workflow.prompt} />
          <div className="flex justify-end">
            <Button asChild size="sm" variant="ghost" className="text-indigo">
              <Link href={`/workflows/${workflow.slug}`}>
                Full page <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function workflowsFor(slugs: readonly string[]) {
  return slugs.map(getWorkflow).filter((workflow): workflow is WorkflowMeta => workflow !== undefined);
}

export default function WorkflowsPage() {
  const track101 = DEMO_TRACKS.find((track) => track.id === "101");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Demo"
        title="Workflows"
        description="Workshop tracks. Copy a prompt into Cursor and review the result."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="#track-101">101 track</Link>
            </Button>
          </div>
        }
      />

      {track101 ? (
        <section id="track-101" className="scroll-mt-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{track101.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {track101.description}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {DECK_BEATS_101.map((beat) => (
              <Card key={beat.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3">
                  <div className="space-y-1.5">
                    <p className="font-medium">{beat.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{beat.detail}</p>
                  </div>
                  {"example" in beat && beat.example ? (
                    <div className="mt-auto">
                      <PasteBlock text={beat.example} compact={false} />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>

          {track101.workflowSlugs.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {workflowsFor(track101.workflowSlugs).map((workflow) => (
                <WorkflowCard key={`101-${workflow.slug}`} workflow={workflow} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
