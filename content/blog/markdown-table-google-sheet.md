---
title: "How to paste markdown tables in Google Sheets and preserve style?"
description: "Sharing my learning on how rendering a markdown table in the UI and copy-pasting it into Google Sheets does not make it \"pretty\"."
tags:
    - "technical"
    - "javascript"
    - "react"
createdAt: "2025-11-07"
updatedAt: "2025-11-07"
---

Today I worked on a pretty nice "bug" where the markdown table could not be pasted in the native Google Sheets format. It would paste in the regular markdown style with the pipes (`|`) and all. Not a great UX, to be honest. Let me show you how it looked.

![Broken markdown table in Google Sheets](https://assets.sunchay.com/private/uploads/01JGE47ST3BK4846N6WNA8SWGX/01K9EKBBSDY42MQXSJTWYQKS0J.png)

I initially thought I needed something fancy to get it to show up like this:

![Fixed table in Google Sheets](https://assets.sunchay.com/private/uploads/01JGE47ST3BK4846N6WNA8SWGX/01K9EKBM7APNZX5T3JENK0W70H.png)

Turns out it was actually pretty simple.

You see, the [`navigator.clipboard.write()`]([url](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write)) method accepts [MIME types]([url](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types)), and what we needed was the `text/html` MIME type instead of the default `text/plain` type.

```typescript
if (tableHTML && window.ClipboardItem && navigator.clipboard.write) {
  navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([tableHTML], { type: "text/html" }),
      "text/plain": new Blob([rawMarkdown], {
        type: "text/plain",
      }),
    }),
  ]);
} else {
  navigator.clipboard.writeText(rawMarkdown);
}
```

Done. You can now paste the markdown table into Google Sheets without seeing the ugly syntax, and a bonus, you can still paste it into your editor as regular markdown.
