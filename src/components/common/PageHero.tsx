import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  compact?: boolean;
};

export function PageHero({ eyebrow, title, description, image, imageAlt = "", children, compact = false }: PageHeroProps) {
  return (
    <section className={compact ? "page-hero page-hero--compact" : "page-hero"}>
      <div className="page-hero-orbit" aria-hidden="true" />
      <div className="container page-hero-grid">
        <div className="page-hero-copy">
          <Link to="/" className="page-breadcrumb">Oaksors <span>/</span> {eyebrow}</Link>
          <p className="page-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {description && <p className="page-hero-description">{description}</p>}
          {children && <div className="page-hero-actions">{children}</div>}
        </div>
        {image && (
          <div className="page-hero-visual">
            <img src={image} alt={imageAlt} />
            <div className="page-hero-seal"><span>Simple.</span><span>Quick.</span><span>Honest.</span></div>
          </div>
        )}
      </div>
    </section>
  );
}
