const nodeExternals = require('webpack-node-externals')

module.exports = {
  /*
  ** Middleware application mode
  ** 'spa': No server-side rendering (only client-side navigation)
  ** 'universal': Isomorphic application (server-side rendering + client-side navigation)
  */
  mode: 'universal',
  /*
  ** Router config
  */
  router: {
    middleware: 'check-auth'
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - Soy Providencias',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/LOGO HUB.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway' },
      { rel: 'stylesheet', href: '/css/bootstrap.min.css' },
      { rel: 'stylesheet', href: '/css/font-awesome.min.css' }
    ],
    script: [
      { src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js' },
      { src: '/js/bootstrap.min.js' },
      { src: '/js/style.js' }
    ]
  },
  /*
  ** Customize the progress bar
  */
  // loading: { color: '#3B8070' },
  loading: '~/components/loading.vue',
  /*
  ** Customize the transition between pages
  */
  css: [
    '~/assets/main.css'
  ],
  /*
  ** Plugins initialization
  * src: route
  * ssr: Server-side rendering
  */
  plugins: [
    { src: '~/plugins/vee-validate', ssr: true },
    { src: '~/plugins/croppa', ssr: false },
    { src: '~/plugins/breadcrumb', ssr: true },
    { src: '~/plugins/auth', ssr: false },
    { src: '~/plugins/star-rating', ssr: false },
    { src: '~/plugins/social-sharing', ssr: true },
    { src: '~/plugins/vue-scrollto', ssr: true },
    { src: '~/plugins/vue2-notify', ssr: false },
    { src: '~/plugins/vue-awesome', ssr: true },
    { src: '~/plugins/vue-lazyload', ssr: false },
    { src: '~/plugins/vue-input-tag', ssr: true },
    { src: '~/plugins/vue-google-maps', ssr: true },
    { src: '~/plugins/vue-carousel', ssr: false },
    { src: '~/plugins/vue-moment', ssr: true }
  ],
  /*
  ** Modules initialization
  */
  modules: [
    '@nuxtjs/axios'
  ],
  /*
  ** Axios configuration
  */
  axios: {
    baseURL: 'http://localhost:3000' // CAMBIAR EN PRODUCTIVO #########################  baseURL: 'https://delbarrio.barrenechea.cl/api'
  },
  /*
  ** URLs como variables globales
  */
  env: {
    imagesUrl: 'http://localhost:8080/', // CAMBIAR EN PRODUCTIVO ######################### imagesUrl: 'https://delbarrio.barrenechea.cl/'
    termsUrl: 'http://localhost:8080/terms/TERMINOS_CONDICIONES.pdf' // CAMBIAR EN PRODUCTIVO ######################### TERMINOS_CONDICIONES.pdf siempre será el archivo más reciente
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Instanciar sólo una vez en la aplicación
    */
    vendor: [
      'axios',
      'vee-validate',
      'vue-croppa',
      'vue-scrollto',
      'velocity-animate',
      'vue2-notify',
      'vue-awesome',
      'vue-lazyload',
      'vue-input-tag',
      'vue-carousel'
    ],
    /*
    ** Run ESLint on save
    */

    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: function (path) {
            if (/vue2-google-maps/.test(path)) {
              return false
            }
            if (/node_modules/.test(path)) {
              return true
            }
            return false
          }
        })
      }
      if (!ctx.isClient) {
        config.externals = [
          nodeExternals({
            // default value for `whitelist` is
            // [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i]
            whitelist: [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i, /^vue-awesome/]
          })
        ]
      }
    }
  }
}
