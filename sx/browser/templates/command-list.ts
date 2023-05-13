import { readFileSync } from "fs";
import path from "path";

type Props = {
  title: string;
  items: string;
  count: number;
};
const commandListHtmlTemplate = ({ title, items, count }: Props) => {
  const html = readFileSync(
    path.join(
      process.env.ROOT_DIR,
      "sx",
      "browser",
      "templates",
      "command-list.html"
    ),
    "utf8"
  );
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
    .replace("{{title}}", title)
    .replace("{{items}}", items)
    .replace("{{count}}", String(count));
};

export default commandListHtmlTemplate;
