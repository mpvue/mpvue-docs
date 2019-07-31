---
sidebar: true
prev: false
next: false
---

<script src="../assets/cat.js"></script>
# webpack-mpvue-plugin

> mpvue 资源路径解析插件

## 使用示例：

```js
const MpvuePlugin = require('webpack-mpvue-asset-plugin')
// webpack config
{
  entry: [],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  },
  plugins: [
    new MpvuePlugin()
  ]
};
```