import { readFileSync } from "fs";
import path from "path";
import { formatNonBreakingSpaces } from "sx/utils";

const commonReplace = (html: string) => {
  return html
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
    .replace(
      /<command>(((?!<command>).)*)<\/command>/g,
      (_, command: string) => {
        const commandArr = command.split(",");
        return commandArr
          .map((c) => {
            return `<span class="command-container"><span class="command"><span class="command-inner">
            ${formatNonBreakingSpaces(c.trim())}
          </span></span></span>`;
          })
          .join("");
      }
    )
    .replace(/<codeblock>/g, `<pre><code class="language-json">`)
    .replace(/<\/codeblock>/g, `</code></pre>`)
    .replace(/<rainbow(\sclass=["'](.+)["'])?>/g, (match, _, classNames) => {
      return `<span class="rainbow${classNames ? " " + classNames : ""}">`;
    })
    .replace(/<\/rainbow>/g, `</span>`)
    .replace(/<%(.+)%>/g, "&#60;$1>");
};

const messageBoxPlainHtmlTemplate = ({
  body,
  title,
}: {
  body: string;
  title: string;
}) => {
  let html = readFileSync(
    path.join(
      process.env.ROOT_DIR,
      "sx",
      "browser",
      "templates",
      "message-box-plain.html"
    ),
    "utf8"
  );

  body = body.replace(/<name>/g, "&#60;name&#62;");
  html = html.replace("{{title}}", title).replace("{{body}}", body);
  html = commonReplace(html);

  return html;
};

type Props = {
  headerTitle: string;
  commandRan?: string;
  currentTime: string;
  title: string;
  body: string;
  suggestedCommands?: string[];
  type: "success" | "error" | "warning" | "info" | "none";
};

const messageBoxHtmlTemplate = ({
  body,
  type,
  headerTitle,
  title,
  commandRan,
  currentTime,
  suggestedCommands,
}: Props) => {
  let html = readFileSync(
    path.join(
      process.env.ROOT_DIR,
      "sx",
      "browser",
      "templates",
      "message-box.html"
    ),
    "utf8"
  );

  body = body.replace(/<name>/g, "&#60;name&#62;");

  html = html.replace(
    /{{suggestedCommands}}/g,
    suggestedCommands?.length
      ? suggestedCommands
          .map((command) => `<command>${command}</command>`)
          .join("")
      : ""
  );

  html = html.replace(
    /{{commandRan}}/g,
    commandRan ? `<command>${commandRan}</command>` : ""
  );

  html = html
    .replace("{{title}}", title)
    .replace("{{content}}", body)
    .replace("{{type}}", type)
    .replace("{{headerTitle}}", headerTitle)
    .replace("{{currentTime}}", currentTime);

  html = commonReplace(html);

  return html;
};

export { messageBoxHtmlTemplate, messageBoxPlainHtmlTemplate };
