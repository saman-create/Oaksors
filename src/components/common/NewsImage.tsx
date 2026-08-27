import { useState } from "react";

export function NewsImage({ src, alt, title, className }: { src?: string; alt: string; title: string; className?: string }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <div className={`news-image-fallback ${className ?? ""}`} role="img" aria-label={`Image unavailable for ${title}`}><span>Oaksors</span></div>;
  return <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />;
}
