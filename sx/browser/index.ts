import fs, { readJSON } from "fs-extra";
import { execa } from "execa";
import path from "path";
import { commandsPath } from "sx/file-paths";
import { SxAnyScope, cachedApi, lastCommand } from "sx/sx";
import { Api } from "sx/types";
import {
  messageBoxHtmlTemplate,
  messageBoxPlainHtmlTemplate,
} from "sx/browser/templates/message-box";
import commandListHtmlTemplate from "sx/browser/templates/command-list";
import { chunkArray } from "sx/utils/utils";
import { getActiveAppConfig } from "sx/utils/app-utils";
import { getConfig } from "sx/config";
import { getClipboard } from "sx/clipboard";
import markdownHtmlTemplate from "./templates/markdown";
import { markdownToHtml } from "./processMarkdown";
const config = getConfig();

const messagePath = path.join(config.userDataPath, "message.html");

type MessageBoxProps = {
  headerTitle?: string;
  commandRan?: string;
  currentTime?: string;
  title: string;
  body: string;
  suggestedCommands?: string[];
  type: "success" | "error" | "warning" | "info" | "none";
};

export type CommandListProps = {
  title: string;
  items: string;
  count: number;
};

type Template = "list" | "message";

const typeToHeaderTitle = {
  success: "✅ Success",
  error: "❌ Error",
  warning: "⚠️ Warning",
  info: "ℹ️ Info",
};

const open = async (url: string) => {
  if (process.platform === "win32") {
    await execa("cmd.exe", ["/c", "start", url]);
  } else if (process.platform === "darwin") {
    await execa("open", [url]);
  } else {
    await execa("xdg-open", [url]);
  }
};

const displayTypeHtml = async (
  html: string,
  type: "success" | "error" | "warning" | "info" | "none"
) => {
  const outputPath = messagePath;

  if (type === "none") {
    const title = getHtmlTitle(html);
    html = messageBoxPlainHtmlTemplate({
      body: html,
      title: title,
    });
  } else {
    const messageBoxProps = {
      type,
      body: html,
      commandRan: lastCommand,
      headerTitle: typeToHeaderTitle[type],
      title: typeToHeaderTitle[type],
      currentTime: new Date().toLocaleTimeString(),
    } satisfies MessageBoxProps;
    html = messageBoxHtmlTemplate(messageBoxProps);
  }
  await fs.writeFile(outputPath, html);
  await open(outputPath);
};

const displayErrorHtml = async (html: string) => {
  await displayTypeHtml(html, "error");
};

const displayWarningHtml = async (html: string) => {
  await displayTypeHtml(html, "warning");
};

const displayInfoHtml = async (html: string) => {
  await displayTypeHtml(html, "info");
};

const displaySuccessHtml = async (html: string) => {
  await displayTypeHtml(html, "success");
};

const displayHtml = async (html: string) => {
  await displayTypeHtml(html, "none");
};

const displayTemplateHtml = async <T extends Template>(
  api: Api,
  template: T,
  props: T extends "list" ? CommandListProps : MessageBoxProps
) => {
  let html = "";
  const outputPath = messagePath;
  if (template === "message") {
    const messageBoxProps = {
      ...(props as MessageBoxProps),
      headerTitle: typeToHeaderTitle[(props as MessageBoxProps).type],
      currentTime: new Date().toLocaleTimeString(),
    };
    html = messageBoxHtmlTemplate(messageBoxProps);
  } else if (template === "list") {
    html = commandListHtmlTemplate(props as CommandListProps);
  }
  await fs.writeFile(outputPath, html);
  await open(outputPath);
};

const addIdToHeadings = (htmlString) => {
  const headingRegex = /<(h[1-3])>(.*?)<\/\1>/g;

  return htmlString.replace(
    headingRegex,
    (match, tagName: string, innerText: string) => {
      const id = innerText.trim().replace(/\s+/g, "-").toLowerCase();
      return `<${tagName} id="${id}">${innerText}</${tagName}>`;
    }
  );
};

const getMarkdownTitle = (markdown: string) => {
  let title = "SX";
  const match = /# (.+)/.exec(markdown);

  if (match && match[1]) {
    title = match[1];
  }

  return title;
};

const getHtmlTitle = (html: string) => {
  let title = "SX";
  const match = /<h1>(.+)<\/h1>/.exec(html);

  if (match && match[1]) {
    title = match[1];
  } else {
    const match = /<h2>(.+)<\/h2>/.exec(html);
    if (match && match[1]) {
      title = match[1];
    }
  }

  return title;
};

const displayInfoMarkdown = async (api: Api, markdown: string) => {};

/**
 * So that you can write markdown inline into the function with tabs and spaces
 */
function dedentMarkdown(markdownInline) {
  // Match all leading whitespaces or tabs at the start of each line
  const match = markdownInline.match(/^[ \t]*(?=\S)/gm);

  if (!match) {
    return markdownInline;
  }

  // Find the minimum indent (i.e., the leading spaces or tabs)
  const indent = Math.min(...match.map((el) => el.length));
  const re = new RegExp(`^[ \\t]{${indent}}`, "gm");

  // Remove the minimum indent from each line
  return indent > 0 ? markdownInline.replace(re, "") : markdownInline;
}

const displayMarkdown = async (markdown: string) => {
  const outputPath = messagePath;
  const title = getMarkdownTitle(markdown);
  const content = markdownToHtml(dedentMarkdown(markdown));
  let html = markdownHtmlTemplate({ content, title });
  html = addIdToHeadings(html);
  await fs.writeFile(outputPath, html);
  await open(outputPath);
};

export const displayFileNotFound = async (url: string) => {
  await displayTemplateHtml(cachedApi, "message", {
    commandRan: lastCommand,
    suggestedCommands: ["show help"],
    title: "File not found",
    body: `<code>${url}</code> does not exist.`,
    type: "info",
  });
};

const displayCommands = async (appNameId: SxAnyScope) => {
  const api = cachedApi;
  const url = path.join(commandsPath, `${appNameId}.json`);

  if (!fs.existsSync(url)) {
    await displayFileNotFound(url);
    return;
  }

  const jsonData: string[] = await readJSON(url);
  const set = new Set<string>();

  jsonData.forEach((value: string) => {
    set.add(
      value.replace(
        /\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g,
        "&#60num&#62"
      )
    );
  });

  const chunks = chunkArray([...set.keys()], 20);
  const lists = chunks
    .map((chunk) => {
      return `<ul>${chunk
        .map((value) => {
          return `<li>${value}</li>`;
        })
        .join("")}</ul>`;
    })
    .join("")
    .replace(/<%/g, "&#60")
    .replace(/%>/g, "&#62");

  const appConfig = await getActiveAppConfig(api);
  let title = appConfig?.appNameId;
  if (!title || appNameId === "global" || appNameId === "all") {
    title = appNameId;
  }
  if (appConfig) {
    await displayTemplateHtml(api, "list", {
      title,
      count: Object.entries(jsonData).length,
      items: lists,
    });
    return;
  }
};

const openAsHtml = async (url: string) => {
  if (url.startsWith("http")) {
    await open(url);
  } else {
    const content = await fs.readFile(url, "utf8");
    await displayTemplateHtml(cachedApi, "message", {
      title: path.basename(url),
      body: `<codeblock>${content}</codeblock>`,
      commandRan: lastCommand,
      type: "info",
    });
  }
};

const openAny = async (url: string) => {
  if (url.startsWith("http") || url.includes("htm")) {
    await open(url);
    return;
  }

  if (url.endsWith(".md")) {
    const md = await fs.readFile(url, "utf8");
    await displayMarkdown(md);
    return;
  }

  if (!fs.existsSync(url)) {
    await displayFileNotFound(url);
    return;
  }

  const normalizedUrl = path.normalize(url);
  const pattern = /user-data\/commands\/.*\.json$/;

  if (pattern.test(normalizedUrl)) {
    await displayCommands(path.basename(url, ".json"));
    return;
  }

  await openAsHtml(url);
};

async function getUrl(api: Api) {
  await api.pressKey("l", ["commandOrControl"]);
  await api.pressKey("c", ["commandOrControl"]);
  await api.pressKey("escape");
  const value = await getClipboard();
  // const url = decodeURIComponent(value);
  // const url = removeNewlineChars(value).trim();
  return value || "";
}

async function getUrlPath(api: Api) {
  await api.pressKey("l", ["commandOrControl"]);
  await api.pressKey("c", ["commandOrControl"]);
  await api.pressKey("escape");
  const clipboard = await getClipboard();
  // const urlPath = encodeURIComponent(clipboard);
  // const urlPath = clipboard
  //   .replace(/(?:\\[rn])+/g, "")
  //   .replace(/.*\/\/[^/]+/, "")
  //   .trim();
  return clipboard || "";
}

export default {
  getUrlPath,
  getUrl,
  /**
   * Open a URL or file in the browser.
   */
  open: openAny,
  displayCommands,
  /**
   * Displays html in the browser with "info" template.
   *
   * special tags:
   * ```html
   * <command> - serenade voice command
   * <rainbow class="text-xl">
   * <codeblock>
   * <table> <th> <td> <tr> <code> <hr />
   * ```
   *
   * limited tailwind classes available:
   * ```html
   * flex, flex-col, flex-row, justify-center, justify-between, align-items, text-xs, text-sm, text-md, text-lg, text-xl, text-2xl, text-3xl, gap-2, gap-4, mb-2, mb-4
   * ```
   */
  displayInfoHtml,
  /**
   * Displays html in the browser with "error" template.
   *
   * special tags:
   * ```html
   * <command> - serenade voice command
   * <rainbow class="text-xl">
   * <codeblock>
   * <table> <th> <td> <tr> <code> <hr />
   * ```
   *
   * limited tailwind classes available:
   * ```html
   * flex, flex-col, flex-row, justify-center, justify-between, align-items, text-xs, text-sm, text-md, text-lg, text-xl, text-2xl, text-3xl, gap-2, gap-4, mb-2, mb-4
   * ```
   */
  displayErrorHtml,
  /**
   * Displays html in the browser with "warning" template.
   *
   * special tags:
   * ```html
   * <command> - serenade voice command
   * <rainbow class="text-xl">
   * <codeblock>
   * <table> <th> <td> <tr> <code> <hr />
   * ```
   *
   * limited tailwind classes available:
   * ```html
   * flex, flex-col, flex-row, justify-center, justify-between, align-items, text-xs, text-sm, text-md, text-lg, text-xl, text-2xl, text-3xl, gap-2, gap-4, mb-2, mb-4
   * ```
   */
  displayWarningHtml,
  /**
   * Displays html in the browser with "success" template.
   *
   * special tags:
   * ```html
   * <command> - serenade voice command
   * <rainbow class="text-xl">
   * <codeblock>
   * <table> <th> <td> <tr> <code> <hr />
   * ```
   *
   * limited tailwind classes available:
   * ```html
   * flex, flex-col, flex-row, justify-center, justify-between, align-items, text-xs, text-sm, text-md, text-lg, text-xl, text-2xl, text-3xl, gap-2, gap-4, mb-2, mb-4
   * ```
   */
  displaySuccessHtml,
  /**
   * Displays html in the browser
   *
   * special tags:
   * ```html
   * <command> - serenade voice command
   * <rainbow class="text-xl">
   * <codeblock>
   * <table> <th> <td> <tr> <code> <hr />
   * ```
   *
   * limited tailwind classes available:
   * ```html
   * flex, flex-col, flex-row, justify-center, justify-between, align-items, text-xs, text-sm, text-md, text-lg, text-xl, text-2xl, text-3xl, gap-2, gap-4, mb-2, mb-4
   * ```
   */
  displayHtml,
  displayMarkdown,
  displayFileNotFound,
};
