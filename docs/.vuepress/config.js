module.exports = {
  title: 'mpvue.com',
  description: 'mpvue document',
  head: [
    ['link', {rel: 'icon', href: '/'}]
  ],
  base: '/',
  themeConfig: {
    repo: 'https://github.com/mpvue/mpvue-docs',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: false,

    nav: [
      {
        text: '首页',
        link: '/'
      }, {
        text: 'Q&A',
        link: '/qa'
      },
      {
        text: 'build',
        items: [
          {
            text: 'index',
            link: '/build/index'
          }, {
            text: 'mpvue-webpack-target',
            link: '/build/mpvue-webpack-target'
          }, {
            text: 'postcss-mpvue-wxss',
            link: '/build/postcss-mpvue-wxss'
          }, {
            text: 'px2rpx-loader',
            link: '/build/px2rpx-loader'
          }, {
            text: 'mpvue-lint',
            link: '/build/mpvue-lint'
          }, {
            text: 'webpack-mpvue-asset-plugin',
            link: '/build/webpack-mpvue-asset-plugin'
          }
        ]
      }, {
        text: 'mpvue',
        items: [{
          text: 'index',
          link: '/mpvue/index'
        }, {
          text: 'mpvue-template-compiler',
          link: '/mpvue/mpvue-template-compiler'
        }, {
          text: 'quickstart',
          link: '/mpvue/quickstart'
        }, {
          text: 'Simple',
          link: '/mpvue/simple'
        }]
      }, {
        text: 'changelog',
        items: [{
          text: 'index',
          link: '/change-log/index'
        }, {
          text: '2018.7.24',
          link: '/change-log/2018.7.24'
        }]
      }
    ]
  }
}

