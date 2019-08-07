  (function () {
    try {
      var cat = document.createElement('script')
      cat.src = '//www.dpfile.com/app/owl/static/owl_1.8.11.js'
      cat.onload = function () {
        Owl.start({ project: 'mpvue-doc' })
      }
      document.getElementsByTagName('head')[0].appendChild(cat)
    } catch (e) {}
  })()
  