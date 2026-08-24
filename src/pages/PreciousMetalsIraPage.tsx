import { ArrowIcon } from "@/components/common/ArrowIcon";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { IraJourney } from "@/components/sections/IraJourney";
import { ButtonLink } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";

const benefits = [
  { number: "01", title: "Diversification", text: "A precious metals IRA lets you branch beyond stock-market exposure and may offer some protection against market volatility." },
  { number: "02", title: "Tax advantages", text: "A precious metals IRA can provide the same tax treatment as a traditional or Roth IRA, depending on account type and eligibility." },
  { number: "03", title: "Inflation protection", text: "Precious metals have limited supply and have historically been used as a way to help preserve value during inflationary periods." },
];

const metals = [
  ["Gold", "XAU"],
  ["Silver", "XAG"],
  ["Platinum", "XPT"],
  ["Palladium", "XPD"],
] as const;

export function PreciousMetalsIraPage() {
  usePageMeta("Precious Metals IRA | Oaksors", "Learn how a precious metals IRA can add diversification, tax advantages, and inflation protection to retirement savings.");

  return (
    <main className="precious-metals-ira-page">
      <PageHero
        eyebrow="Precious Metals IRA"
        title={<>A steadier foundation for your <em>retirement.</em></>}
        description="A precious metals IRA offers investment flexibility, familiar retirement-account tax treatment, and a tangible way to diversify beyond traditional markets."
        image="/assets/images/hero-right-transparent.png"
        imageAlt="Gold bars arranged on a dark surface"
      >
        <ButtonLink href="/get-started-now/" size="lg">Talk with a specialist <ArrowIcon /></ButtonLink>
        <ButtonLink href="#ira-benefits" variant="ghost" size="lg">Explore the benefits</ButtonLink>
      </PageHero>

      <section id="ira-benefits" className="mp-section mp-section--light">
        <div className="container">
          <SectionHeading eyebrow="Why precious metals" title={<>Designed to add <em>balance</em> when markets feel uncertain.</>} description="Precious metals carry risk like every investment. Their role in a retirement strategy is often about diversification rather than chasing short-term movement." />
          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.number}>
                <span>{benefit.number}</span><h3>{benefit.title}</h3><p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mp-section mp-section--soft ira-media-section">
        <div className="container ira-media-grid">
          <div className="ira-media-copy">
            <SectionHeading eyebrow="Watch the overview" title="Understand the rollover before you begin." description="A short Oaksors overview of the precious-metals IRA process and the questions to ask before moving an account." />
            <div className="video-frame">
              <div className="asset-placeholder"><strong>Oaksors IRA overview video</strong><span>YouTube video: VkZqUc-j_rI</span></div>
              <iframe title="Oaksors precious metals IRA overview" src="https://www.youtube.com/embed/VkZqUc-j_rI" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" loading="lazy" allowFullScreen />
            </div>
          </div>
          <IraJourney />
        </div>
      </section>

      <section className="mp-section mp-section--dark rollover-section">
        <div className="container rollover-grid">
          <div>
            <p className="page-eyebrow">A guided rollover</p>
            <h2>Keep the process simple from the first call to your first purchase.</h2>
            <p>Contact Oaksors to learn about a potentially tax- and penalty-free rollover. Eligibility and tax treatment depend on your individual account and circumstances.</p>
            <ButtonLink href="/get-started-now/" size="lg">Start a conversation <ArrowIcon /></ButtonLink>
          </div>
          <div className="fee-panel">
            <p className="fee-panel-kicker">Oaksors account support</p>
            {['No application fees', 'No transfer fees', 'No annual Oaksors fees'].map((item) => (
              <div className="fee-row" key={item}><span aria-hidden="true">✓</span><strong>{item}</strong></div>
            ))}
            <p className="fee-disclaimer">Third-party custodian, storage, transaction, or other fees may apply. Ask a specialist for complete details.</p>
          </div>
        </div>
      </section>

      <section className="mp-section mp-section--soft metal-prices-section">
        <div className="container">
          <SectionHeading align="center" eyebrow="Live market view" title="Precious metals at a glance." description="Reference live spot-price charts for the four IRA-eligible metal categories Oaksors supports." />
          <div className="metal-widget-grid">
            {metals.map(([name, symbol]) => (
              <article className="metal-widget" key={symbol}>
                <div className="metal-widget-header">
                  <div>
                    <p className="metal-widget-kicker">Live market pricing</p>
                    <h3>{name}</h3>
                  </div>
                  <span className="metal-widget-status"><i /> Live</span>
                </div>
                <iframe title={`${name} live price`} src={`https://goldbroker.com/widget/live/${symbol}?currency=USD&height=320`} />
              </article>
            ))}
          </div>
          <p className="market-note">Charts are supplied by a third party for general information only and do not represent a quoted Oaksors transaction price.</p>
        </div>
      </section>
    </main>
  );
}
