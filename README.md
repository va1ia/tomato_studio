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
scripts/
  main.js                   初始化入口
  siteConfig.js             素材路径、光标角度、面板占位文案
  navigation.js             导航交互
  fitWordmark.js            字标自适应，字体上传后重新测量
  customCursor.js           光标跟随、悬停、触屏回退
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
- Logo 字距 `-.04em`（-4%），位于 `styles/home.css`。
- 导航按钮 hover / 键盘 focus：绿色填充、红色文字。
- 叉子素材竖直向下为 0°，普通顺时针 10°，hover -8° 并上移 10px。显示高度 140px，热点在下方叉尖附近。角度在 `scripts/siteConfig.js`，尺寸和支点在 `styles/customCursor.css`。
- 触屏保留原生交互；素材加载失败时回退系统光标；尊重减少动效设置。
- 四个按钮目前打开可关闭的占位面板，尚未添加测试题、项目和联系方式。

## 4. 当前素材

| 素材 | 路径 | 接入位置 |
| --- | --- | --- |
| Logo 字体 | `assets/fonts/mademountain-regular.otf` | `styles/base.css`，真实字重 400 |
| 左上角字体 | `assets/fonts/42dotSans/42dotSans-Bold.ttf` | `styles/base.css`，字重 700 |
| 透明叉子 | `assets/icons/fork.png` | `scripts/siteConfig.js`，角度和悬停参数；`styles/customCursor.css` 控制尺寸与热点 |
| 正式贴纸 | `assets/images/default_sticker.png` | `scripts/siteConfig.js`；图片自带倾斜，无额外旋转 |
| 第一个 o | `assets/images/tomato2.svg` | `index.html` 的 `.wordmark__tomato`；大小及基线在 `styles/home.css` |
| 另一版番茄 | `assets/images/tomato1.svg` | 已保留，等待用户说明变体触发时机 |

字标在底部保持整行，视觉上为 T + 番茄 + mato Studio，辅助技术仍读作 Tomato Studio。字体、图片加载后会重新测量适配宽度。

叉子使用内置 imagegen 从用户照片提取透明素材并转为朝下，保留生成透明通道，经裁切和缩小后用于网页。素材生成提示与处理记录见 `assets/icons/README.md`。占位 SVG 保留备查，不参与当前首屏。

## 5. 后续扩展与文件约定

参考 CocoonStorage：独立页面放根目录，复用内容放 `components`，页面逻辑放 `scripts`，样式按职责拆分，项目资料未来放 `assets/json`，项目详情可按 `projects/项目名/` 扩展。

所有人工维护的文本文件顶部都保留内容目录；HTML / SVG / Markdown 使用 HTML 注释，CSS / JavaScript 使用块注释，忽略文件使用 `#` 注释。HTML 的 doctype 需保持第一行。二进制素材无法写注释；严格 JSON 不支持注释，未来 JSON 的字段目录应写在相邻说明文件，避免破坏文件格式。
