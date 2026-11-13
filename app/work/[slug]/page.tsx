import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ModeStrip from "@/components/ModeStrip";
import CaseHeader from "@/components/case-study/CaseHeader";
import CaseStop from "@/components/case-study/CaseStop";
import NextTicket from "@/components/case-study/NextTicket";
import { caseStops, projects } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p ? p.title : "Work" };
}

export default async function CaseStudy({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const project = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <main className="min-h-dvh bg-paper pb-36">
        <CaseHeader project={project} />
        <div className="mx-auto max-w-4xl space-y-20 px-5 pt-20 sm:px-10">
          {caseStops.map((s, n) => (
            <CaseStop key={s.id} n={n + 1} id={s.id} title={s.title} />
          ))}
          <div className="space-y-6">
            <NextTicket next={next} />
            <Link href="/work" className="inline-flex min-h-11 items-center font-semibold underline decoration-wood decoration-2 underline-offset-4">
              ← Back to the box office
            </Link>
          </div>
        </div>
      </main>
      <ModeStrip current="/work" />
    </>
  );
}
