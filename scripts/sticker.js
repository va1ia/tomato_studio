/* 目录：1. 保持原 DOM 的首页贴纸与视口定位 2. 连续纸边几何、拿起与直线归位 3. 悬停预览与鼠标 / 触屏 / 键盘操作 4. 缩放、页面恢复和减少动效 */
export function initSticker() {
  const home = document.querySelector('.brand-sticker');
  const sticker = home?.querySelector('.sticker-action');
  if (!sticker) return { returnHome() {} };
  const status = document.querySelector('[data-sticker-status]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverInput = matchMedia('(hover: hover) and (pointer: fine)');
  let hovered = false;
  let state = 'home';
  let center = { x: 0, y: 0 };
  let size = { width: 0, height: 0 };
  let grip = { x: 0, y: 0 };
  let flight;
  let frame = 0;
  let nextPoint;
  let viewport = { width: innerWidth, height: innerHeight };

  const print = sticker.querySelector('.sticker-print');
  const fold = sticker.querySelector('.sticker-fold');
  const paperBack = fold.querySelector('[data-paper-back]');
  const paperEdge = fold.querySelector('[data-paper-edge]');
  let curl = 0;
  let curlTarget = 0;
  let curlFrame = 0;

  // A cap of the original ellipse curls inward. Its height grows from the
  // rightmost paper edge, rather than sliding a pre-sized oval into view.
  const renderCurl = (amount) => {
    curl = amount;
    sticker.style.setProperty('--sticker-curl', amount);
    const depth = 22 * amount;
    const crease = 211.246 - depth;
    const halfHeight = 51.1781 * Math.sqrt(Math.max(0, 1 - ((crease - 105.623) / 105.623) ** 2));
    const top = 51.1781 - halfHeight;
    const bottom = 51.1781 + halfHeight;
    const height = halfHeight * 2;
    const bow = depth * .12;
    const point = (x, y) => `${x.toFixed(4)} ${y.toFixed(4)}`;
    const edge = `M${point(crease, top)} C${point(crease + bow * 4 / 3, top + height / 3)} ${point(crease + bow * 4 / 3, bottom - height / 3)} ${point(crease, bottom)}`;
    paperBack.setAttribute('d', `${edge} C${point(crease - depth * .8, bottom - height * .12)} ${point(crease - depth * .8, top + height * .12)} ${point(crease, top)}Z`);
    paperEdge.setAttribute('d', edge);
    // The front and back share exactly the same moving seam.
    const boundary = [`0% 0%`, `${crease / 212 * 100}% 0%`];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      boundary.push(`${(crease + bow * 4 * t * (1 - t)) / 212 * 100}% ${(top + height * t) / 103 * 100}%`);
    }
    boundary.push(`${crease / 212 * 100}% 100%`, '0% 100%');
    print.style.clipPath = `polygon(${boundary.join(',')})`;
    fold.style.opacity = amount > 0 ? '1' : '0';
  };
  const animateCurl = (target) => {
    if (!reducedMotion.matches && curlTarget === target && curlFrame) return;
    curlTarget = target;
    cancelAnimationFrame(curlFrame);
    curlFrame = 0;
    if (reducedMotion.matches || Math.abs(target - curl) < .001) {
      renderCurl(target);
      return;
    }
    const from = curl;
    const start = performance.now();
    const duration = 300 * Math.abs(target - from);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      renderCurl(from + (target - from) * (.5 - .5 * Math.cos(Math.PI * t)));
      curlFrame = t < 1 ? requestAnimationFrame(tick) : 0;
    };
    curlFrame = requestAnimationFrame(tick);
  };

  const syncCurl = () => {
    const lifted = state === 'held' || state === 'returning';
    animateCurl(lifted || (hovered && hoverInput.matches) ? 1 : 0);
  };
  const setState = (value) => {
    state = value;
    syncCurl();
    sticker.dataset.state = value;
    sticker.setAttribute('aria-pressed', String(value === 'held'));
    sticker.setAttribute('aria-label', value === 'held' ? 'Place sticker' : 'Pick up sticker');
  };
  const announce = (message) => { status.textContent = message; };
  const origin = () => {
    const rect = home.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };
  const transform = (point) => `translate3d(${point.x - size.width / 2}px, ${point.y - size.height / 2}px, 0) rotate(10deg)`;
  const clamp = (point) => {
    // Include rotation and the raised paper, so it stays within reach at screen edges.
    const angle = Math.PI / 18;
    const halfX = (size.width * Math.cos(angle) + size.height * Math.sin(angle)) / 2 + 10;
    const halfY = (size.width * Math.sin(angle) + size.height * Math.cos(angle)) / 2 + 16;
    return {
      x: Math.max(halfX, Math.min(innerWidth - halfX, point.x)),
      y: Math.max(halfY, Math.min(innerHeight - halfY, point.y)),
    };
  };
  const move = (point) => {
    center = clamp(point);
    sticker.style.transform = transform(center);
  };
  const stopFollowing = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    nextPoint = null;
  };
  const dock = () => {
    const focused = document.activeElement === sticker;
    flight?.cancel();
    flight = null;
    stopFollowing();
    sticker.classList.remove('is-floating');
    // Preserve curl progress while the paper finishes flattening at the logo.
    for (const property of ['width', 'height', 'transform']) sticker.style.removeProperty(property);
    setState('home');
    if (focused && !document.querySelector('dialog[open]')) sticker.focus({ preventScroll: true });
  };
  const returnHome = (immediate = false) => {
    if (state === 'home') return;
    stopFollowing();
    if (immediate || reducedMotion.matches) { dock(); return; }
    // Sample an interrupted flight before cancelling it; never jump back to its start.
    const start = getComputedStyle(sticker).transform;
    const rect = sticker.getBoundingClientRect();
    flight?.cancel();
    const target = origin();
    const distance = Math.hypot(target.x - rect.left - rect.width / 2, target.y - rect.top - rect.height / 2);
    setState('returning');
    flight = sticker.animate([{ transform: start }, { transform: transform(target) }], {
      duration: Math.max(120, Math.min(280, distance / 3.5)),
      easing: 'linear',
      fill: 'forwards',
    });
    flight.onfinish = dock;
  };
  const pickUp = (event) => {
    if (document.querySelector('dialog[open]') || state === 'returning') return;
    const focused = document.activeElement === sticker;
    if (state === 'home') {
      center = origin();
      size = { width: home.clientWidth, height: home.clientHeight };
      sticker.style.width = `${size.width}px`;
      sticker.style.height = `${size.height}px`;
      // Keep pictures and SVG definitions mounted to avoid a first-pickup repaint.
      sticker.classList.add('is-floating');
      move(center);
    }
    // Preserve the point at which the fork touched the paper; no pickup jump.
    grip = event.detail ? { x: event.clientX - center.x, y: event.clientY - center.y } : { x: 0, y: 0 };
    setState('held');
    if (focused) sticker.focus({ preventScroll: true });
    announce('Sticker lifted. Click to stick it down, or use arrow keys and Enter. Escape returns it to the logo.');
  };
  const putDown = (point) => {
    stopFollowing();
    if (point) move({ x: point.x - grip.x, y: point.y - grip.y });
    setState('placed');
    announce('Sticker placed. Pick it up again to move it.');
  };

  // Hover only previews the paper curl; elevation starts after pickup.
  sticker.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || !hoverInput.matches) return;
    hovered = true;
    syncCurl();
  });
  sticker.addEventListener('pointerleave', () => {
    hovered = false;
    syncCurl();
  });
  hoverInput.addEventListener('change', () => {
    hovered = false;
    syncCurl();
  });

  sticker.addEventListener('click', (event) => {
    if (state === 'held') putDown();
    else pickUp(event);
  });
  document.addEventListener('pointermove', (event) => {
    if (state !== 'held' || event.pointerType !== 'mouse') return;
    nextPoint = { x: event.clientX - grip.x, y: event.clientY - grip.y };
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      if (state === 'held' && nextPoint) move(nextPoint);
    });
  }, { passive: true });
  document.addEventListener('click', (event) => {
    if (event.target.closest('a[href]')) { returnHome(); return; }
    if (state !== 'held' || sticker.contains(event.target)) return;
    // Navigation and theme controls retain their normal action while carrying paper.
    if (event.target.closest('button, input, select, textarea, dialog, [contenteditable]')) {
      returnHome();
      return;
    }
    putDown({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  }, true);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && (state === 'held' || state === 'placed')) {
      returnHome();
      announce('Sticker returned to the logo.');
    }
    if (state !== 'held' || document.activeElement !== sticker) return;
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 48 : 16;
    move({ x: center.x + direction[0] * step, y: center.y + direction[1] * step });
  });
  // Keep a re-positioned sticker on screen if a phone rotates or browser bars resize.
  const resize = () => {
    if (state === 'returning') dock();
    if (state !== 'home') {
      const relative = { x: center.x / viewport.width, y: center.y / viewport.height };
      const previousWidth = size.width;
      size = { width: home.clientWidth, height: home.clientHeight };
      const ratio = previousWidth ? size.width / previousWidth : 1;
      grip = { x: grip.x * ratio, y: grip.y * ratio };
      sticker.style.width = `${size.width}px`;
      sticker.style.height = `${size.height}px`;
      move({ x: relative.x * innerWidth, y: relative.y * innerHeight });
    }
    viewport = { width: innerWidth, height: innerHeight };
  };
  new ResizeObserver(resize).observe(home);
  window.addEventListener('resize', resize);
  window.addEventListener('pagehide', () => returnHome(true));
  window.addEventListener('pageshow', () => returnHome(true));
  window.addEventListener('popstate', () => returnHome());
  window.addEventListener('hashchange', () => returnHome());
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && state === 'returning') dock();
    syncCurl();
  });
  setState('home');
  return { returnHome };
}
