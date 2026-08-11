const PRIVACY_ENDPOINT = "https://www.oaksorsllc.com/wp-json/wp/v2/pages?slug=privacy-notice&_fields=content";

type PrivacyPageResponse = Array<{ content?: { rendered?: string } }>;

export type PublishedPrivacyNotice = {
  title: string;
  html: string;
  navigation: Array<{ id: string; label: string }>;
};

export async function getPublishedPrivacyNotice(): Promise<PublishedPrivacyNotice> {
  const response = await fetch(PRIVACY_ENDPOINT, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Privacy source returned ${response.status}`);

  const pages = await response.json() as PrivacyPageResponse;
  const rendered = pages[0]?.content?.rendered;
  if (!rendered) throw new Error("Published privacy notice is empty");

  const document = new DOMParser().parseFromString(rendered, "text/html");
  const heading = [...document.querySelectorAll("h1")].find((element) => element.textContent?.trim().toUpperCase() === "PRIVACY NOTICE");
  const legalContent = heading?.parentElement?.parentElement;
  if (!legalContent) throw new Error("Published privacy notice content was not found");

  const title = heading.textContent?.trim() ?? "PRIVACY NOTICE";
  const titleBlock = heading.parentElement;
  if (titleBlock && titleBlock.textContent?.trim() === title) titleBlock.remove();
  else heading.remove();

  const tableOfContents = legalContent.querySelector<HTMLElement>("#toc");
  if (tableOfContents) {
    let candidate = tableOfContents.nextElementSibling;
    tableOfContents.remove();
    while (candidate) {
      const next = candidate.nextElementSibling;
      const sectionHeading = candidate.querySelector("h2")?.textContent?.trim() ?? "";
      if (/^\d+\./.test(sectionHeading)) break;
      candidate.remove();
      candidate = next;
    }
  }

  const navigation = [...legalContent.querySelectorAll("h2")].flatMap((sectionHeading) => {
    const label = sectionHeading.textContent?.trim() ?? "";
    const section = sectionHeading.closest<HTMLElement>("[id]");
    return /^\d+\./.test(label) && section?.id ? [{ id: section.id, label }] : [];
  });

  legalContent.querySelectorAll("script, style, iframe, object, embed").forEach((element) => element.remove());
  legalContent.querySelectorAll<HTMLElement>("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      if (attribute.name.toLowerCase().startsWith("on")) element.removeAttribute(attribute.name);
    });
  });

  return { title, html: legalContent.innerHTML, navigation };
}
