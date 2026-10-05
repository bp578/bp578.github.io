import { profile, socialLinks } from "@/data/site";
import SocialLinks from "./SocialLinks";

export default function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-svh items-center px-6 py-16 sm:px-10"
    >
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy-600">
          {profile.role}
        </p>

        <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight text-navy-900 sm:text-7xl lg:text-8xl">
          {profile.name}
        </h1>

        <div className="mt-8 h-1 w-16 rounded-full bg-navy-800" aria-hidden />

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-navy-700 sm:text-2xl">
          {profile.headline}
        </p>

        <p className="mt-3 text-base text-navy-400 sm:text-lg">
          {profile.location}
        </p>

        <SocialLinks links={socialLinks} className="mt-10" />
      </div>
    </section>
  );
}
