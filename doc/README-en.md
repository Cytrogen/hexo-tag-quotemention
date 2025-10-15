# hexo-tag-quotemention

A tag plugin for [Hexo](https://hexo.io/) to generate reply contexts that comply with the [IndieWeb](https://indieweb.org/) microformats2 specification.

This allows you to write a post on your own blog as a reply to another article and ensure it is machine-readable.

[中文文档](../README.md)

## Features

-   Generates HTML structure with `h-entry` and `u-in-reply-to` classes.
-   Automatically extracts author information (`author`), avatar (`theme.logo`), and site URL (`url`) from your Hexo configuration.
-   Automatically sets `entry: false` in the post's front-matter to prevent it from being treated as a standalone article on the homepage or in archives (requires theme support).
-   Supports Markdown content rendering.
-   Supports multiple languages by automatically fetching the "Reply" text (`reply_to`) from the theme's language files.

## Installation

```bash
npm install hexo-tag-quotemention --save
```

## How to Use

In your Hexo post, use the `reply` tag to wrap your reply content. The tag requires one argument: the URL of the article you are replying to.

### Syntax

```markdown
{% reply [URL] %}

Your reply content, Markdown is supported.

{% endreply %}
```

### Example

Suppose you are replying to the article at `https://example.com/some-post`.

```markdown
---
title: My Reply
date: 2025-10-14 10:00:00
---

This is a great point!

{% reply https://example.com/some-post %}

I completely agree with your perspective, especially regarding the importance of microformats.

> You can quote a passage from the original article here.

I believe this is the way forward.

{% endreply %}

Rest of the article...
```

### Generated HTML

The plugin will generate HTML similar to the following:

```html
<div class="reply-block h-entry">
  <!-- Author Info (h-card) - Visible to parsers, but visually hidden -->
  <div class="post-meta p-author h-card" style="display: none">
    <img class="author-avatar u-photo" src="/images/logo.png" alt="Your Name">
    <a class="author-name p-name u-url" href="http://your-site.com">Your Name</a>
  </div>
  
  <!-- Reply Content -->
  <div class="reply-content e-content">
    <p>I completely agree with your perspective, especially regarding the importance of microformats.</p>
    <blockquote>
      <p>You can quote a passage from the original article here.</p>
    </blockquote>
    <p>I believe this is the way forward.</p>
  </div>
  
  <!-- Reply Metadata -->
  <div class="reply-meta">
    <span class="reply-label">Reply to:</span>
    <a class="reply-target u-in-reply-to" href="https://example.com/some-post">https://example.com/some-post</a>
  </div>
</div>
```

## Configuration

For best results, ensure your Hexo `_config.yml` and theme configuration file contain the following information:

-   **`_config.yml`**
    -   `author`: Your name
    -   `url`: Your website URL
    -   `language`: The default language of your site
-   **Theme Config File (`_config.yml`)**
    -   `logo`: URL to your avatar (can be a relative or absolute path)

## License

MIT
