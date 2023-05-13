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

browser.displayHtml(`
<h2>hello <rainbow>world</rainbow></h2>
<hr />
<p class="flex mt-2">support for limited tailwind classes</p>
this is a <command>command</command>
`)
```

### Result:
## hello _world_
support for limited tailwind classes

this is a *command*