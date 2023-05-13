# JSON API

*show help* *page down* *page up* *down <num>* *up <num>*

### Example - CRUD for `user-data/test-colors.json`
```js
import path from "path";
import sx, { browser, createJsonCrudApi } from "sx";
import { openPathInVSCode } from "sx/utils";

// this is the standard way you should construct file paths
const jsonPath = path.join(
  process.env.ROOT_DIR,
  "user-data",
  "test-colors.json"
);

const colorsApi = createJsonCrudApi(jsonPath);

// colorsApi.get,
// colorsApi.getSync
// colorsApi.getAll
// colorsApi.getAllSync
// colorsApi.add
// colorsApi.updateAll
// colorsApi.update
// colorsApi.delete

sx.global().command(
  "new color <%color%>",
  async (api, matches) => {
    await colorsApi.add(matches.color, `Data about ${matches.color}`);
  },
  { autoExecute: true }
);

sx.global().command(
  "type color <%color%>",
  async (api, matches) => {
    const text = await colorsApi.get(matches.color);
    await api.typeText(text);
  },
  { autoExecute: true }
);

sx.global().command(
  "show colors",
  async (api, matches) => {
    await browser.open(jsonPath);
  },
  { autoExecute: true }
);

sx.global().command(
  "edit colors",
  async (api, matches) => {
    await openPathInVSCode(jsonPath);
  },
  { autoExecute: true }
);
```