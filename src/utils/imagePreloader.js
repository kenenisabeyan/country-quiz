// Image preloader for seamless flag transitions with zero network flicker
const imageCache = new Set();

export function preloadImages(urls = []) {
  if (typeof window === "undefined") return;

  urls.forEach((url) => {
    if (!url || imageCache.has(url)) return;
    const img = new Image();
    img.src = url;
    img.onload = () => imageCache.add(url);
    img.onerror = () => {
      // Ignore prefetch errors gracefully
    };
  });
}
