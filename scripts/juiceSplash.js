/* 目录：1. 透明画布与面板层级 2. Logo 同色薄膜与尖尾水滴 3. 小范围点击喷溅与数量上限 4. 缩放、后台清理和减少动效 */
export function initJuiceSplash() {
  const canvas = document.createElement('canvas');
  canvas.className = 'juice-splash';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const wordmark = document.querySelector('.wordmark');
  let splashes = [];
  let frame = 0;
  let width = 0;
  let height = 0;

  // 和叉子一样随原生 dialog 移动，保持点击穿透和原生焦点行为。
  const syncLayer = () => {
    const parent = document.querySelector('dialog[open]') || document.body;
    if (canvas.parentElement !== parent) parent.append(canvas);
  };
  const observer = new MutationObserver(syncLayer);
  document.querySelectorAll('dialog').forEach(dialog => {
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  syncLayer();

  const resize = () => {
    width = innerWidth;
    height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
  };
  resize();

  // 逐帧读取 Logo 的实际文字颜色，主题过渡期间也保持同色。
  const draw = now => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = getComputedStyle(wordmark || document.body).color;
    splashes = splashes.filter(splash => now - splash.start < 600);
    for (const splash of splashes) {
      const seconds = Math.max(0, now - splash.start) / 1000;
      const bloom = Math.min(seconds / .18, 1);
      if (bloom < 1) {
        const radius = 2 + Math.sin(bloom * Math.PI * .8) * 9 * splash.size;
        context.save();
        context.translate(splash.x, splash.y);
        context.rotate(splash.twist);
        context.globalAlpha = (1 - bloom) * .8;
        context.beginPath();
        for (let i = 0; i < 48; i++) {
          const angle = i / 48 * Math.PI * 2;
          const edge = radius * (1 + Math.sin(angle * 7 + splash.twist) * .24);
          const x = Math.cos(angle) * edge;
          const y = Math.sin(angle) * edge * .7;
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.fill();
        context.restore();
      }
      for (const drop of splash.drops) {
        const life = seconds / drop.life;
        if (life >= 1) continue;
        const travel = (1 - Math.exp(-seconds * 3)) / 3;
        const x = splash.x + drop.vx * travel;
        const y = splash.y + drop.vy * travel + 70 * splash.size * seconds * seconds;
        const vx = drop.vx * Math.exp(-seconds * 3);
        const vy = drop.vy * Math.exp(-seconds * 3) + 140 * splash.size * seconds;
        const radius = drop.radius * Math.min(seconds / .025, 1) * (1 - life * .35);
        const stretch = 1.15 + Math.min(Math.hypot(vx, vy) / 160, .65) * (1 - life);
        context.save();
        context.translate(x, y);
        context.rotate(Math.atan2(vy, vx));
        context.globalAlpha = Math.min((1 - life) / .28, 1) * .94;
        // 尖尾朝向喷溅原点，圆头沿飞行方向，避免只像椭圆粒子。
        context.scale(stretch, 1);
        context.beginPath();
        context.moveTo(-radius * 1.7, 0);
        context.bezierCurveTo(-radius * .7, -radius * .35, -radius * .15, -radius, radius * .45, -radius * .8);
        context.bezierCurveTo(radius * 1.35, -radius * .55, radius * 1.35, radius * .55, radius * .45, radius * .8);
        context.bezierCurveTo(-radius * .15, radius, -radius * .7, radius * .35, -radius * 1.7, 0);
        context.closePath();
        context.fill();
        context.restore();
      }
    }
    frame = splashes.length ? requestAnimationFrame(draw) : 0;
  };

  document.addEventListener('click', event => {
    if (reducedMotion.matches || document.hidden || event.button !== 0) return;
    let x = event.clientX;
    let y = event.clientY;
    // 键盘激活按钮时从按钮中心喷溅，不从屏幕左上角出现。
    if (event.detail === 0 && x === 0 && y === 0) {
      const button = event.target.closest('button, a, [role="button"]');
      if (!button) return;
      const rect = button.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
    syncLayer();
    const size = innerWidth <= 600 ? .8 : 1;
    const twist = Math.random() * Math.PI * 2;
    const drops = Array.from({ length: 10 }, (_, i) => {
      const angle = twist + i / 10 * Math.PI * 2 + (Math.random() - .5) * .35;
      const speed = (55 + Math.random() * 135) * size;
      return {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * .85 - 35 * size,
        radius: (i % 3 === 0 ? 3.8 + Math.random() : 2.4 + Math.random()) * size,
        life: .38 + Math.random() * .2,
      };
    });
    splashes.push({ x, y, size, drops, twist, start: performance.now() });
    splashes = splashes.slice(-8);
    if (!frame) frame = requestAnimationFrame(draw);
  });

  const clear = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    splashes = [];
    context.clearRect(0, 0, width, height);
  };
  window.addEventListener('resize', () => { clear(); resize(); }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) clear(); });
}
