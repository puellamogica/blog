/*
 * Media player enhancement.
 *
 * Markdown emits plain <audio controls>/<video controls>, so the media plays
 * with scripting off, and Plyr is only fetched on pages that actually contain
 * some: the article layout and the profile page each pass in what they have.
 *
 * Plyr draws its controls from an SVG sprite it would otherwise fetch from its
 * own CDN, one <use> per icon. The site already draws every icon from the
 * Material Symbols font the font pipeline subsets at build time, so the sprite
 * is dropped: each icon Plyr inserts is swapped for the ligature that replaces
 * it, and the <use> goes with it, leaving nothing behind to resolve against a
 * sprite the site does not serve.
 *
 * A control that pairs two icons — the play button's play and pause, the
 * fullscreen button's enter and exit — hands both through here. Plyr decides
 * which one shows with `plyr__control--pressed` on the button, and that is a
 * class on the icon's parent, so both the swap and the state survive it.
 */

/*
 * Plyr names each icon after the sprite symbol it points at, so this is the
 * sprite's own vocabulary, not the control's. Every icon a control can be built
 * from is listed — including the ones Plyr leaves out of the default controls —
 * and the same names are declared to the font in astro.config.mjs, which is
 * where the glyphs are subset to.
 */
const GLYPHS: Record<string, string> = {
  play: "play_arrow",
  pause: "pause",
  restart: "replay",
  rewind: "fast_rewind",
  "fast-forward": "fast_forward",
  volume: "volume_up",
  muted: "volume_off",
  "captions-off": "subtitles_off",
  "captions-on": "subtitles",
  "enter-fullscreen": "fullscreen",
  "exit-fullscreen": "fullscreen_exit",
  settings: "settings",
  pip: "picture_in_picture_alt",
  airplay: "airplay",
  download: "download",
};

const ligatureOf = (icon: SVGElement) => {
  const reference = icon.querySelector("use")?.getAttribute("href") ?? "";
  return reference.split("#").pop()?.slice("plyr-".length) ?? "";
};

const useIconFont = (container: HTMLElement | null) => {
  const icons = container?.querySelectorAll<SVGElement>(".plyr__control > svg");
  if (!icons) return;

  for (const icon of icons) {
    const glyph = GLYPHS[ligatureOf(icon)];
    if (!glyph) continue;

    const symbol = document.createElement("span");
    symbol.className = ["icon", icon.getAttribute("class")]
      .filter(Boolean)
      .join(" ");
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = glyph;

    icon.replaceWith(symbol);
  }
};

export const enhanceMediaPlayers = (selector: string) => {
  const media = document.querySelectorAll<HTMLMediaElement>(selector);
  if (media.length === 0) return;

  void import("plyr").then(({ default: Plyr }) => {
    for (const element of media) {
      const player = new Plyr(element, {
        // Plyr fetches a sprite over XHR when its URL is on another origin, and
        // its own CDN is the default, so the sprite is turned off rather than
        // left to be requested. There is nothing left for it to draw.
        loadSprite: false,
      });

      useIconFont(player.elements.container);
    }
  });
};
