<script crossorigin="anonymous" src="//www.dpfile.com/app/owl/static/owl_1.5.28.js"></script>
<script>
Owl.start({
    project: 'mpvue-doc',
    pageUrl: 'mpvue/quickstart'
})
</script>

# 快速上手

本文假设你既不会 vue 也不会小程序，如嫌拖沓，请直接快进跳读。

## 1. 初始化一个 mpvue 项目
现代前端开发框架和环境都是需要 Node.js 的，如果没有的话，请先下载 [nodejs](https://nodejs.org/) 并安装。

然后打开命令行工具：

``` bash
# 1. 先检查下 Node.js 是否安装成功
$ node -v
v8.9.0

$ npm -v
5.6.0

# 2. 由于众所周知的原因，可以考虑切换源为 taobao 源
$ npm set registry https://registry.npm.taobao.org/

# 3. 全局安装 vue-cli
# 一般是要 sudo 权限的
$ npm install --global vue-cli

# 4. 创建一个基于 mpvue-quickstart 模板的新项目
# 新手一路回车选择默认就可以了
$ vue init mpvue/mpvue-quickstart my-project

# 5. 安装依赖，走你
$ cd my-project
$ npm install
$ npm run dev
```

随着运行成功的回显之后，可以看到本地多了个 `dist` 目录，这个目录里就是生成的小程序相关代码。

## 2. 搭建小程序的开发环境
小程序自己有一个专门的[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html)，[最新版本下载地址](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)。

这一步比较简单，按照提示一步步安装好就行，然后用微信扫描二维码登陆。
至此小程序的开发环境差不多完成。

## 3. 调试开发 mpvue
选择 `小程序项目` 并依次填好需要的信息：

- 项目目录：就是前文提到的那个 `dist` 目录。
- AppID：没有的话可以点选体验“小程序”，只影响是否可以真机调试。
- 项目名称。

如图：

<img src="../../assets/quick-start/1.png" width="300" alt="小程序项目配置">

点击“确定”按钮后会跳到正式的开发页面，点击“编辑器”按钮，关闭自带的小程序编辑器。然后如图：

<img src="../../assets/quick-start/2.png" width="600" alt="mpvue-start">

此时，整个 `mpvue` 项目已经跑起来了。

用自己趁手的编辑器（或者IDE）打开 `my-project` 中的 `src` 目录下的代码试试，如示例：

<video src="../../assets/quick-start/dev.mp4" width="100%" height="auto" controls="controls"></video>

到此，上手完毕。

## 注意事项

1. 新增的页面需要重新 `npm run dev` 来进行编译
