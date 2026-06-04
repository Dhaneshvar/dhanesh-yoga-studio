import { SectionNarration } from "./sectionNarration";

export function extractFromElement(el: HTMLElement, fallbackTitle?: string): SectionNarration {
  const heading = el.querySelector("h1, h2, h3");
  const title = (el.getAttribute("data-voice-title") || heading?.textContent || fallbackTitle || "this section").trim();
  const paragraph = el.querySelector("p");
  const summary = (paragraph?.textContent || "Explore the content available in this area.").trim().slice(0, 220);
  const actionEls = Array.from(el.querySelectorAll("button, a[href]")).slice(0, 4);
  const actions = actionEls
    .map(b => (b.textContent || "").trim().toLowerCase())
    .filter(t => t && t.length < 40 && t.length > 1);
  return { title, summary, actions: Array.from(new Set(actions)).slice(0, 3) };
}
