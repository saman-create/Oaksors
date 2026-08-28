import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getPublishedPrivacyNotice } from "@/services/privacyNotice";
import { BrandPromise } from "@/components/common/BrandPromise";

export function PrivacyNoticePage() {
  const notice = getPublishedPrivacyNotice();
  usePageMeta("Privacy Notice | Oaksors", "Read the complete published Oaksors privacy notice.");

  return (
    <main className="privacy-page">
      <header className="privacy-masthead">
        <div className="container privacy-masthead-inner">
          <Link to="/" className="page-breadcrumb">Oaksors <span>/</span> Legal</Link>
          <BrandPromise />
          <h1>{notice.title}</h1>
        </div>
      </header>
      <section className="mp-section mp-section--light privacy-section">
        <div className="container privacy-layout">
          <aside className="privacy-toc" id="toc">
            <p>On this page</p>
            <nav aria-label="Privacy notice sections">
              {notice.navigation.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
            </nav>
          </aside>
          <article className="privacy-legal-source" dangerouslySetInnerHTML={{ __html: notice.html }} />
        </div>
      </section>
    </main>
  );
}
