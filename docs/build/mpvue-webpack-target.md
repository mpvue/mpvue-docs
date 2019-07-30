---
sidebar: true
prev: false
next: false
---

# mpvue-webpack-target

>专为微信小程序做的 webpack 的 构建目标(Targets)。

如果你不了解什么是 webpack, 可以查看 [webpack文档](https://doc.webpack-china.org/) 。

如果不了解什么又是 target，可以查看文档 [构建目标(Targets)](https://doc.webpack-china.org/configuration/target/)。

## 实现的功能

修改自 [webpack/lib/JsonpTemplatePlugin.js](https://github.com/webpack/webpack/blob/4c6eb6f39f82096bfafe75f98f1007e28a88d366/lib/JsonpTemplatePlugin.js) 中关于 target 为 web 部分的源码。

- 主要兼容微信小程序中的全局变量。例如把 window 修改为 global 。
- 不支持 DOM 和 DOM 方法，不能进行热更替，注释部分功能。
- 触发 webpack 打包后的启动器。