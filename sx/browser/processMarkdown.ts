import MarkdownIt from "markdown-it";

export function markdownToHtml(markdown) {
  const md = new MarkdownIt();
  return md.render(markdown);
}
