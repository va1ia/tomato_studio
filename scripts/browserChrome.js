/* 目录：1. 同步 Safari 浏览器栏主题色 2. 弹窗关闭 / 页面恢复后的主题缓存刷新 */
export function syncBrowserChrome({ refresh = false } = {}) {
  const color = getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta || !color) return;
  meta.content = color;
  // 相同 content 不一定触发 Safari 重采样；重建节点且保持文档中只有一个主题色。
  if (refresh) meta.replaceWith(meta.cloneNode(true));
}

export function initBrowserChrome() {
  let frame = 0;
  const refresh = () => {
    cancelAnimationFrame(frame);
    // 等待关闭后的遮罩与 overflow 更新，再重新提供页面原本的颜色。
    frame = requestAnimationFrame(() => syncBrowserChrome({ refresh: true }));
  };
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', refresh));
  window.addEventListener('pageshow', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  syncBrowserChrome();
}
