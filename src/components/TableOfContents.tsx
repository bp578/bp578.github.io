"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

// A section becomes active once its top passes this fraction of the viewport.
const ACTIVE_LINE = 0.4;

export default function TableOfContents() {
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Every <section id="..."> on the page, in page order; the label is the id
    // capitalized ("projects" -> "Projects").
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    );
    setSections(
      els.map(({ id }) => ({
        id,
        label: id.charAt(0).toUpperCase() + id.slice(1),
      })),
    );

    const update = () => {
      const line = window.innerHeight * ACTIVE_LINE;
      let next = 0;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) next = i;
      });
      // The last section may be too short to reach the line.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      setActive(atBottom ? els.length - 1 : next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const onHero = active === 0;
  const progress =
    sections.length > 1 ? (active / (sections.length - 1)) * 100 : 0;

  return (
    <nav
      aria-label="Table of contents"
      // Closed: slide right so only the 3.5rem tab stays on screen.
      className={`fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center transition-transform duration-300 ${
        onHero
          ? "translate-x-0"
          : "translate-x-[calc(100%-3.5rem)] hover:translate-x-0 focus-within:translate-x-0"
      }`}
    >
      <div
        aria-hidden
        className="flex h-28 w-14 cursor-default items-center justify-center gap-1 rounded-l-full pl-3 bg-navy-800 shadow-md"
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-5 w-0.5 rounded-full bg-white/80" />
        ))}
      </div>

      <div className="rounded-l-2xl border border-r-0 border-navy-100 bg-white/90 py-4 pl-5 pr-6 shadow-lg backdrop-blur">
        <div className="relative">
          {/* Track runs between the first and last node centers. */}
          <div
            className="absolute bottom-5 left-2 top-5 w-1 -translate-x-1/2 rounded-full bg-navy-100"
            aria-hidden
          >
            <div
              className="w-full rounded-full bg-navy-800 transition-[height] duration-300"
              style={{ height: `${progress}%` }}
            />
          </div>

          <ol className="relative">
            {sections.map(({ id, label }, i) => {
              const selected = i === active;
              const reached = i <= active;
              return (
                <li key={id} className="relative">
                  <a
                    href={`#${id}`}
                    aria-current={selected ? "location" : undefined}
                    className="group flex h-10 items-center gap-3 focus-visible:outline-none"
                  >
                    <span
                      className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all duration-300 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-navy-800 ${
                        selected
                          ? "scale-125 border-navy-800 bg-navy-800 shadow-md"
                          : reached
                            ? "border-navy-800 bg-white"
                            : "border-navy-200 bg-white group-hover:border-navy-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        selected
                          ? "text-navy-900"
                          : "text-navy-400 group-hover:text-navy-700"
                      }`}
                    >
                      {label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}
