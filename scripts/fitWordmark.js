/* 目录：1. 含番茄图片的单行字标宽度适配 2. 容器尺寸、图片及字体加载监听 */
export function fitWordmark(element) {
  const fit = () => {
    const available = element.parentElement.clientWidth;
    element.style.fontSize = `${available * .18}px`;
    const natural = element.getBoundingClientRect().width;
    if (natural) element.style.fontSize = `${available * .18 * available / natural}px`;
  };
  new ResizeObserver(fit).observe(element.parentElement);
  document.fonts.ready.then(fit);
  element.querySelectorAll('img').forEach((image) => image.addEventListener('load', fit));
  fit();
}
