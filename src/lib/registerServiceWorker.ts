export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
      // PWA support is an enhancement; never block the application if registration fails.
      console.warn("Dhanesh Yoga offline support could not be enabled.", error);
    });
  });
}
