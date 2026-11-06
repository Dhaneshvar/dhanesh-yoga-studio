import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_URL = (import.meta.env.VITE_SITE_URL || "https://dhaneshyoga.com").replace(/\/$/, "");
const DEFAULT_OG_IMAGE = `${BASE_URL}/icon-512.png`;
const SITE_NAME = "Dhanesh Yoga Studio";

const SEOHead = ({
  title,
  description,
  keywords,
  canonicalPath,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
}: SEOHeadProps) => {
  const location = useLocation();
  const canonical = `${BASE_URL}${canonicalPath || location.pathname}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Helper to set or create meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard meta
    setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:site_name", SITE_NAME);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonical);

    // JSON-LD structured data
    const existingScripts = document.querySelectorAll('script[data-seo-jsonld]');
    existingScripts.forEach((s) => s.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "true");
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      // Clean up JSON-LD on unmount
      document.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
    };
  }, [fullTitle, description, keywords, canonical, ogType, ogImage, jsonLd]);

  return null;
};

export default SEOHead;
