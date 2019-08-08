---
sidebar: true
prev: false
next: false
---

# mpvue-loader

>我们是在 [vue-loader](https://github.com/vuejs/vue-loader) 上做的修改，增加了建构到`微信小程序` 的若干能力。除此之外与原 [vue-loader 文档](https://vue-loader.vuejs.org/) 保持一致，所以本文档只列下修改的地方。

如果你对 [vue-loader](https://vue-loader.vuejs.org/)  不是很熟悉的话，强烈建议先阅读原文档一遍，下面的内容会默认你已经知道了什么是 vue-loader 和她能做什么。

## 开始
mpvue-loader 是 vue-loader 的一个扩展延伸版，类似于超集的关系，除了 vue-loader 本身所具备的能力之外，它还会产出微信小程序所需要的文件结构和模块内容。

<!-- 其本身依赖 `mpvue-template-compiler` 的各种编译能力。 -->

## 特性
### entry
它会从 webpack 的配置中的 `entry` 开始，分析依赖模块，并分别打包。在entry 中 app 属性及其内容会被打包为微信小程序所需要的 `app.js／app.json／app.wxss`，其余的会生成对应的页面`page.js/page.json/page.wxml/page.wxss`，如示例的 entry 将会生成如下这些文件，文件内容下文慢慢讲来：
``` javascript
// webpack.config.js
{
    // ...
    entry: {
        app: resolve('./src/main.js'),               // app 字段被识别为 app 类型
        index: resolve('./src/pages/index/main.js'),   // 其余字段被识别为 page 类型
        'news/home': resolve('./src/pages/news/home/index.js')
    }
}

// 产出文件的结构
.
├── app.js
├── app.json
├── app.wxss
├── components
│   ├── card$74bfae61.wxml
│   ├── index$023eef02.wxml
│   └── news$0699930b.wxml
├── news
│   ├── home.js
│   ├── home.wxml
│   └── home.wxss
├── pages
│   └── index
│       ├── index.js
│       ├── index.wxml
│       └── index.wxss
└── static
    ├── css
    │   ├── app.wxss
    │   ├── index.wxss
    │   └── news
    │       └── home.wxss
    └── js
        ├── app.js
        ├── index.js
        ├── manifest.js
        ├── news
        │   └── home.js
        └── vendor.js
```

### wxml
每一个 `.vue` 的组件都会被生成为一个 wxml 规范的 template，然后通过 wxml 规范的 import 语法来达到一个复用，同时组件如果涉及到 props 的 data 数据，我们也会做相应的处理，举个实际的例子：
``` html
<template>
    <div class="my-component">
        <h1>{{msg}}</h1>
        <other-component :msg="msg"></other-component>
    </div>
</template>
<script>
import otherComponent from './otherComponent.vue'

export default {
  components: { otherComponent },
  data () {
    return { msg: 'Hello Vue.js!' }
  }
}
</script>
```

这样一个 vue 的组件的模版部分会生成相应的 wxml
``` html
<import src="components/other-component$hash.wxml" />
<template name="component$hash">
    <view class="my-component">
        <view class="_h1">{{msg}}</view>
        <template is="other-component$hash" wx:if="{{ $c[0] }}" data="{{ ...$c[0] }}"></template>
    </view>
</template>
```

细心的开发者可能已经注意到了 `other-component(:msg="msg")` 被转化成了 
``` html
<template is="other-component$hash" data="{{ ...$c[0] }}"></template>
```
mpvue 在运行时会从根组件开始把所有的组件实例数据合并成一个树形的数据，然后通过 setData 到 appData,`$c` 是 `$children` 的缩写。至于那个 `0` 则是我们的 compiler 处理过后的一个标记，会为每一个子组件打一个特定的不重复的标记。
树形数据结构如下：

``` javascript
// 这儿数据结构是一个数组，index 是动态的
{
  $child: {
    '0'{
      // ... root data
      $child: {
        '0': {
          // ... data
          msg: 'Hello Vue.js!',
          $child: {
            // ...data
          }
        }
      }
    }
  }
}
```

### wxss
这个部分的处理同 web 的处理差异不大，唯一不同在于通过配置生成 `.css` 为 `.wxss` ，其中的对于 css 的若干处理，在 [postcss-mpvue-wxss](/build/postcss-mpvue-wxss/) 和 [px2rpx-loader](/build/px2rpx-loader/) 这两部分的文档中又详细的介绍。

### app.json／page.json

`1.1.1 以上`

推荐和小程序一样，将 app.json／page.json 放到页面入口处，使用 copy-webpack-plugin copy 到对应的生成位置。

`1.1.1 以下`

这部分内容来源于 app 和 page 的 entry 文件，通常习惯是 main.js，你需要在你的入口文件中 `export default { config: {} }`，这才能被我们的 loader 识别为这是一个配置，需要写成 json 文件。

```javascript
import Vue from 'vue';
import App from './app';

const vueApp = new Vue(App);
vueApp.$mount();

// 这个是我们约定的额外的配置
export default {
    // 这个字段下的数据会被填充到 app.json ／ page.json
    config: {
        pages: ['static/calendar/calendar', '^pages/list/list'], // Will be filled in webpack
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#455A73',
            navigationBarTitleText: '美团汽车票',
            navigationBarTextStyle: '#fff'
        }
    }
};
```

同时，这个时候，我们会根据 entry 的页面数据，自动填充到 app.json 中的 `pages` 字段。
`pages` 字段也是可以自定义的，约定带有 `^` 符号开头的页面，会放到数组的最前面。

### style scoped
在 vue-loader 中对 style scoped 的处理方式是给每个样式加一个 attr 来标记 module-id，然后在 css 中也给每条 rule 后添加 `[module-id]`，最终可以形成一个 css 的“作用域空间”。

在微信小程序中目前是不支持 attr 选择器的，所以我们做了一点改动，把 attr 上的 `[module-id]` 直接写到了 class 里，如下：
``` html
<!-- .vue -->
<template>
    <div class="container">
        // ...
    </div>
</template>
<style scoped>
    .container {
        color: red;
    }
</style>

<!-- vue-loader -->
<template>
    <div class="container" data-v-23e58823>
        // ...
    </div>
</template>
<style scoped>
    .container[data-v-23e58823] {
        color: red;
    }
</style>

<!-- mpvue-loader -->
<template>
    <div class="container data-v-23e58823">
        // ...
    </div>
</template>
<style scoped>
    .container.data-v-23e58823 {
        color: red;
    }
</style>
```

## 配置
和 vue-loader 用法一致，讲讲额外注意的地方。

### checkMPEntry
在 [项目建构](/build/#module) 文档的这个部分，有讲到需要给所有 `js` 后缀文件增加 `mpvue-loader` ，并且需要加 options，通过这个配置，我们的 loader 才能知道 entry 进来的 js 和 vue 的类型是 app 还是 page，从而做了一些页面类型的区分。

## TypeScript支持
`mpvue-loader`目前支持用TypeScript来写，功能还在完善中(WIP)。目前实现了用`<script lang="ts" src="./xx.ts"></script>`这种方式的自动识别，并且需要搭配[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)来使用。

### 配置

#### 添加对应的`loader`
```js
// webpack.conf.js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'mpvue-loader',
        options: {
          //...
          ts: [ //添加对应vue的loader
            'babel-loader',
            {
              // loader: 'ts-loader',
              loader: 'awesome-typescript-loader',
              options: {
                // errorsAsWarnings: true,
                useCache: true,
              }
            }
          ]
        }
      },
      // ts文件的loader
      {
        test: /\.tsx?$/, 
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'mpvue-loader',
            options: {
              checkMPEntry: true
            }
          },
          {
            // loader: 'ts-loader',
            loader: 'awesome-typescript-loader',
            options: {
              // errorsAsWarnings: true,
              useCache: true,
            }
          }
        ]
      },
    ]
  // ...
  }
```
### main.ts
```ts
// main.ts
import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator';
import { VueConstructor } from "vue";

interface IMpVue extends VueConstructor {
  mpType: string
}

// 添加小程序hooks http://mpvue.com/mpvue/#_4
Component.registerHooks([
  // app
  'onLaunch', // 初始化
  'onShow', // 当小程序启动，或从后台进入前台显示
  'onHide', // 当小程序从前台进入后台
  // pages
  'onLoad', // 监听页面加载
  'onShow', // 监听页面显示
  'onReady', // 监听页面初次渲染完成
  'onHide', // 监听页面隐藏
  'onUnload', // 监听页面卸载
  'onPullDownRefresh', // 监听用户下拉动作
  'onReachBottom', // 页面上拉触底事件的处理函数
  'onShareAppMessage', // 用户点击右上角分享
  'onPageScroll', // 页面滚动
  'onTabItemTap', //当前是 tab 页时， 点击 tab 时触发 （mpvue 0.0.16 支持）
])

Vue.config.productionTip = false
// 在这个地方引入是为了registerHooks先执行
const MyApp = require('./App.vue').default as IMpVue
const app = new Vue(MyApp)
app.$mount()
```
### App.vue
```vue
<script lang="ts" src="./app.ts"></script>
<style></style>
```
```ts
//app.ts
import { Vue, Component } from 'vue-property-decorator'
declare module "vue/types/vue" {
  interface Vue {
    $mp: any;
  }
}

// 必须使用装饰器的方式来指定components
@Component({
  mpType: 'app', // mpvue特定
}as any)
class App extends Vue {
  // app hook
  onLaunch() {
    let opt = this.$root.$mp.appOptions
  }

  onShow() {
  }

  onHide() {
  }

  mounted() { // vue hook
  }
}

export default App
```
### 页面
```vue
<!-- page.vue -->
<template>
  <div class="counter-warp">
    <p>Mpvue</p>
    <p>ts value {{ ver }}</p>
    <card text="card component"></card>
    <comp-b text="card component"></comp-b>
    <a :href="AppUrls.COUNTER" class="home">去往vuex</a>
  </div>
</template>
<!--必须指定为ts-->
<script lang="ts" src="./index.ts"></script>
<style></style>
```
```ts
// index.ts
import { Vue, Component } from 'vue-property-decorator'
import Card from '@/components/card.vue' // mpvue目前只支持的单文件组件
import CompB from '@/components/compb.vue' // mpvue目前只支持的单文件组件
// 必须使用装饰器的方式来指定component
@Component({
  components: {
    Card,
    CompB, //注意，vue的组件在template中的用法，`CompB` 会被转成 `comp-b`
  },
})
class Index extends Vue {
  ver: number = 123
  
  onShow() { // 小程序 hook
  }

  mounted() { // vue hook
  }
}

export default Index
```

### 组件
```vue
<!-- card.vue -->
<template>
  <div>
    <p class="card">
      From Card {{text}} {{ver}}
    </p>
  </div>
</template>
<!--必须指定为ts-->
<script lang="ts" src="./card.ts"></script>
<style></style>
```
```ts
// card.ts
import { Vue, Component, Prop } from 'vue-property-decorator'
// 必须使用装饰器的方式来指定component
@Component
class Card extends Vue {
  @Prop({ default: '1' }) //注意用法！
  text: string;
  
  ver: number = 2;

  onShow() {
  }

  onHide() {
  }

  mounted() { // vue hook
  }
}

export default CompB
```

### 示例Demo

示例: [mpvue-ts-demo](https://github.com/WingGao/mpvue-ts-demo)
