import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'img/no-image.svg',
  loading: 'img/loading.gif',
  attempt: 1
})
