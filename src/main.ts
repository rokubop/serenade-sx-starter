/**
 * Entry file for serenade custom scripts
 *
 * All custom scripts should be imported here
 */
import * as dotenv from "dotenv";
dotenv.config();
import "sx";
// ----------------------------------------
// add new imports here// @sx-dynamic-app-import

import onCommandsRegistered from "sx/display-registered-commands";
console.log("\ninit custom scripts " + new Date().toLocaleTimeString());
void onCommandsRegistered();
