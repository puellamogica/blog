import { defineMdastPlugin, markdownToHtml } from "satteri";
import { markdownFeatures } from "../markdown";
import { renderQuestionHtml } from "./question-html";

const renderMarkdown = (markdown: string) =>
  markdownToHtml(markdown, { features: markdownFeatures }).html;

export const mdastQuestionHtmlPlugin = defineMdastPlugin({
  name: "mdast-question-html",
  after(_root, context) {
    const frontmatter = context.data.astro?.frontmatter;
    if (frontmatter === undefined) return;

    renderQuestionHtml(frontmatter, renderMarkdown);
  },
});
