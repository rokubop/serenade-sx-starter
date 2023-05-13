//@ts-nocheck
import sx from "sx";

const { command } = sx.app("__NAME__");

command(["first command"], async (api) => {
  await api.pressKey("q", ["shift"]);
});

// say "show help commands" for help
// run "npm run dev" or say "build commands" for commands to take effect
