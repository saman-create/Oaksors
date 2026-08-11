import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteShell } from "@/components/layout/SiteShell";
import { ArticlePage } from "@/pages/ArticlePage";
import { ContactPage } from "@/pages/ContactPage";
import { GetStartedPage } from "@/pages/GetStartedPage";
import { HomePage } from "@/pages/HomePage";
import { NewsPage } from "@/pages/NewsPage";
import { PreciousMetalsIraPage } from "@/pages/PreciousMetalsIraPage";
import { PrivacyNoticePage } from "@/pages/PrivacyNoticePage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteShell />}>
          <Route index element={<HomePage />} />
          <Route path="precious-metals-ira" element={<PreciousMetalsIraPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<ArticlePage />} />
          <Route path=":year/:month/:day/:slug" element={<ArticlePage />} />
          <Route path="contact-us" element={<ContactPage />} />
          <Route path="get-started-now" element={<GetStartedPage />} />
          <Route path="privacy-notice" element={<PrivacyNoticePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
