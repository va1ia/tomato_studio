/* 目录：1. 素材加载与稳定显隐 2. 面板顶层同步 3. 帧同步跟随与顺时针悬停 4. 后台及触屏回退 */
export function initCustomCursor(config) {
  const media = matchMedia('(hover: hover) and (pointer: fine)');
  const cursor = document.createElement('div');
  cursor.className = 'fork-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.style.setProperty('--fork-rest-angle', `${config.restAngle}deg`);
  cursor.style.setProperty('--fork-hover-angle', `${config.hoverAngle}deg`);
  const image = new Image();
  image.alt = '';
  image.draggable = false;
  let ready = false;
  let position = null;
  let frame = 0;
  cursor.append(image);
  // 放在原生 dialog 的 top layer 内，保证面板中也能显示光标。
  document.body.append(cursor);
  const syncVisibility = () => {
    const visible = ready && media.matches && position !== null && !document.hidden;
    cursor.classList.toggle('is-visible', visible);
    document.documentElement.classList.toggle('has-fork-cursor', visible);
  };
  // 仅在面板开关时切换父层，关闭后立即返回 body，不等待移动。
  const syncLayer = () => {
    const parent = document.querySelector('dialog[open]') || document.body;
    if (cursor.parentElement !== parent) parent.append(cursor);
  };
  const observer = new MutationObserver(syncLayer);
  document.querySelectorAll('dialog').forEach((dialog) => {
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  image.onload = () => { ready = true; syncVisibility(); };
  image.onerror = () => { ready = false; syncVisibility(); };
  image.src = config.image;
  document.addEventListener('pointermove', (event) => {
    // 忽略非鼠标事件，不因空 pointerType 或其他输入反复隐藏。
    if (event.pointerType !== 'mouse' || !media.matches) return;
    const firstMove = position === null;
    position = { x: event.clientX, y: event.clientY };
    cursor.classList.toggle('is-hovering', Boolean(event.target.closest('a, button, input, select, textarea, [data-cursor="hover"]')));
    if (!frame) frame = requestAnimationFrame(() => {
      cursor.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      frame = 0;
      if (firstMove) syncVisibility();
    });
  }, { passive: true });
  // 首次移动后持续显示；不因 pointerleave、blur 或关闭面板闪回原生光标。
  document.addEventListener('visibilitychange', syncVisibility);
  media.addEventListener('change', () => {
    if (!media.matches) position = null;
    syncVisibility();
  });
}
