/* 目录：1. 精细指针检测与素材加载 2. 叉子 DOM 3. 跟随与悬停抬起 4. 离开/失焦/触屏回退 */
export function initCustomCursor(config) {
  const media = matchMedia('(hover: hover) and (pointer: fine)');
  const cursor = document.createElement('div');
  cursor.className = 'fork-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.style.setProperty('--fork-rest-angle', `${config.restAngle}deg`);
  cursor.style.setProperty('--fork-hover-angle', `${config.hoverAngle}deg`);
  const image = new Image();
  image.alt = '';
  let ready = false;
  image.onload = () => { ready = true; };
  image.onerror = () => { ready = false; hide(); };
  image.src = config.image;
  cursor.append(image);
  // 放在原生 dialog 的 top layer 内，保证面板中也能显示光标。
  document.body.append(cursor);
  const hide = () => {
    cursor.classList.remove('is-visible');
    document.documentElement.classList.remove('has-fork-cursor');
  };
  document.addEventListener('pointermove', (event) => {
    if (!ready || !media.matches || event.pointerType !== 'mouse') return hide();
    const dialog = document.querySelector('dialog[open]');
    const parent = dialog || document.body;
    if (cursor.parentElement !== parent) parent.append(cursor);
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-hovering', Boolean(event.target.closest('a, button, input, select, textarea, [data-cursor="hover"]')));
    document.documentElement.classList.add('has-fork-cursor');
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', hide);
  document.addEventListener('close', hide, true);
  media.addEventListener('change', hide);
}
