import { useEffect, useState } from "react";

export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div id="site-preloader" role="status" aria-label="Loading Oaksors">
      <img src="/assets/images/dark-logo.png" alt="OAKSORS" />
      <div className="preloader-track" aria-hidden="true">
        <div className="preloader-bar" />
      </div>
      <p>Loading</p>
    </div>
  );
}
