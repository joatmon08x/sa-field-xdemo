import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RUNBOOK_TRACKS,
  getRunbook,
  getRunbookTrack,
  type DemoSection,
  type RunbookMeta,
} from "@/lib/runbooks/meta";

function PasteBlock({ text, label = "Paste in Cursor" }: { text: string; label?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <CopyButton text={text} label="Copy" />
      </div>
      <pre className="overflow-auto rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}

function RunbookCard({ runbook }: { runbook: RunbookMeta }) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.08em] text-indigo uppercase">
              {runbook.command}
            </p>
            <h4 className="mt-1 text-lg font-semibold tracking-tight">{runbook.title}</h4>
          </div>
          <Badge variant="secondary" className="shrink-0 font-normal">
            {runbook.handsOver}
          </Badge>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{runbook.blurb}</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">When:</span> {runbook.when}
        </p>
        {runbook.setup ? (
          <p className="rounded-md bg-indigo-soft px-3 py-2 text-xs leading-relaxed text-foreground">
            <span className="font-medium">Before you paste:</span> {runbook.setup}
          </p>
        ) : null}
        <div className="mt-auto space-y-3">
          <PasteBlock text={runbook.prompt} />
          <div className="flex justify-end">
            <Button asChild size="sm" variant="ghost" className="text-indigo">
              <Link href={`/runbooks/commands/${runbook.slug}`}>
                Full page <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function generateStaticParams() {
  return RUNBOOK_TRACKS.map((track) => ({ track: track.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const selectedTrack = getRunbookTrack(track);
  return { title: selectedTrack ? `Runbooks · ${selectedTrack.title}` : "Runbooks" };
}

export default async function RunbookTrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track: trackId } = await params;
  const track = getRunbookTrack(trackId);
  if (!track) notFound();
  const sections = track.sections as readonly DemoSection[];

  const runbooks = track.runbookSlugs
    .map(getRunbook)
    .filter((runbook): runbook is RunbookMeta => runbook !== undefined);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Demo catalog"
        title="Runbooks"
        description="Choose a track, jump to a section, and copy the next beat into Cursor."
      />

      <nav aria-label="Runbook tracks" className="flex flex-wrap gap-2">
        {RUNBOOK_TRACKS.map((entry) => (
          <Button
            key={entry.id}
            asChild
            size="sm"
            variant={entry.id === track.id ? "default" : "outline"}
          >
            <Link
              href={`/runbooks/${entry.id}`}
              aria-current={entry.id === track.id ? "page" : undefined}
            >
              {entry.title}
            </Link>
          </Button>
        ))}
      </nav>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{track.title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {track.description}
          </p>
        </div>

        <nav
          aria-label={`${track.title} demo sections`}
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {sections.map((section) => (
            <Button key={section.id} asChild size="sm" variant="outline" className="shrink-0">
              <Link href={`#${section.id}`}>{section.title}</Link>
            </Button>
          ))}
          {runbooks.length > 0 ? (
            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link href="#runbook-commands">Runbook commands</Link>
            </Button>
          ) : null}
        </nav>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 space-y-3">
              <h3 className="text-lg font-semibold tracking-tight">{section.title}</h3>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {section.beats.map((beat) => (
                  <Card key={beat.id} className="flex flex-col">
                    <CardContent className="flex flex-1 flex-col gap-3">
                      <div className="space-y-1.5">
                        <p className="font-medium">{beat.title}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {beat.detail}
                        </p>
                      </div>
                      {beat.example ? (
                        <div className="mt-auto">
                          <PasteBlock text={beat.example} label={beat.pasteLabel} />
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {runbooks.length > 0 ? (
          <section id="runbook-commands" className="scroll-mt-24 space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Runbook commands</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {runbooks.map((runbook) => (
                <RunbookCard key={`${track.id}-${runbook.slug}`} runbook={runbook} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}
