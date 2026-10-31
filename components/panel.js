/* 目录：1. 面板内容渲染 2. 关闭按钮与背景点击 3. 原生 Escape / 焦点恢复 */
export function createPanel(dialog) {
  let trigger;
  const close = () => dialog.close();
  dialog.querySelector('[data-close-panel]').addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('panel-open');
    trigger?.focus({ preventScroll: true });
  });
  return {
    open(content, source) {
      trigger = source;
      dialog.querySelector('[data-panel-label]').textContent = content.label;
      dialog.querySelector('h2').textContent = content.title;
      dialog.querySelector('[data-panel-body]').textContent = content.body;
      dialog.showModal();
      document.body.classList.add('panel-open');
    },
  };
}
