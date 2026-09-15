/*
 * Swiper gallery enhancement.
 *
 * A gallery is authored as nothing more than images inside a `.swiper-gallery`
 * container — which is what Markdown can express and what the Astro component
 * renders. Swiper needs its own wrapper, slides and controls to exist before it
 * can be initialised, so that structure is built here in the browser: without
 * JavaScript the images stay a plain stack, and Swiper itself is only fetched on
 * pages that actually contain a gallery.
 */

const GALLERY_SELECTOR = ".swiper-gallery";
const ENHANCED_ATTRIBUTE = "data-swiper-enhanced";

const createControl = (className: string, label: string) => {
  const control = document.createElement("button");
  control.type = "button";
  control.className = className;
  control.setAttribute("aria-label", label);
  return control;
};

const buildGallery = (gallery: HTMLElement) => {
  const images = gallery.querySelectorAll<HTMLImageElement>("img");
  if (images.length === 0) return undefined;

  const wrapper = document.createElement("div");
  wrapper.className = "swiper-wrapper";

  for (const image of images) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.appendChild(image);
    wrapper.appendChild(slide);
  }

  const pagination = document.createElement("div");
  pagination.className = "swiper-pagination";
  const previous = createControl("swiper-button-prev", "Previous slide");
  const next = createControl("swiper-button-next", "Next slide");

  gallery.replaceChildren(wrapper, pagination, previous, next);
  gallery.classList.add("swiper");

  return { pagination, previous, next };
};

export const enhanceSwiperGalleries = () => {
  const galleries = [
    ...document.querySelectorAll<HTMLElement>(GALLERY_SELECTOR),
  ].filter((gallery) => !gallery.hasAttribute(ENHANCED_ATTRIBUTE));

  if (galleries.length === 0) return;

  // Marked before the import resolves: both the layout and the component call
  // this, and only the first call should build a given gallery.
  for (const gallery of galleries) {
    gallery.setAttribute(ENHANCED_ATTRIBUTE, "");
  }

  void Promise.all([import("swiper"), import("swiper/modules")]).then(
    ([swiperModule, modules]) => {
      for (const gallery of galleries) {
        const controls = buildGallery(gallery);
        if (!controls) continue;

        new swiperModule.default(gallery, {
          modules: [modules.A11y, modules.Navigation, modules.Pagination],
          navigation: {
            prevEl: controls.previous,
            nextEl: controls.next,
          },
          pagination: {
            el: controls.pagination,
            clickable: true,
          },
          a11y: {
            containerRole: "group",
            containerRoleDescriptionMessage: "carousel",
          },
        });
      }
    },
  );
};
