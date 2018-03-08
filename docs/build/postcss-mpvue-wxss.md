<script crossorigin="anonymous" src="//www.dpfile.com/app/owl/static/owl_1.5.28.js"></script>
<script>
Owl.start({
    project: 'mpvue-doc',
    pageUrl: 'build/postcss-mpvue-wxss'
})
</script>


# PostCSS Wxss

[PostCSS] plugin for wxss.

专门为 wxss 格式化处理的的一个 postcss 插件，特别是在做 css 转 wxss 的时候好用到爆。

## 实现的功能
- 清理 wxss 不支持的选择器。
- 清理 wxss 不支持的注释。
- 转换 rem 单位到 rpx。
- 转换 Web 的标签选择器到小程序的 class 选择器。
- style scoped（postcss插件部分）。

## 例子
``` css
/* 被清理 */
* {
  margin: 100px
}

/* 保持原样 */
view {
  width: 50rpx;
}
.container {
  width: 7.5rem;
  font-size: .24rem
}

/* Web 标签转换 */
div {
  width: 50rpx;
}
ul li {
  width: 50rpx;
}
body {
  width: 50rpx;
}
```

``` css
view {
  width: 50rpx;
}
.container {
  width: 50rpx;
  font-size: 24.4rpx
}
._div {
  width: 50rpx;
}
._ul ._li {
  width: 50rpx;
}
page {
  width: 50rpx;
}
```

## Usage

```js
postcss([ require('postcss-mpvue-wxss') ])
```

or use `.postcssrc.js`
```
// https://github.com/michael-ciniawsky/postcss-load-config
const optopns = {}

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-mpvue-wxss": optopns
  }
}
```

with options:

```
const replaceTagSelectorMap = require('postcss-mpvue-wxss/lib/wxmlTagMap')

const optopns = {
  cleanSelector: ['*'],
  remToRpx: 100,
  replaceTagSelector: Object.assign(replaceTagSelectorMap, {
    '*': 'view, text' // 将覆盖前面的 * 选择器被清理规则
  })
}
```

See [PostCSS] docs for examples for your environment.

[PostCSS]: https://github.com/postcss/postcss

