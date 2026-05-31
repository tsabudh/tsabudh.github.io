const measurementId = window.__PORTFOLIO_GA_MEASUREMENT_ID__;

function isAnalyticsEnabled() {
  return typeof measurementId === "string" && measurementId.startsWith("G-");
}

export function trackPageView(path = window.location.pathname, title = document.title) {
  if (!isAnalyticsEnabled() || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title,
  });
}

export function initLinkTracking() {
  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest("a[href]");

      if (!link || !isAnalyticsEnabled() || typeof window.gtag !== "function") {
        return;
      }

      const url = new URL(link.href, window.location.href);

      window.gtag("event", "link_click", {
        link_url: url.href,
        link_text: link.textContent.trim().slice(0, 120),
        link_domain: url.hostname,
        outbound: url.hostname !== window.location.hostname,
      });
    },
    { capture: true }
  );
}
