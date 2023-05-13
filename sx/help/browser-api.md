## Browser api

*show help* *page down* *page up* *down <num>* *up <num>*

### API
```js
import { browser } from 'sx'

browser.displayErrorHtml(html);
browser.displayFileNotFound(url)
browser.displayHtml(html);
browser.displayInfoHtml(html);
browser.displayMarkdown(markdown);
browser.displaySuccessHtml(html);
browser.displayWarningHtml(html);
browser.getUrl()
browser.getUrlPath()
browser.open(url)
```
---
### Example
```js
import { browser } from 'sx'
```

```js
  await browser.displayHtml(`
    <h2>hello <rainbow>world</rainbow></h2>
    <p class="flex mt-2">support for limited tailwind classes</p>
    <hr/>
    this is a <command>command</command>
`);
```

```js
await browser.displayMarkdown(`
  # hello world
  
  ---

  - support for *voice command* formatting

  | and | tables |
  | --- | ------ |
  | yes | no     |

  > and most markdown features (using npm package markdown-it)
`);
```

```js
await browser.open("https://google.com");
```

```js
import path from 'path';
import { browser } from 'sx'
```

```js
await browser.open(path.join(process.env.ROOT_DIR, "user-data", "test.md"));
```

```js
await browser.open(path.join(process.env.ROOT_DIR, "user-data", "test.json"));
```

```js
await browser.open(path.join(process.env.ROOT_DIR, "user-data", "test.html"));
```

## special HTML tags
<command>command</command>
<rainbow>rainbow</rainbow>

## special markdown formatting
\*command\*

## Tailwind classes for html
text-xs
text-sm
text-lg
text-xl
text-2xl
text-3xl
font-thin
font-normal
font-semibold
font-bold
font-extrabold
border-b
m-0
m-1
m-2
m-4
mb-0
mb-1
mb-2
mb-4
mb-8
mt-0
mt-1
mt-2
mt-4
mt-8
mr-0
mr-1
mr-2
mr-4
mr-8
ml-0
ml-1
ml-2
ml-4
ml-8
p-0
p-1
p-2
p-4
p-8
pb-0
pb-1
pb-2
pb-4
pb-8
pt-0
pt-1
pt-2
pt-4
pt-8
pr-0
pr-1
pr-2
pr-4
pr-8
pl-0
pl-1
pl-2
pl-4
pl-8
flex
flex-col
flex-row
items-start
items-center
items-end
justify-center
justify-between
justify-end
gap-4
gap-2