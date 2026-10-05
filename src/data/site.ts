import type { IconType } from "react-icons";
import { FaGithub, FaJava, FaLinkedin } from "react-icons/fa6";
import {
  SiAngular,
  SiBlazor,
  SiC,
  SiItchdotio,
  SiJavascript,
  SiPython,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";

/**
 * Single source of truth for personal content.
 * Edit this file to update text and links across the site.
 */

export type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
};

export type Project = {
  title: string;
  description: string;
  /** Path under /public, e.g. "/projects/my-game.png" */
  thumbnail: string;
  href: string;
};

export type Skill = {
  name: string;
  icon: IconType;
  /** Bubble size — reflects experience level. */
  size: "lg" | "md" | "sm";
  /** Bubble background (brand color). */
  color: string;
  iconColor: string;
};

export const profile = {
  name: "Benjamin Phung",
  role: "Software Engineer",
  headline:
    "Full-stack, AI-curious, game-obsessed.",
  location: "Philadelphia, PA",
};

export const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/benjamin-phung",
    icon: FaLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/bp578",
    icon: FaGithub,
  },
  {
    label: "itch.io",
    href: "https://bp578.itch.io",
    icon: SiItchdotio,
  },
];

export const skills: Skill[] = [
  { name: "Java", icon: FaJava, size: "lg", color: "#E76F00", iconColor: "#FFFFFF" },
  { name: "C#", icon: TbBrandCSharp, size: "lg", color: "#68217A", iconColor: "#FFFFFF" },
  { name: "Python", icon: SiPython, size: "lg", color: "#3776AB", iconColor: "#FFD43B" },
  { name: "React", icon: SiReact, size: "md", color: "#20232A", iconColor: "#61DAFB" },
  { name: "JavaScript", icon: SiJavascript, size: "md", color: "#F7DF1E", iconColor: "#000000" },
  { name: "Tailwind CSS", icon: SiTailwindcss, size: "md", color: "#06B6D4", iconColor: "#FFFFFF" },
  { name: "C", icon: SiC, size: "sm", color: "#A8B9CC", iconColor: "#0F1F3A" },
  { name: "Angular", icon: SiAngular, size: "sm", color: "#DD0031", iconColor: "#FFFFFF" },
  { name: "Blazor", icon: SiBlazor, size: "sm", color: "#512BD4", iconColor: "#FFFFFF" },
];

// Placeholder projects — replace with real entries.
export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "A short description of the project, what it does, and the tech used to build it.",
    thumbnail: "/projects/placeholder.svg",
    href: "https://github.com/bp578",
  },
  {
    title: "Project Two",
    description:
      "A short description of the project, what it does, and the tech used to build it.",
    thumbnail: "/projects/placeholder.svg",
    href: "https://github.com/bp578",
  },
  {
    title: "Project Three",
    description:
      "A short description of the project, what it does, and the tech used to build it.",
    thumbnail: "/projects/placeholder.svg",
    href: "https://bp578.itch.io",
  },
  {
    title: "Project Four",
    description:
      "A short description of the project, what it does, and the tech used to build it.",
    thumbnail: "/projects/placeholder.svg",
    href: "https://bp578.itch.io",
  },
];
