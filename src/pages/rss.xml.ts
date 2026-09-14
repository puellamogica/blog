import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { getArticles } from "../utils/posts";

export const GET: APIRoute = async (context) => {
  const posts = await getArticles();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    trailingSlash: false,
    items: posts.map((post) => ({
      ...post.data,
      link: `/article/${post.data.slug}`,
    })),
  });
};
