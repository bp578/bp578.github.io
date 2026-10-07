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

export type Experience = {
  /** Year shown on the timeline node. */
  year: number;
  title: string;
  organization: string;
  dates: string;
  description: string[];
  /** Square logo under /public, shown on the timeline node. */
  logo: string;
  /** Path under /public, e.g. "/experience/emoney.png" */
  image: string;
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

export const projects: Project[] = [
  {
    title: "Gladius Unus",
    description:
      "Souls-like prototype game built in Unity. Fight for your freedom as a nameless prisoner. Features challenging melee combat with a focus on highly committal animations.",
    thumbnail: "/projects/gladius_unus.png",
    href: "https://bp578.itch.io/gladius-unus",
  },
  {
    title: "FPS Arena Survivor",
    description:
      "First-person shooter arena survival game built in Unity. Fight for your life as you try to survive against as many enemies as possible. Collect powerups from fallen foes that infinitely stack and gain inhuman strength.",
    thumbnail: "/projects/fps_arena_survivor.png",
    href: "https://bp578.itch.io/fps-arena-survivor",
  },
  {
    title: "Player 2",
    description:
      "Player 2 is a social networking and team-building app for gamers, powered by AI matchmaking. Played a key role in implementing gamification by adding quests and rewards in order to keep users engaged and motivated to play more.",
    thumbnail: "/projects/player2.webp",
    href: "https://player2app.com",
  },
];

// Timeline order (oldest first). Swap the placeholder images for real ones.
export const experiences: Experience[] = [
  {
    year: 2021,
    title: "B.S. Computer Science",
    organization: "Drexel University",
    dates: "September 2021 – June 2026",
    description: [
      "Graduated magna cum laude with a 3.80 GPA from the School of Computing and Informatics.",
      "Senior design: led the quest system architecture for Player 2, a gamified matchmaking app, and built 15+ Java/Spring Boot REST endpoints for quests and badges.",
    ],
    logo: "/experience/drexel.png",
    image: "/experience/graduation.jpg",
  },
  {
    year: 2023,
    title: "Software Developer",
    organization: "WebstaurantStore · IDS",
    dates: "September 2023 – March 2024",
    description: [
      "Helped retire the legacy IDS ERP by migrating 5 core features to a React, TypeScript, and .NET stack.",
      "Improved stability for hundreds of users by resolving 30+ defects across C# and SQL Server backend logic.",
    ],
    logo: "/experience/webstaurantstore.png",
    image: "/experience/webstaurantstore-ids.svg",
  },
  {
    year: 2024,
    title: "Software Developer",
    organization: "WebstaurantStore · Broker",
    dates: "September 2024 – March 2025",
    description: [
      "Delivered 7 features end-to-end for Broker, an internal messaging app, with reusable Blazor and TypeScript components wired to 15+ C#/.NET API endpoints.",
      "Cut bulk data updates from ~3 hours to under a minute with Python scripts that update 1,000+ records per run.",
      "Shipped every new frontend feature with bUnit test coverage to catch UI regressions before release.",
    ],
    logo: "/experience/webstaurantstore.png",
    image: "/experience/webstaurantstore-broker.svg",
  },
  {
    year: 2025,
    title: "Software Engineer",
    organization: "eMoney Advisor",
    dates: "September 2025 – September 2026",
    description: [
      "Built an AI-powered analysis tool on Anthropic's Claude API that detects anomaly trends across institution subscriptions, exposing 50+ hidden parser defects.",
      "Added ~20 new financial institutions by building C# parsers from scratch, reverse-engineering their web traffic with Fiddler.",
      "Resolved 70+ production defects and maintained 30+ scrapers and parsers that keep account data accurate for 5,000+ clients.",
    ],
    logo: "/experience/emoney.png",
    image: "/experience/emoney.svg",
  },
];
