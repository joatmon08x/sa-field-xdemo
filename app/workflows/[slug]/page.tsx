import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkflow } from "@/lib/workflows/meta";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getWorkflow(slug);
  return { title: meta ? `Workflows · ${meta.command}` : "Workflows" };
}

export default async function WorkflowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getWorkflow(slug);
  if (!meta) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={meta.command}
        title={meta.title}
        description={meta.blurb}
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/workflows">
              <ChevronLeft className="size-4" /> All workflows
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Tracks:</span>
        {meta.tracks.map((track) => (
          <Badge key={track} variant="secondary">
            {track === "101" ? "101" : track === "201" ? "201" : "Advanced"}
          </Badge>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-0">
          <CardTitle className="text-base">Demo prompt</CardTitle>
          <CopyButton text={meta.demoPrompt} />
        </CardHeader>
        <CardContent className="pt-3">
          <pre className="overflow-auto rounded-lg border border-border bg-muted/60 p-3 text-sm leading-relaxed whitespace-pre-wrap">
            {meta.demoPrompt}
          </pre>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">When:</span> {meta.when} You still review the
            result.
          </p>
          {meta.setup ? (
            <p className="mt-2 rounded-md bg-indigo-soft px-3 py-2 text-xs leading-relaxed text-foreground">
              <span className="font-medium">Before this beat:</span> {meta.setup}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <details className="rounded-lg border border-border bg-card">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
          Full scope and guardrails
        </summary>
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              The demo prompt tells the agent to load this canonical instruction before acting.
            </p>
            <CopyButton text={meta.prompt} label="Copy full prompt" />
          </div>
          <pre className="max-h-105 overflow-auto rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed whitespace-pre-wrap">
            {meta.prompt}
          </pre>
        </div>
      </details>
    </div>
  );
}
