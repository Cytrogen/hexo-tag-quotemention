# hexo-tag-quotemention

一个为 [Hexo](https://hexo.io/) 设计的标签插件，用于生成符合 [IndieWeb](https://indieweb.org/) microformats2 规范的回复上下文。

这可以让你在自己的博客上撰写一篇文章，作为对另一篇文章的回复，并确保其机器可读。

[English Version](./doc/README-en.md)

## 功能

-   生成包含 `h-entry` 和 `u-in-reply-to` class 的 HTML 结构。
-   自动从你的 Hexo 配置中提取作者信息（`author`）、头像（`theme.logo`）和网站URL（`url`）。
-   在文章的 front-matter 中自动设置 `entry: false`，以防止它在主页或归档中被视为独立文章（这需要主题支持）。
-   支持 Markdown 内容渲染。
-   支持多语言，自动从主题语言文件中获取“回复”文本（`reply_to`）。

## 安装

```bash
npm install hexo-tag-quotemention --save
```

## 如何使用

在你的 Hexo 文章中，使用 `reply` 标签包裹你的回复内容。标签需要一个参数，即你回复的文章的 URL。

### 语法

```markdown
{% reply [URL] %}

你的回复内容，支持 Markdown。

{% endreply %}
```

### 示例

假设你在回复 `https://example.com/some-post` 这篇文章。

```markdown
---
title: My Reply
date: 2025-10-14 10:00:00
---

这是一个很棒的观点！

{% reply https://example.com/some-post %}

我完全同意你的看法，特别是关于 microformats 的重要性。

> 这里可以引用原文的一段话。

我认为这是未来的方向。

{% endreply %}

文章的其他部分...
```

### 生成的 HTML

插件会生成类似下面的 HTML 结构：

```html
<div class="reply-block h-entry">
  <!-- 作者信息 (h-card) - 对解析器可见，但视觉上隐藏 -->
  <div class="post-meta p-author h-card" style="display: none">
    <img class="author-avatar u-photo" src="/images/logo.png" alt="Your Name">
    <a class="author-name p-name u-url" href="http://your-site.com">Your Name</a>
  </div>
  
  <!-- 回复内容 -->
  <div class="reply-content e-content">
    <p>我完全同意你的看法，特别是关于 microformats 的重要性。</p>
    <blockquote>
      <p>这里可以引用原文的一段话。</p>
    </blockquote>
    <p>我认为这是未来的方向。</p>
  </div>
  
  <!-- 回复元信息 -->
  <div class="reply-meta">
    <span class="reply-label">回复:</span>
    <a class="reply-target u-in-reply-to" href="https://example.com/some-post">https://example.com/some-post</a>
  </div>
</div>
```

## 配置

为了获得最佳效果，请确保你的 Hexo `_config.yml` 和主题配置文件包含以下信息：

-   **`_config.yml`**
    -   `author`: 你的名字
    -   `url`: 你的网站 URL
    -   `language`: 网站的默认语言
-   **主题配置文件 (`_config.yml`)**
    -   `logo`: 你的头像 URL（可以是相对路径或绝对路径）

## 许可证

MIT
