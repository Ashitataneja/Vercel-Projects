import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ModeStrip from "@/components/ModeStrip";
import CaseHeader from "@/components/case-study/CaseHeader";
import NextTicket from "@/components/case-study/NextTicket";
import { projects } from "@/lib/site";

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
          {/* The full write-up (problem, field notes, turning points, where it landed) is on its way. */}
          <section className="rounded-2xl border-[3px] border-ink bg-cream p-6 shadow-[5px_5px_0_var(--color-ink)] sm:p-8">
            <h2 className="font-display text-3xl uppercase">Being written up</h2>
            <p className="mt-3 max-w-prose text-lg">
              I&apos;m putting this case study into words. Until it&apos;s here, I&apos;d love to walk you through it myself.
            </p>
            <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center rounded-full border-[3px] border-ink bg-butter px-5 font-bold shadow-[3px_3px_0_var(--color-ink)]">
              Ring me up →
            </Link>
          </section>
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
