# Planets 本地素材

将图片、视频放在项目根目录 `Planets/` 下（此目录已被 Git 忽略）。

开发 / Vercel CLI 部署需要本目录存在，结构与代码引用一致，例如：

- `aigc作品.mp4`
- `作品集.mp4`
- `国家奖学金.jpg`
- `参赛奖状/` 下的奖状图片

路径由 `src/data/planetMedia.js` 统一解析，默认 URL 前缀为 `/Planets`。
