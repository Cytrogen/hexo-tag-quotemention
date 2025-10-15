// Hexo Reply Tag Plugin for IndieWeb microformats
// Usage: {% reply https://example.com/post %}content{% endreply %}

hexo.extend.tag.register('reply', function(args, content) {
  const targetUrl = args[0];
  
  // 自动将包含 reply 标签的页面设为 entry: false
  if (this.page) {
    this.page.entry = false;
  }
  
  // URL 验证
  if (!targetUrl) {
    hexo.log.warn('Reply tag: Missing target URL');
    return '<div class="reply-error">回复标签缺少目标URL</div>';
  }
  
  // 确保是绝对URL，如果是相对URL则使用 full_url_for 转换
  let absoluteUrl;
  try {
    // 尝试解析为绝对URL
    new URL(targetUrl);
    absoluteUrl = targetUrl;
  } catch (e) {
    try {
      // 如果失败，尝试作为相对路径处理
      absoluteUrl = hexo.extend.helper.get('full_url_for').call({config: hexo.config}, targetUrl);
    } catch (e2) {
      hexo.log.warn(`Reply tag: Invalid URL - ${targetUrl}`);
      return '<div class="reply-error">回复标签包含无效URL</div>';
    }
  }
  
  // 渲染 Markdown 内容
  let renderedContent;
  try {
    renderedContent = hexo.render.renderSync({ 
      text: content.trim(), 
      engine: 'markdown' 
    });
  } catch (e) {
    hexo.log.warn('Reply tag: Failed to render markdown content');
    renderedContent = content; // 降级到纯文本
  }
  
  // 获取当前语言的"回复"翻译
  const currentLang = this.page ? this.page.lang : hexo.config.language;
  let replyText = '回复';
  
  // 尝试从主题语言文件获取翻译
  try {
    const langHelper = hexo.extend.helper.get('__');
    if (langHelper) {
      replyText = langHelper.call({page: {lang: currentLang}}, 'reply_to') || replyText;
    }
  } catch (e) {
    // 使用默认文本
  }
  
  // 获取作者信息和网站配置
  const config = hexo.config;
  const theme = hexo.theme.config;
  const authorName = config.author || 'Anonymous';
  const siteUrl = config.url || '';
  // 简单构造绝对URL，确保logo路径正确
  let authorAvatar = '';
  if (theme.logo) {
    // 如果logo已经是绝对URL，直接使用
    if (theme.logo.startsWith('http')) {
      authorAvatar = theme.logo;
    } else {
      // 确保路径以/开头，构造网站根路径
      const logoPath = theme.logo.startsWith('/') ? theme.logo : '/' + theme.logo;
      authorAvatar = (config.url || '').replace(/\/$/, '') + logoPath;
    }
  }

  // 解决方案：使用 CSS 和模板来控制显示，而不是在 JavaScript 中判断
  // 让 CSS 根据页面类型控制显示，JavaScript 只负责生成完整的 HTML
  return `
    <div class="reply-block h-entry">
      <!-- 作者信息 (h-card) - 对解析器可见，但视觉上隐藏 -->
      <div class="post-meta p-author h-card" style="display: none">
        ${authorAvatar ? `<img class="author-avatar u-photo" src="${authorAvatar}" alt="${authorName}">` : ''}
        <a class="author-name p-name u-url" href="${siteUrl}">${authorName}</a>
      </div>
      
      <!-- 回复内容 -->
      <div class="reply-content e-content">
        ${renderedContent}
      </div>
      
      <!-- 回复元信息 - 通过 CSS 在列表页隐藏 -->
      <div class="reply-meta">
        <span class="reply-label">${replyText}:</span>
        <a class="reply-target u-in-reply-to" href="${absoluteUrl}">${absoluteUrl}</a>
      </div>
    </div>
  `;
}, {ends: true});