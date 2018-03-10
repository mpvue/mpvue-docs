<script crossorigin="anonymous" src="//www.dpfile.com/app/owl/static/owl_1.5.28.js"></script>
<script>
Owl.start({
    project: 'mpvue-doc',
    pageUrl: 'build/mpvue-loader'
})
</script>


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
        list: resolve('./src/pages/list/main.js'),   // 其余字段被识别为 page 类型
        page1: resolve('./src/pages/page1/main.js')
    }
}

// 产出文件的结构
.
├── app.js
├── app.json
├── app.wxss
├── components
│   ├── list$018c4df0.wxml
│   ├── page1$23e58823.wxml
├── pages
│   ├── list
│   │   ├── list.js
│   │   ├── list.json
│   │   ├── list.wxml
│   │   └── list.wxss
│   └── page1
│       ├── page1.js
│       ├── page1.json
│       ├── page1.wxml
│       └── page1.wxss
└── static
    ├── assets
    ├── css
    │   ├── app.wxss
    │   ├── list.wxss
    │   └── page1.wxss
    └── js
        ├── app.js
        ├── list.js
        ├── page1.js
        ├── manifest.js
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

细心的开发者可能已经注意到了 `other-component(:msg="msg")` 被转化成了 `<template is="other-component$hash" data="{{ ...$c[0] }}"></template>` 。mpvue 在运行时会从根组件开始把所有的组件实例数据合并成一个树形的数据，然后通过 setData 到 appData,`$c` 是 `$children` 的缩写。至于那个 `0` 则是我们的 compiler 处理过后的一个标记，会为每一个子组件打一个特定的不重复的标记。
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
这部分内容来源于 app 和 page 的 entry 文件，通常习惯是 main.js，你需要在你的入口文件中 `export default { config: {} }`，这才能被我们的 loader 识别为这是一个配置，需要写成 json 文件。
``` javascript
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

