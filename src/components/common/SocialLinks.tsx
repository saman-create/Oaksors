import { socialLinks } from "@/data/socialLinks";

type SocialIconName = (typeof socialLinks)[number]["icon"];

function SocialIcon({ name }: { name: SocialIconName }) {
  if (name === "tiktok") return <path d="M15 2h3.2c.25 1.8 1.2 3.2 2.8 4.1v3.2a8.6 8.6 0 0 1-2.8-1v6.1a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3.3a2.5 2.5 0 1 0 1.3 2.3V2h.3Z" />;
  if (name === "instagram") return <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5ZM17.5 6a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />;
  if (name === "x") return <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.4L6.45 22H3.34l7.24-8.28L2.8 2h6.4l4.43 5.86L18.9 2Zm-1.1 18h1.73L8.26 3.9H6.4L17.8 20Z" />;
  if (name === "facebook") return <path d="M13.5 22v-8h2.75l.5-3h-3.25V9.1c0-.87.43-1.6 1.72-1.6h1.66V4.83A19.2 19.2 0 0 0 14.47 4C11.72 4 10 5.66 10 8.7V11H7v3h3v8h3.5Z" />;
  if (name === "reddit") return <path fillRule="evenodd" d="M21.5 12.5c0-1.1-.9-2-2-2-.52 0-1 .2-1.36.54a9.43 9.43 0 0 0-4.82-1.5l.82-3.76 2.6.55a1.5 1.5 0 1 0 .3-1.47l-3.2-.68a.75.75 0 0 0-.88.57l-1.05 4.82a9.45 9.45 0 0 0-4.67 1.5A2 2 0 1 0 5.5 14.5c0 3.04 2.91 5.5 6.5 5.5s6.5-2.46 6.5-5.5c0-.17 0-.33-.02-.5.58-.36 1.02-.93 1.02-1.5 0-.27-.05-.53-.15-.77.38-.36.65-.87.65-1.23Zm-9.5 6c-2.49 0-4.5-1.57-4.5-3.5s2.01-3.5 4.5-3.5 4.5 1.57 4.5 3.5-2.01 3.5-4.5 3.5Zm-2.1-4.25a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Zm4.2 0a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8ZM9.6 17c.73.63 1.67.95 2.4.95s1.67-.32 2.4-.95c-.72.27-1.58.42-2.4.42S10.32 17.27 9.6 17Z" />;
  if (name === "linkedin") return <path d="M5.1 7.2A2.1 2.1 0 1 0 5.1 3a2.1 2.1 0 0 0 0 4.2ZM3.25 21h3.7V9h-3.7v12ZM9.3 9h3.55v1.64h.05c.5-.95 1.74-1.95 3.58-1.95 3.83 0 4.52 2.52 4.52 5.8V21h-3.7v-5.77c0-1.38-.03-3.15-1.92-3.15-1.92 0-2.22 1.5-2.22 3.05V21H9.3V9Z" />;
  return <path d="M23.5 6.2a2.8 2.8 0 0 0-2-2C19.75 3.75 12 3.75 12 3.75s-7.75 0-9.5.45a2.8 2.8 0 0 0-2 2C.05 8 0 12 0 12s.05 4 .5 5.8a2.8 2.8 0 0 0 2 2c1.75.45 9.5.45 9.5.45s7.75 0 9.5-.45a2.8 2.8 0 0 0 2-2c.45-1.8.5-5.8.5-5.8s-.05-4-.5-5.8ZM9.5 15.7V8.3l6.5 3.7-6.5 3.7Z" />;
}

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      {socialLinks.map(({ label, href, icon }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <SocialIcon name={icon} />
          </svg>
        </a>
      ))}
    </div>
  );
}
