import { readFileSync } from "fs";
import path from "path";
import { formatNonBreakingSpaces } from "sx/utils";

type Props = {
  content: string;
  title: string;
};

const markdownHtmlTemplate = ({ content, title }: Props) => {
  let html = readFileSync(
    path.join(
      process.env.ROOT_DIR,
      "sx",
      "browser",
      "templates",
      "markdown.html"
    ),
    "utf8"
  );

  const formattedContent = content
    .replace(/<em>(((?!<em>).)*)<\/em>/g, (_, command: string) => {
      const commandArr = command.split(",");
      return commandArr
        .map((c) => {
          return `<span class="command-container"><span class="command"><span class="command-inner">
            ${formatNonBreakingSpaces(c.trim())}
          </span></span></span>`;
        })
        .join("");
    })
    .replace(/<name>/g, "&#60;name&#62;");

  html = html
    .replace(
      "{{commonCss}}",
      path.join(
        process.env.ROOT_DIR,
        "sx",
        "browser",
        "templates",
        "common.css"
      )
    )
    .replace("{{content}}", formattedContent)
    .replace("{{title}}", title)
    .replace(
      /<code class="([^"]*)">\s"(.+)"\s<\/code>/gs,
      `<code class="$1">$2</code>`
    );

  return html;
};

export default markdownHtmlTemplate;
