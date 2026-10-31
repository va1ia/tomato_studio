/* 目录：1. 本地音频库与 mechanical 参数 2. 三音洗牌及相邻去重 3. 用户点击解锁与播放 */
import { definePatch, ensureReady } from './vendor/web-kits-audio/audio.bundle.mjs';
import { mechanicalSounds } from './mechanicalSounds.js';

export function initClickSounds() {
  if (!('AudioContext' in window)) return;
  const patch = definePatch(mechanicalSounds);
  const sounds = Object.keys(mechanicalSounds.sounds);
  let bag = [];
  let previous;

  const nextSound = () => {
    if (!bag.length) {
      bag = [...sounds];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      // 从末尾取值；新一组第一个声音不能与上一组最后一个相同。
      const last = bag.length - 1;
      if (bag[last] === previous) [bag[0], bag[last]] = [bag[last], bag[0]];
    }
    previous = bag.pop();
    return previous;
  };

  // 只监听 click，触屏和键盘原生激活各响一次，不叠加 pointerdown。
  document.addEventListener('click', async event => {
    if (!event.isTrusted || event.button !== 0 || document.hidden) return;
    const started = performance.now();
    const sound = nextSound();
    try {
      // 在真实用户手势内创建 / 恢复 AudioContext，页面载入时保持安静。
      const context = await ensureReady();
      if (context.state !== 'running' || document.hidden || performance.now() - started > 200) return;
      patch.play(sound);
    } catch {
      // 浏览器拒绝音频时保留原生点击、主题切换和汁液反馈。
    }
  }, { capture: true });
}
