/* 目录：1. 配置与组件入口 2. 导航面板初始化 3. 字标自适应 4. 光标和贴纸素材 5. 点击番茄换色、汁液飞溅与随机音效 */
import { siteConfig } from './siteConfig.js';
import { createPanel } from '../components/panel.js';
import { initNavigation } from './navigation.js';
import { fitWordmark } from './fitWordmark.js';
import { initCustomCursor } from './customCursor.js';
import { initColorTheme } from './colorTheme.js';
import { initJuiceSplash } from './juiceSplash.js';
import { initClickSounds } from './clickSounds.js';

const panel = createPanel(document.querySelector('#info-panel'));
initNavigation(panel, siteConfig.panels);
fitWordmark(document.querySelector('.wordmark'));
initCustomCursor(siteConfig.cursor);
document.querySelector('[data-sticker]').src = siteConfig.sticker;
initColorTheme(siteConfig.themes);
initJuiceSplash();
initClickSounds();
