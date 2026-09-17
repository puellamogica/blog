import { defineMdastPlugin, markdownToHtml } from "satteri";
import { hastSanitize } from "../hast/hast-sanitize";
import { markdownFeatures } from "../markdown";
import { renderQuestionHtml } from "./question-html";

/*
 * The question is the one field of a locked post that is rendered to HTML on a
 * public page, and this compile is separate from the one Astro runs for a post
 * body — so the sanitiser has to be passed here as well as in the config.
 */
const renderMarkdown = (markdown: string) =>
  markdownToHtml(markdown, {
    features: markdownFeatures,
    hastPlugins: [hastSanitize],
  }).html;

export const mdastQuestionHtmlPlugin = defineMdastPlugin({
  name: "mdast-question-html",
  after(_root, context) {
    const frontmatter = context.data.astro?.frontmatter;
    if (frontmatter === undefined) return;

    renderQuestionHtml(frontmatter, renderMarkdown);
  },
});
