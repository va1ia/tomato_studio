/* 目录：1. 三套主题与无悬停提示的按钮说明 2. 连续一圈旋转（中段最快） 3. 连续点击衔接和减少动效 */
import { syncBrowserChrome } from './browserChrome.js';

export function initColorTheme(themes) {
  const button = document.querySelector('[data-theme-toggle]');
  const spinner = button.querySelector('.tomato-spin');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let rotation;
  let index = 0;
  const apply = () => {
    const theme = themes[index];
    const next = themes[(index + 1) % themes.length];
    document.documentElement.dataset.theme = theme.id;
    syncBrowserChrome();
    button.setAttribute('aria-label', `Change color theme to ${next.name}`);
  };
  const spin = () => {
    // 从当前可见角度继续，连续点击不跳回原位。
    const matrix = new DOMMatrixReadOnly(getComputedStyle(spinner).transform);
    const start = (Math.atan2(matrix.b, matrix.a) * 180 / Math.PI + 360) % 360;
    rotation?.cancel();
    if (reducedMotion.matches) return;
    const end = start < 180 ? 360 : 720;
    rotation = spinner.animate([
      { transform: `rotate(${start}deg)`, offset: 0 },
      { transform: `rotate(${end}deg)`, offset: 1 },
    ], { duration: 1100, easing: 'cubic-bezier(.7,0,.3,1)' });
  };
  button.addEventListener('click', () => {
    spin();
    index = (index + 1) % themes.length;
    apply();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) rotation?.cancel();
  });
  apply();
}
