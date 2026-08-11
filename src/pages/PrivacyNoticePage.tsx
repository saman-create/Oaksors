import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getPublishedPrivacyNotice, type PublishedPrivacyNotice } from "@/services/privacyNotice";

export function PrivacyNoticePage() {
  const [notice, setNotice] = useState<{ document: PublishedPrivacyNotice | null; failed: boolean }>({ document: null, failed: false });
  usePageMeta("Privacy Notice | Oaksors", "Read the complete published Oaksors privacy notice.");

  useEffect(() => {
    let active = true;
    void getPublishedPrivacyNotice()
      .then((document) => { if (active) setNotice({ document, failed: false }); })
      .catch(() => { if (active) setNotice({ document: null, failed: true }); });
    return () => { active = false; };
  }, []);

  return (
    <main className="privacy-page">
      <header className="privacy-masthead">
        <div className="container privacy-masthead-inner">
          <Link to="/" className="page-breadcrumb">Oaksors <span>/</span> Legal</Link>
          <h1>{notice.document?.title ?? "PRIVACY NOTICE"}</h1>
        </div>
      </header>
      <section className="mp-section mp-section--light privacy-section">
        <div className="container privacy-layout">
          {notice.document && (
            <aside className="privacy-toc" id="toc">
              <p>On this page</p>
              <nav aria-label="Privacy notice sections">
                {notice.document.navigation.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
              </nav>
            </aside>
          )}
          {!notice.document && !notice.failed && <div className="privacy-loading" role="status">Loading the published privacy notice…</div>}
          {notice.failed && (
            <div className="privacy-loading" role="alert">
              <h2>The published notice could not be loaded.</h2>
              <p>View the source notice directly while the connection is unavailable.</p>
              <a className="text-link" href="https://www.oaksorsllc.com/privacy-notice/">Open published privacy notice</a>
            </div>
          )}
          {notice.document && <article className="privacy-legal-source" dangerouslySetInnerHTML={{ __html: notice.document.html }} />}
        </div>
      </section>
    </main>
  );
}
