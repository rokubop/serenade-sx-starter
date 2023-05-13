//@ts-nocheck
import sx from "sx";

const { command } = sx.app("__NAME__");

command(["first command"], async (api) => {
  await api.pressKey("q", ["shift"]);
});

// command("reference <%text%>", async (api, matches) => {
//   await api.typeText(`hello ${matches.text}`);
//   await api.runCommand(`system hello ${matches.text}`);
//   await api.pressKey("enter", ["commandOrControl"]);
//   await autoHotKey.pressKey("w", ["control"]);
//   await api.delay(1000);
//   await api.click("right", 1);
//   await api.setMouseLocation(960, 540);
//   await autoHotKey.pressKey("F1");
//   await clipboard.copy("hello");
//   await displayInBrowser(api, "hello world");
//   await autoHotKey.pressKey("Numpad1");
//   await autoHotKey.scroll("down", [], 2);
// });
