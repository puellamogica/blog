/*
 * Plyr media player enhancement.
 *
 * Markdown emits raw <audio>/<video> elements and the character page renders a
 * plain <video controls>, so both play with scripting off. Plyr is fetched here
 * in the browser, once, and only on a page that actually contains media. The
 * icons are served from this site rather than from Plyr's default CDN.
 *
 * The selector is the only thing that varies between the surfaces, so it is the
 * only thing taken as an argument.
 */
export const enhanceMediaPlayers = (selector: string) => {
  const media = document.querySelectorAll<HTMLMediaElement>(selector);
  if (media.length === 0) return;

  void import("plyr").then(({ default: Plyr }) => {
    for (const element of media) {
      new Plyr(element, { iconUrl: "/plyr.svg" });
    }
  });
};
