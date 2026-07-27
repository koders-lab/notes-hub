## Blockquotes

A **blockquote** in Markdown (MD) is a formatting element used to **highlight quoted text, callouts, or notes** by visually separating them from the main body of the document.

It renders as indented text, often accompanied by a vertical line on the left side, by translating directly into the semantic HTML `<blockquote>`

### Basic syntax

To create a blockquote, add a **greater-than sign (`>`)** followed by an ==optional== space at the beginning of a line

> This is a blockquote.

### Multi-line Blockquotes

For paragraphs spanning multiple lines, you can place a `>` at the start of every line. To separate paragraphs inside a quote, make sure the blank line also includes the `>` symbol.

> This is the first paragraph.
>
> This is the second paragraph of the same quote.

### Nested Blockquotes

> This is the primary blockquote.
>
> > This is a nested blockquote inside the primary one.
> >
> > > This is a nested blockquote inside the secondary one.

### Mixed Elements

Blockquotes are highly flexible and can contain other Markdown syntax like headings, bold text, lists, and links

> ### Important Notice
>
> - **First point:** Always use proper syntax.
> - **Second point:** Read the [Markdown Guide](https://www.markdownguide.org/basic-syntax/).

# Callouts

> [!NOTE]
> This highlights useful information users should know.

> [!TIP]
> This provides advice to help do things better or faster.

> [!IMPORTANT]
> This covers crucial info needed for success.

> [!WARNING]
> This warns about urgent info demanding immediate attention.

> [!CAUTION]
> This advises against negative consequences of an action.

### Code Blocks Inside Blockquotes

> You can run this command in your terminal:
>
> ```bash
> npm install markdown-it --save
> ```

#### Key Formatting Rules

- **No spacing issues:** Always leave one space after the `>` for clean rendering.
- **Keep brackets uppercase:** Alert tags like `[!NOTE]` must be fully uppercase to trigger the color styling.
- **Compatibility:** Standard blockquotes work everywhere, but alert boxes require modern platforms like GitHub or Obsidian.

What platform are you building this Markdown file for (e.g., **GitHub**, **Obsidian**, **Jekyll**)? Let me know so I can verify if these alert styles are fully supported there.

> Obsidian recognizes many more keywords than GitHub does.

# Mine

> [!note] Title text
> Body content goes here
>
> - Bullet points work too

> This is a block quote

> [!NOTE] Title
> Blockquote inside callout

> [!warning]+ Title
> Contents

> [!tip]- Title
> testing
> Contents

> what are you

> [!warning] Potential issue
>
> > [!tip]- Here's a workaround
> > test

> [!question] Potential issue
>
> > [!example]- Here's a workaround
> > test

# References

https://quartz.jzhao.xyz/features/callouts
https://obsidian.md/help/callouts
