/* 目录：1. 配置与组件入口 2. 导航面板初始化 3. 字标自适应 4. 光标、可移动高清贴纸与浏览器栏主题同步 5. 点击番茄换色、汁液飞溅与随机音效 */
import { siteConfig } from './siteConfig.js';
import { createPanel } from '../components/panel.js';
import { initNavigation } from './navigation.js';
import { fitWordmark } from './fitWordmark.js';
import { initCustomCursor } from './customCursor.js';
import { initColorTheme } from './colorTheme.js';
import { initBrowserChrome } from './browserChrome.js';
import { initJuiceSplash } from './juiceSplash.js';
import { initClickSounds } from './clickSounds.js';
import { initSticker } from './sticker.js';

const sticker = initSticker();
const panel = createPanel(document.querySelector('#info-panel'), { beforeOpen: () => sticker.returnHome() });
initNavigation(panel, siteConfig.panels);
fitWordmark(document.querySelector('.wordmark'));
initCustomCursor(siteConfig.cursor);
for (const theme of siteConfig.themes) {
  const image = document.querySelector(`[data-sticker-theme="${theme.id}"]`);
  image.src = theme.sticker;
  const mobileSource = image.closest('picture')?.querySelector('source');
  if (mobileSource) mobileSource.srcset = theme.stickerMobile;
}
initColorTheme(siteConfig.themes);
initBrowserChrome();
initJuiceSplash();
initClickSounds();
