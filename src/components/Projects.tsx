import Image from "next/image";
import { projects } from "@/data/site";

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-16 sm:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-5xl font-bold leading-[1.05] tracking-tight text-navy-900 sm:text-7xl">
          Projects
        </h2>

        <ul className="mt-12 space-y-12">
          {projects.map((project) => (
            <li
              key={project.title}
              className="grid items-center gap-6 sm:grid-cols-2 sm:gap-10"
            >
              <div>
                <h3 className="text-2xl font-semibold text-navy-900">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-navy-600"
                  >
                    {project.title}
                  </a>
                </h3>
                <p className="mt-3 leading-relaxed text-navy-700">
                  {project.description}
                </p>
              </div>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-xl border border-navy-100 bg-navy-50"
              >
                <div className="relative aspect-video">
                  <Image
                    src={project.thumbnail}
                    alt={`${project.title} thumbnail`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
