## Bookmarks

*show help*

### Example
1. Focus your browser. Open a URL such as https://netflix.com
2. Say *{{commands.bookmarks.add("netflix")}}*
3. Done! Bookmark added to `user-data/bookmarks.json`.

To open the bookmark, say *{{commands.bookmarks.open("netflix")}}*

You can see all your bookmarks by saying *{{commands.bookmarks.show[0]}}*.

You can edit bookmarks by saying *{{commands.bookmarks.edit}}*.

| Command | Description
| --- | --- |
| *{{commands.bookmarks.add}}* | Add a bookmark to `user-data/bookmarks.json` |
| *{{commands.bookmarks.update}}* | Add a bookmark to `user-data/bookmarks.json` |
| *{{commands.bookmarks.open}}* | Open the bookmark in the browser |
| *{{commands.bookmarks.show}}* | Show the bookmarks in the browser |
| *{{commands.bookmarks.edit}}* | Opens `user-data/bookmarks.json` in VSCode |

You can change these command triggers in `src/sx-config.ts`