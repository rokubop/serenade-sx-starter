import { Api } from "sx/types";

/**
 * Convert <%text%> to format that can be used for passing back into
 * api.runCommand("system ...")
 */
export function escapeText(text: string) {
  return (
    text
      .replace(/\(/g, " escape of ")
      .replace(/\)/g, " ")
      .replace(/&&/g, " escape and ")
      .replace(/\|\|/g, " escape or ")
      .replace(/!/g, " escape not ")
      .replace(/\^/g, " carrot ")
      .replace(/\|/g, " escape pipe ")
      .replace(/(?!^)\d+/g, " space $& ")
      .replace(/^\d+/g, "$& space ")
      .replace(/"[\s\S]+"/g, " space $& space ")
      // .replace(/,/g, ", space ")
      .replace(/@/g, " escape at ")
      .replace(/\*/g, " escape times ")
      // .replace(/\si\s/gi, " capital I ")
      .replace(/\si(?=')?/gi, " capital I ")
      .replace(/\su\s/gi, " you ")
      .replace(/\sy\s/gi, " why ")
      .replace(/\sc\s/gi, " see ")
      .replace(/\sm\s/gi, " am ")
  );
}

/**
 * Convert <%text%> back to the literal spoken text.
 * So that it can be run back into api.runCommand(...)
 */
export function commandifyText(text: string) {
  text = text
    .replace(/\(/g, " of ")
    .replace(/\)/g, " ")
    .replace(/&&?/g, " and ")
    .replace(/\|\|/g, " or ")
    .replace(/!/g, " not ")
    .replace(/\^/g, " carrot ")
    .replace(/,/g, " comma ")
    .replace(/\+/g, " plus ")
    .replace(/=/g, " equals ")
    .replace(/-/g, " dash ")
    .replace(/#/g, " hash ")
    .replace(/%/g, " percent ")
    .replace(/\//g, " slash ")
    .replace(/"/g, " double quotes ")
    .replace(/'/g, " single quote ")
    .replace(/:/g, " colon ")
    .replace(/;/g, " semicolon ")
    .replace(/\|/g, " pipe ")
    .replace(/\./g, " period ")
    .replace(/\?/g, " question mark ")
    .replace(/</g, " less than ")
    .replace(/>/g, " greater than ")
    .replace(/@/g, " at ")
    .replace(/\*/g, " times ");
  text =
    text === "" || text === " " || text === "press" || text === "press "
      ? "press space"
      : text;

  return text
    .replace(/10/g, " ten ")
    .replace(/11/g, " eleven ")
    .replace(/12/g, " twelve ")
    .replace(/13/g, " thirteen ")
    .replace(/14/g, " fourteen ")
    .replace(/15/g, " fifteen ")
    .replace(/16/g, " sixteen ")
    .replace(/17/g, " seventeen ")
    .replace(/18/g, " eighteen ")
    .replace(/19/g, " nineteen ")
    .replace(/20/g, " twenty ")
    .replace(/25/g, " twenty five ")
    .replace(/30/g, " thirty ")
    .replace(/40/g, " forty ")
    .replace(/50/g, " fifty ")
    .replace(/1/g, " one ")
    .replace(/2/g, " two ")
    .replace(/3/g, " three ")
    .replace(/4/g, " four ")
    .replace(/5/g, " five ")
    .replace(/6/g, " six ")
    .replace(/7/g, " seven ")
    .replace(/8/g, " eight ")
    .replace(/9/g, " nine ")
    .replace(/0/g, " ")
    .replace(/\*/g, " times ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatNonBreakingSpaces(str: string) {
  return str.replace(/\s/g, "&nbsp;");
}

export function formatAsNameId(matchedText: string) {
  return formatAsOneWordLowerCase(matchedText);
}

export function formatAsOneWordLowerCase(text: string) {
  return text.toLowerCase().replace(/\s+/g, "");
}

export function formatAsCamelCase(text: string) {
  return text
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

export function formatAsKebabCase(text: string) {
  return text
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return "";
      return index === 0 ? match.toLowerCase() : "-" + match.toLowerCase();
    });
}

/**
 * converts `matches.text` from `<%text%>` to "sentence text" that can
 * be typed anywhere.
 */
export async function systemTypeSentence(api: Api, matchedText: string) {
  const formatted = escapeText(matchedText);
  await api.typeText(formatted);
  await api.runCommand("system " + formatted);
}

/**
 * converts `matches.text` from `<%text%>` to "Sentence text" that can
 * be typed anywhere.
 */
export async function systemTypeCapitalSentence(api: Api, matchedText: string) {
  const formatted = escapeText(matchedText);
  await api.runCommand("system capital " + formatted);
}

export function removeNewlineChars(text: string) {
  return text.replace(/(?:\\[rn])+/g, "");
}

export function formatForFileName(text: string) {
  return escapeText(text).replace(/[.,"'-]/g, "");
}
