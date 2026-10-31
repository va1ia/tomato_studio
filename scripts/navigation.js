/* 目录：1. 导航按钮绑定 2. 共享面板内容映射 */
export function initNavigation(panel, contents) {
  document.querySelectorAll('[data-panel]').forEach((button) => {
    const content = contents[button.dataset.panel];
    if (content) button.addEventListener('click', () => panel.open(content, button));
  });
}
