import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ModeStrip from "@/components/ModeStrip";
import TVCaseStudy from "@/components/case-study/TVCaseStudy";
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
      <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#1c140e] px-4 pb-28 pt-5 sm:px-8">
        {/* the same painted room, lights down, while the TV plays */}
        <div aria-hidden="true" className="absolute inset-0">
          <Image src="/world/scenes/work-room.webp" alt="" fill sizes="100vw" className="object-cover opacity-35 blur-[2px]" />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link href="/work" className="inline-flex min-h-11 items-center rounded-full bg-[#1c1b1d]/80 px-4 text-sm font-bold text-[#f6eedc] backdrop-blur">
            ← Back to the box
          </Link>
          <h1 className="text-right text-sm font-bold uppercase tracking-[0.18em] text-[#f6eedc]">
            {project.title}
            <span className="block text-xs font-semibold normal-case tracking-normal text-[#f6eedc]/70">{project.client}</span>
          </h1>
        </div>
        <div className="relative z-10 flex flex-1 items-center justify-center py-4">
          <TVCaseStudy project={project} next={next} />
        </div>
      </main>
      <ModeStrip current="/work" />
    </>
  );
}
