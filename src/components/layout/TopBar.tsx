import { cx } from "@/lib/utils";
import { SocialLinks } from "@/components/common/SocialLinks";

export function TopBar({ hidden }: { hidden: boolean }) {
  return (
    <div id="top-bar" className={cx("top-bar", hidden && "hidden")}>
      <div className="top-bar-inner">
        <div className="top-bar-left">
          <a href="tel:8556125017" className="top-bar-link">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>(855) 612-5017</span>
          </a>
          <span className="top-bar-divider" />
          <a href="mailto:corporate@oaksorsllc.com" className="top-bar-link">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x={2} y={4} width={20} height={16} rx={2} />
              <path d="M22 7l-10 7L2 7" />
            </svg>
            <span>corporate@oaksorsllc.com</span>
          </a>
        </div>
        <SocialLinks className="top-bar-right top-bar-social-links" />{/*
          <a href="#" className="top-bar-social" aria-label="TikTok">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.81.1v-3.53a6.34 6.34 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.63a6.34 6.34 0 0 0 6.34-6.34V8.75a8.29 8.29 0 0 0 3.76.91V6.69z" />
            </svg>
          </a>
          <a href="#" className="top-bar-social" aria-label="YouTube">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href="#" className="top-bar-social" aria-label="LinkedIn">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>*/}
      </div>
    </div>
      );
}
