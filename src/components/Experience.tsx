"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { experiences } from "@/data/site";

export default function Experience() {
  // Open on the most recent experience.
  const [active, setActive] = useState(experiences.length - 1);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const next = (index + experiences.length) % experiences.length;
    setActive(next);
    nodeRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: experiences.length - 1,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    select(moves[e.key]);
  };

  const progress =
    experiences.length > 1 ? (active / (experiences.length - 1)) * 100 : 0;

  return (
    <section id="experience" className="px-6 py-16 sm:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-5xl font-bold leading-[1.05] tracking-tight text-navy-900 sm:text-7xl">
          Experience
        </h2>

        {/* Every panel shares one grid cell so the section keeps the tallest height. */}
        <div className="mt-12 grid">
          {experiences.map((exp, i) => {
            const shown = i === active;
            return (
              <div
                key={`${exp.year}-${exp.organization}`}
                id={`experience-panel-${i}`}
                role="tabpanel"
                aria-labelledby={`experience-tab-${i}`}
                inert={!shown}
                className={`col-start-1 row-start-1 grid items-center gap-6 transition-[opacity,translate] duration-300 sm:grid-cols-2 sm:gap-10 ${
                  shown ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy-600">
                    {exp.dates}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-navy-900 sm:text-3xl">
                    {exp.organization}
                  </h3>
                  <p className="mt-1 text-lg text-navy-400">{exp.title}</p>
                  <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-navy-700 marker:text-navy-400">
                    {exp.description.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-navy-100 bg-navy-50">
                  <Image
                    src={exp.image}
                    alt={exp.organization}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-16">
          {/* Track runs between the first and last node centers. */}
          <div className="absolute inset-x-7 top-7 h-1 -translate-y-1/2 rounded-full bg-navy-100" aria-hidden>
            <div
              className="h-full rounded-full bg-navy-800 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            role="tablist"
            aria-label="Experience timeline"
            onKeyDown={onKeyDown}
            className="relative flex justify-between"
          >
            {experiences.map((exp, i) => {
              const selected = i === active;
              const reached = i <= active;
              return (
                <button
                  key={`${exp.year}-${exp.organization}`}
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  id={`experience-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`experience-panel-${i}`}
                  aria-label={`${exp.year}: ${exp.title}, ${exp.organization}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="group flex w-14 cursor-pointer flex-col items-center focus-visible:outline-none"
                >
                  <span
                    className={`relative h-14 w-14 overflow-hidden rounded-full border-2 bg-white transition-all duration-300 group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-navy-800 ${
                      selected
                        ? "scale-110 border-navy-800 shadow-lg"
                        : reached
                          ? "border-navy-800"
                          : "border-navy-200 group-hover:border-navy-400"
                    }`}
                  >
                    <Image
                      src={exp.logo}
                      alt=""
                      fill
                      sizes="56px"
                      className={`object-cover transition-[filter,opacity] duration-300 ${
                        selected ? "" : "opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                      }`}
                    />
                  </span>
                  <span
                    className={`mt-3 text-sm font-semibold transition-colors sm:text-base ${
                      selected ? "text-navy-900" : "text-navy-400 group-hover:text-navy-700"
                    }`}
                  >
                    {exp.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
