import type { SocialLink } from "@/data/site";

type Props = {
  links: SocialLink[];
  className?: string;
};

export default function SocialLinks({ links, className = "" }: Props) {
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {links.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-200 text-navy-800 transition-colors hover:border-navy-800 hover:bg-navy-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-800"
          >
            <Icon className="h-5 w-5" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
