<!-- 目录：1. 项目结构与阅读路径 2. 本地预览 3. 设计参数 4. 上传素材 5. 后续扩展与文件约定 -->
# Tomato Studio

参考 CocoonStorage 的原生 HTML / CSS / JavaScript 结构。当前只搭建 landing 首屏与复用基础，不需要安装依赖或构建；尚未部署。

## 1. 项目结构与阅读路径

```text
index.html                   首屏、导航标记、共享 dialog
components/panel.js          可复用面板：内容、关闭、焦点恢复
styles/
  base.css                  字体接口、颜色变量、重置、无障碍
  navigation.css            胶囊按钮、填色反转、移动端
  home.css                  首屏构图、字标、贴纸
  panel.css                 共享内容面板
  customCursor.css          叉子光标样式与动效
  juiceSplash.css           点击汁液画布、点击穿透与减少动效
scripts/
  main.js                   初始化入口
  siteConfig.js             素材路径、光标角度、主题顺序、面板占位文案
  colorTheme.js             点击番茄循环换色、无障碍标签
  browserChrome.js          Safari 栏位主题色、弹窗关闭与页面恢复同步
  navigation.js             导航交互
  fitWordmark.js            字标自适应，字体上传后重新测量
  customCursor.js           光标跟随、悬停、触屏回退
  juiceSplash.js            Logo 同色小范围喷溅：尖尾水滴、重力与清理
  clickSounds.js            全页点击音效、三音洗牌与用户手势解锁
  mechanicalSounds.js       mechanical 的 click / tap / info 原始参数
  vendor/web-kits-audio/    固定版本音频运行库、来源和 MIT 许可
assets/
  fonts/                    MADE Mountain / 42dot Sans 字体
  icons/                    透明叉子光标、素材记录和 favicon
  images/                   用户上传贴纸、两版番茄与未来项目图片
  json/                     预留项目数据目录
```

检索时先看本文件，再看对应文件顶部目录；各文件以注释标明内容。

## 2. 本地预览

在项目根目录启动静态服务器：

```sh
python3 -m http.server 5173 --bind 127.0.0.1
```

打开 http://127.0.0.1:5173 。使用了 ES modules，需要通过服务器预览，而不是双击 HTML。

## 3. 设计参数

- 红色 `#A01B0C`，绿色 `#AFB127`，集中在 `styles/base.css`。
- Logo 字距 `-.04em`（-4%），位于 `styles/home.css`。600px 及以下采用 Tomato / Studio 两行构图，组合始终对齐首屏底部；手机版贴纸跟随 Studio，电脑版贴纸靠品牌区域右边缘定位，使右侧留白与 T 左侧接近。首屏使用 `100dvh` 跟随手机浏览器可视高度变化。
- 导航按钮 hover / 键盘 focus：绿色填充、红色文字。桌面字号 `clamp(12px, 1.15vw, 18px)`，上限 18px；手机字号 `clamp(11px, 3.1vw, 13px)`。描边 `.1em`、内边距也使用 em，随字号缩放。
- 叉子素材竖直向下为 0°，普通顺时针 10°，hover 32° 并上移 10px。显示高度 180px，热点在下方叉尖附近。角度在 `scripts/siteConfig.js`，尺寸和支点在 `styles/customCursor.css`。
- 桌面鼠标首次移动后，叉子在页面中持续显示，不因离开元素、失焦或关闭面板反复切换显隐；跟随位置按动画帧更新。触屏保留原生交互；素材加载失败时回退系统光标；尊重减少动效设置。
- 四个按钮目前打开可关闭的占位面板，尚未添加测试题、项目和联系方式。
- 全页点击产生小范围番茄汁飞溅：中心短暂鼓起不规则汁液薄膜，10 颗尖尾圆头水滴向外喷出、下坠，在 600ms 内消失。扩散范围较初版缩小约四成，移动端再缩小到 80%；键盘激活从按钮中心喷溅。汁液逐帧沿用 Logo 当前文字颜色，为无高光的单色，主题换色时也同步。飞溅使用原生 Canvas 实现，无需额外图像素材。画布随 dialog 切换层级且不拦截点击，连续点击最多保留 8 组，空闲不运行动画，减少动效或切入后台时清空。

全页真实点击播放 Mechanical v1.0.0 的 `click`、`tap`、`info`：每组三个打乱顺序各播放一次，跨组避免连续同音。保留试听页原始参数与音量；鼠标、触屏和键盘原生激活共用 click 事件，避免一击双响。音频仅在用户操作时解锁，不自动播放；浏览器拒绝音频时页面交互照常。运行库 `@web-kits/audio@0.2.0` 和三个声音参数均随站点本地分发，无需安装依赖、构建或外部音频请求。来源和 MIT 许可见 `scripts/vendor/web-kits-audio/README.md`。

点击字标中的番茄（或聚焦后按 Enter / Space）循环切换：

| 主题 | 背景 | 文字 / 按钮 | 番茄 / 细节 |
| --- | --- | --- | --- |
| 初始红绿 | `#A01B0C` | `#AFB127` | `#7C7E00` / `#613916` |
| 奶油红 | `#F5E0AE` | `#A01B0C` | `#A01B0C` / `#AFB127`，tomato1 轮廓 |
| 橄榄绿 | `#7C7E00` | `#F5E0AE` | `#F5E0AE` / `#C1DEF7`，tomato3 原始素材 |

主题 CSS 在 `styles/base.css`，切换顺序在 `scripts/siteConfig.js`，交互在 `scripts/colorTheme.js`。颜色与番茄轮廓透明度采用 `360ms ease-in-out`。点击时番茄顺时针旋转一圈（1100ms），使用一条完整的 `cubic-bezier(.7,0,.3,1)` 曲线，起步加速、中间最快、末尾减速，不在半圈处停顿；换色与换形在半圈前完成。番茄无鼠标悬停 tooltip 或焦点框，保留键盘焦点提示。连续点击从当前角度衔接，减少动效设置下关闭旋转与过渡。导航填色、面板、选中文字和浏览器主题色也随之更新。每次载入从初始红绿开始。Safari 浏览器栏同时使用根背景与单一 theme-color；弹窗关闭、pageshow、返回前台时下一帧同步主题色并重建 meta 节点。主题切换不保留旧 meta 引用。原生 dialog backdrop 透明，暗幕只绘制于 home::after，关闭后移除。

## 4. 当前素材

| 素材 | 路径 | 接入位置 |
| --- | --- | --- |
| Logo 字体 | `assets/fonts/mademountain-regular.otf` | `styles/base.css`，真实字重 400 |
| 左上角字体 | `assets/fonts/42dotSans/42dotSans-Bold.ttf` | `styles/base.css`，字重 700 |
| 透明叉子 | `assets/icons/fork.png` | `scripts/siteConfig.js`，角度和悬停参数；`styles/customCursor.css` 控制尺寸与热点 |
| 正式贴纸 | `assets/images/print-stickers/Group 632645-print.svg`、`Group 632646-print.svg`、`Group 632647-print.svg` | `scripts/siteConfig.js` 各主题配置；红页配奶油、奶油页配绿、绿页配红。桌面使用带滤镜的原生 SVG；手机自动选择 `print-stickers/mobile/sticker-编号@4x.png`（848×412），保留颗粒和折痕，避免小尺寸 SVG 滤镜在 Safari 上栅格化发糊；CSS 顺时针倾斜 10°，随主题 360ms 交叉渐变 |
| 第一个 o / 主题按钮 | `assets/images/tomato2.svg`、`tomato1.svg`、`tomato3.svg` | 三版原始路径及填色内嵌在 `index.html` 的 `.wordmark__tomato` 按钮中，用 CSS 交叉淡化、旋转换形；修改源 SVG 后需同步内嵌路径 |
| 另一版番茄 / favicon | `assets/images/tomato1.svg` | `index.html` 的浏览器图标；奶油主题使用其轮廓 |

字标使用品牌区域宽度的 94.5%，为右侧贴纸留白（`styles/home.css` 的 `--wordmark-width`）。绿番茄额外左移 `.025em`，导航按钮单独缩小。桌面字标在底部保持整行，手机两行的组合宽度为品牌区域的 100%，左边缘与导航对齐，左右共享页面内边距，视觉上为 T + 番茄 + mato / Studio，辅助技术仍读作 Tomato Studio。字体、图片加载后会重新测量适配宽度。Safari 对齐：普通 `.wordmark__tomato-slot` 负责行内基线与 em 尺寸，内部按钮绝对定位并清除原生 appearance；SVG 不单独添加底部补偿。根元素 `text-size-adjust: 100%` 避免 iOS 自动字号调整导致文字和图形比例不同，保留手动缩放。`100dvh` 变化时整组字标一起贴底。

叉子使用内置 imagegen 从用户照片提取透明素材并转为朝下，保留生成透明通道，经裁切和缩小后用于网页。素材生成提示与处理记录见 `assets/icons/README.md`。占位 SVG 保留备查，不参与当前首屏。

## 5. 后续扩展与文件约定

参考 CocoonStorage：独立页面放根目录，复用内容放 `components`，页面逻辑放 `scripts`，样式按职责拆分，项目资料未来放 `assets/json`，项目详情可按 `projects/项目名/` 扩展。

所有人工维护的文本文件顶部都保留内容目录；HTML / SVG / Markdown 使用 HTML 注释，CSS / JavaScript 使用块注释，忽略文件使用 `#` 注释。HTML 的 doctype 需保持第一行。二进制素材无法写注释；严格 JSON 不支持注释，未来 JSON 的字段目录应写在相邻说明文件，避免破坏文件格式。
