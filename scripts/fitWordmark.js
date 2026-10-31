/* 目录：1. 桌面单行 / 手机两行宽度适配 2. 容器、断点、图片及字体加载监听 */
export function fitWordmark(element) {
  const fit = () => {
    const container = element.parentElement;
    const ratio = Number(getComputedStyle(container).getPropertyValue('--wordmark-width')) || .945;
    const available = container.clientWidth * ratio;
    element.style.fontSize = `${available * .18}px`;
    const natural = element.getBoundingClientRect().width;
    if (natural) element.style.fontSize = `${available * .18 * available / natural}px`;
  };
  new ResizeObserver(fit).observe(element.parentElement);
  matchMedia('(max-width: 600px)').addEventListener('change', fit);
  document.fonts.ready.then(fit);
  element.querySelectorAll('img').forEach((image) => image.addEventListener('load', fit));
  fit();
}
