<!-- 目录：1. 正式叉子与热点 2. 来源和生成提示 3. 输出处理与占位文件 -->
# 叉子光标素材

## 1. 入口与显示

`fork.png`：116 × 768 RGBA 透明 PNG，柄在上、叉尖在下。网页显示高度 140px，以宽度 50%、高度 98% 附近为热点。普通状态顺时针 10°，悬停转至 -8° 并抬起 10px。角度配置在 `scripts/siteConfig.js`，尺寸与热点在 `styles/customCursor.css`。

## 2. 来源与提示

来源为用户本轮提供的三齿银叉照片。使用内置 imagegen（background-extraction）生成透明抠图并重定向；保留金属和雕花外观，不是逐像素旋转原照片。

生成提示：

> Use case: background-extraction. Edit the supplied antique silver three-tine fork photograph into a clean transparent PNG cutout asset for a website cursor. Remove ALL gray-green background including the spaces between all three long tines, and preserve exactly the fork's realistic silver metal, dark engraved floral detail, shape and proportions. Reorient the entire fork so its handle is at the TOP and three sharp tine points at the BOTTOM, the long axis exactly vertical (no tilt; a 10 degree clockwise tilt will be applied in CSS). Entire fork visible, no clipping. Center the slender fork, tightly fit a tall portrait canvas with a small transparent padding, maximum practical resolution. No added shadow, no new backdrop, no text, no other objects. Output genuinely transparent background.

## 3. 处理记录

生成图为 1024 × 1536 RGBA。用系统图像工具裁切到 x=396、y=0、232 × 1536，再等比缩小至 116 × 768，保留透明通道。`fork-placeholder.svg` 和 `tomato.svg` 为初始化占位，前者不再加载，后者仍作为浏览器 favicon。
