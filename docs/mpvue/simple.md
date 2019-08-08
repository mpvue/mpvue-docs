---
sidebar: true
prev: false
next: false
---

# mpvue-simple

辅助 mpvue 快速开发 Page 级小程序页面的工具，所以也需要有一定的小程序开发经验。

mpvue QuickStart 只支持项目级应用开发，对 Page 级和自定义组件 Component 级小程序页面开发场景缺少支持，而 simple 刚好来填补这部分需求，用以支持 mpvue 和原生小程序（或者其他方式小程序）的混用。

## 工具用法

### command line

``` bash
# install by global
npm i mpvue-simple -g

# create an *.vue SFC
echo -e '<template><h1>Hello {{msg}}!</h1></template>\n<script>\nexport default {\n  data () {\n    return { msg: 233 }\n  }\n}\n</script>\n<style>\n  h1 {\n    color: red;\n  }\n</style>' > App.vue

# build for signel Page
mpvue-simple --build

# or more options
mpvue-simple --build --entry ./src/login.vue --output ./mp-pages/ --pageName login --config ./build/webpack.page.js
```


### Node.js API

#### install

``` bash
npm i mpvue-simple --save-dev
```


#### example

``` javascript
const mpvueSimple = require('mpvue-simple')

// build for signel Page
mpvueSimple.build()

// or more options
mpvueSimple.build({
  output: 'mp-pages',
  pageName: 'login'
})

// maybe you want to do something after building
mpvueSimple.build()  // => Promise
.then(() => console.log('mpvue build success'))
.catch(err => throw new Error(err))
```

#### API

- mpvueSimple.build(argvOptions)
- mpvueSimple.devServer(argvOptions)
- mpvueSimple.getWebpackConfig()
- mpvueSimple.getDevWebpackConfig()


### argv options

Option | Default | Description
---- | --- | --- 
build | `false` | 建构生产代码开关。
component | `false` | 默认编译出的代码为 Page 级， true 时为自定义组件 Component 级。
entry |  `(scan result)` | 默认会扫描 `['./', './src', './src/pages', './mpvue-pages']` 目录下的 `[/.*?\.vue$/, /main\.js/]`。
output | `./dist/` | 编译后代码产出目录。
pageName | `(scan result)` | 默认为扫描到的文件名，产出为小程序 Page 文件夹和文件名。
config | `null` | 自定义需要补充的 webpack config 文件的 src，期望类型是 string，将 require 加载并被注入 webpackConfig。

## 修改小程序的配置
在小程序项目的 `app.json` 中 `pages` 字段添加前文工具编译生成的小程序页面路径。  
然后访问该路径页面查看检查。


