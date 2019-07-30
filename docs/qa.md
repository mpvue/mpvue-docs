---
sidebar: true
prev: false
next: false
---

# 常见问题

> 如果这篇文档没找到您想要的内容，请到 [mpvue/issues](https://github.com/Meituan-Dianping/mpvue/issues) 进行查找。

## vue-router 支持吗？

路由是不能支持的，因为小程序无法动态的插入和控制节点，几乎无法实现。而且小程序对页面的切换性能做了很多优化，页面切换体验也好了很多，所以使用 vue-router 也不那么必要

## 为什么我新增了页面，没有反应？

因为 webpack 编译的文件是由配置的 entry 决定的，新增的页面并没有添加进 entry，所以需要手动 `npm run dev` 一下，考虑不是高频操作，所以还可以忍受

## 能不能引用第三方的 UI 库？

原理上是可以的，但是要去掉 Dom 和 Bom 相关的 API 操作，还要去掉 mpvue 不支持的一些 vue 特性，小程序不支持的 css 选择器等，去掉这些就可以使用了，欢迎大家贡献 mpvue 的 UI 组件库。

## 能否使用 echarts 等小程序原生组件？

可以，可以看下[demo](https://github.com/mpvue/examples/tree/master/echarts)


## 如何获取小程序在 page onLoad 时候传递的 options

在所有 页面 的组件内可以通过 `this.$root.$mp.query` 进行获取。

## 如何获取小程序在 app onLaunch/onShow 时候传递的 options

在所有的组件内可以通过 `this.$root.$mp.appOptions` 进行获取。

## 如何捕获 app 的 onError

由于 onError 并不是完整意义的生命周期，所以只提供一个捕获错误的方法，在 app 的根组件上添加名为 onError 的回调函数即可。如下：

``` javascript
export default {
   // 只有 app 才会有 onLaunch 的生命周期
   onLaunch () {
       // ...
   },

   // 捕获 app error
   onError (err) {
       console.log(err)
   }
}

```

## 为什么有些组件名不可以使用 

以下为保留关键字，暂不支持作为组件名：

- `a`
- `canvas`
- `cell`
- `content`
- `countdown`
- `datepicker`
- `div`
- `element`
- `embed`
- `header`
- `image`
- `img`
- `indicator`
- `input`
- `link`
- `list`
- `loading-indicator`
- `loading`
- `marquee`
- `meta`
- `refresh`
- `richtext`
- `script`
- `scrollable`
- `scroller`
- `select`
- `slider-neighbor`
- `slider`
- `slot`
- `span`
- `spinner`
- `style`
- `svg`
- `switch`
- `tabbar`
- `tabheader`
- `template`
- `text`
- `textarea`
- `timepicker`
- `trisition-group`
- `trisition`
- `video`
- `view`
- `web`
