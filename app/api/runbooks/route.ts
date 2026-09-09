import { NextResponse } from "next/server";
import { RUNBOOK_TRACKS } from "@/lib/runbooks/meta";

export async function GET() {
  return NextResponse.json({
    tracks: RUNBOOK_TRACKS.map((track) => ({
      id: track.id,
      title: track.title,
      description: track.description,
      href: `/runbooks/${track.id}`,
      runbookSlugs: [...track.runbookSlugs],
      sections: track.sections.map((section) => ({
        id: section.id,
        title: section.title,
        href: `/runbooks/${track.id}#${section.id}`,
      })),
    })),
  });
}
