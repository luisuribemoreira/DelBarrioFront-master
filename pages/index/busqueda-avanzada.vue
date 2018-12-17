<template>
  <no-ssr>
  <div>
    <section id="busqueda">
      <div class="container">
        <div class="row">
          <div class="col">
        <h2 class="h2 text-center">Búsqueda avanzada</h2>
          </div>
        </div>

        <form class="margin-top" @submit.prevent v-on:submit="busquedaAvanzada()">
          <div class="row">
            <div class="col-md-6">
              <label for="tipo" class="margin-top-20">Tipo</label>
              <div class="btn-group tipo-form-check" style="width:100%">
                <label class="btn btn-info col-sm-4">
                  <input type="checkbox" autocomplete="off" name="product" v-model.trim="type.product" v-on:click="type.sale = false, type.entrepreneur = false, clean()">
                  <span> Producto</span>
                </label>
                <label class="btn btn-info col-sm-4">
                  <input type="checkbox" autocomplete="off" v-model.trim="type.entrepreneur" v-on:click="type.product = false, type.sale = false, clean()">
                  <span> Emprendedor</span>
                </label>
                <label class="btn btn-info col-sm-4">
                  <input type="checkbox" autocomplete="off" v-model.trim="type.sale" v-on:click="type.product = false, type.entrepreneur = false, clean()">
                  <span> Oferta</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Menu Producto -->
          <div class="row" v-if="type.product">
            <div class="col-lg-6">
              <div class="form-group">
                <label for="buscas">¿Qué Buscas? (Opcional)</label>
                <input type="text" class="form-control" placeholder="Buscar Nombre de Producto..." v-model.trim="search.query.find">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group pricerange">
                <label for="rangodeprecio" class="col-md-12">Rango de precio ${{search.minPrice}}{{search.maxPrice ? ' - $' + search.maxPrice : ''}} (Opcional)</label>
                <div class="col-md-6">
                  <div class="input-group mb-2 mb-sm-0">
                    <input type="number" class="form-control" placeholder="Desde" name="min" v-model.trim="search.minPrice" min="1" max="900000">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group mb-2 mb-sm-0">
                    <input type="number" class="form-control" placeholder="Hasta" name="max" v-model.trim="search.maxPrice" min="1" max="900000">
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="categoria" class="margin-top-20">Categoría (Opcional)</label>
                <select class="form-control" v-model.trim="search.query.filter">
                  <option v-bind:value="false">Seleccione una categoría...</option>
                  <option v-for="category in categories" :key="category.IDEN_CATEGORIA" v-if="category.FLAG_VIGENTE">{{category.NOMB_CATEGORIA}}</option>
                </select>
              </div>
            </div>
          </div> <!-- Fin Menu Producto -->

          <!-- Menu Emprendedor -->
          <div class="row" v-if="type.entrepreneur">
            <div class="col-md-9">
              <div class="form-group">
                <label for="buscas">¿Qué Buscas? (Opcional)</label>
                <input type="text" class="form-control" placeholder="Buscar Nombre de Emprendedor..." v-model.trim="search.query.find">
              </div>
            </div>
            <div class="col-md-9">
              <div class="form-group">
                <label for="categoria" class="margin-top-20">Rubro (Opcional)</label>
                <select class="form-control" v-model.trim="search.query.filter">
                  <option v-bind:value="false">Seleccione un rubro...</option>
                  <option v-for="workfield in workfields" :key="workfield.IDEN_RUBRO" v-if="workfield.FLAG_VIGENTE">{{workfield.NOMB_RUBRO}}</option>
                </select>
              </div>
            </div>
          </div> <!-- Fin Menu Emprendedor -->

          <!-- Menu Oferta -->
          <div class="row" v-if="type.sale">
            <div class="col-sm-9">
              <div class="form-group">
                <label for="categoria" class="margin-top-20">Categoría (Opcional)</label>
                <select class="form-control" v-model.trim="search.query.filter">
                  <option v-bind:value="false">Seleccione una categoría...</option>
                  <option v-for="category in categories" :key="category.IDEN_CATEGORIA" v-if="category.FLAG_VIGENTE">{{category.NOMB_CATEGORIA}}</option>
                </select>
              </div>
            </div>
          </div> <!-- Fin Menu Oferta -->

          <div class="mb-2">
            <button type="submit" class="btn btn-secondary">
              <icon name="search"></icon> <span class="icon-text"> Buscar</span>
            </button>
          </div>
        </form><!-- /Formulario -->
      </div><!-- /container -->
    </section><!-- /Busqueda -->

    <section class="search-products section" v-if="paginatedData[0].length > 0"><!-- RESULTADOS BUSQUEDA -->
      <div class="container">
          <div v-if="paginatedData[0].length > 0">
            <div class="row mt-5">
                <div class="col-lg-3 col-sm-6 text-center" :key="item[1]" v-for="item in paginatedData[pagination]">
                  <div class="card" v-if="type.entrepreneur">
                    <nuxt-link class="card-img-link" :to="{ path: '/emprendedores/'+item[1]}">
                    <img v-if="!item[0]" v-lazy="'/img/no-image.svg'" class="card-img-top">
                    <img v-else v-lazy="imageUrl + item[0]" class="card-img-top">
                    </nuxt-link>
                    <div class="card-body">
                      <h5 class="card-title">{{item[2]}}</h5>
                      <p class="card-text">{{item[4]}}</p>
                      <p class="card-text">{{item[5]}}</p>
                      <div v-if="item[6]">{{item[6]}}</div>
                  </div>
                  </div>
                  <div class="card" v-if="type.product || type.sale">
                    <nuxt-link :to="{ path: '/publicaciones/'+item[1]}">
                    <img v-if="!item[0]" v-lazy="'/img/no-image.svg'" class="card-img-top">
                    <img v-else v-lazy="imageUrl + item[0]" class="card-img-top">
                    </nuxt-link>
                    <div class="card-body">
                      <h5 class="card-title">{{item[2]}}</h5>
                      <p class="card-text">{{item[4]}}</p>
                      <p class="card-text card-price">{{item[5]}}</p>
                      <div class="card-text" v-if="item[6]">{{item[6]}}</div>
                      {{item[7]}}
                  </div>
                  </div>
                </div>
            </div><!-- /tabla generica de datos -->
            <!-- PAGINACION -->
            <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <span aria-label="Previous" v-on:click="pagination > 0 ? pagination-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <li class="page-item" v-bind:key="page" v-for="page in pages">
                <span class="page-link" v-bind:class="{ 'font-weight-bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <span aria-label="Next" v-on:click="pagination < paginatedData.length - 1 ? pagination++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav> <!-- navegacion -->
          </div>
          <span v-if="searchMessage" class="text-info">{{ searchMessage }}</span>
      </div>
    </section> <!-- Resultado Busqueda -->

    <!-- OFERTAS -->
    <section id="productos" class="publication-sales section" v-if="publicaciones.length > 0">
      <div class="container">
        <div class="row mb-5">
          <div class="col">
            <h2 class="home-products--top-title text-center text-white h2">Ofertas</h2>
          </div>
        <div class="col-12 py-5">
           <carousel
                    :navigationEnabled="true"
                    :loop="true"
                    paginationActiveColor="#89dbee"
                    paginationColor="#b2ebd1"
                    :paginationSize="5"
                    easing="linear"
                    :speed="300"
                    :perPageCustom="[[768, 1], [1024, 6]]"
                    :autoplay ="true"
                    :autoplayTimeout="5000"
                    :autoplayHoverPause = "true"
                    style="width: 100%;"
                    >
            <slide v-for="post in publicaciones" :key="post.IDEN_PUBLICACION">
              <nuxt-link :to="{ path: '/publicaciones/'+post.IDEN_PUBLICACION }">
                <img v-if="post.imagenes.length == 0" v-lazy="'/img/no-image.svg'" class="img-fluid" alt="">
                <img v-else v-lazy="imageUrl + post.imagenes[0].URL_IMAGEN" class="img-fluid" alt="">
              </nuxt-link>
              <h4 class="text-center">{{ post.NOMB_PUBLICACION }}</h4>
              <p class="text-center">{{ post.DESC_PUBLICACION.substring(0,20) }}...</p>
              <h5 class="text-center">$ {{ post.oferta.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
            </slide>
           </carousel>
        </div>
      </div>
    </div>
  </section><!-- /OFERTAS -->

  </div>
</no-ssr>
</template>

<!-- SCRIPT -->
<script>
import moment from 'moment'
import controller from '~/controllers/index'
import custompaginator from '~/controllers/custompaginator'
import categoriescontroller from '~/controllers/admin/categories'
import workfieldsController from '~/controllers/admin/workfields'
import entrepreneurController from '~/controllers/admin/entrepreneurs'
import postsController from '~/controllers/posts'
import offersController from '~/controllers/offers'
import Numeral from 'numeral'
import es from 'numeral/locales/es' //eslint-disable-line

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ index }) => {
        return categoriescontroller.GETAllList(app)
          .then(({ categories }) => {
            categories.sort(function (a, b) {
              return a.NOMB_CATEGORIA.localeCompare(b.NOMB_CATEGORIA, 'es', { numeric: true })
            })
            return workfieldsController.GETAll(app)
              .then(({ workfields }) => {
                workfields.sort(function (a, b) {
                  return a.NOMB_RUBRO.localeCompare(b.NOMB_RUBRO, 'es', { numeric: true })
                })
                let publicaciones = []
                index.publicaciones.forEach(post => {
                  if (post.FLAG_VIGENTE && !post.FLAG_BAN && post.FLAG_VALIDADO && !post.emprendedor.usuario.FLAG_BAN) {
                    if (post.oferta.length > 0) {
                      let offer
                      post.oferta.forEach(o => {
                        if (!o.FLAG_BAN && o.FLAG_VIGENTE && o.FLAG_VALIDADO) {
                          offer = o
                        }
                      })
                      if (offer) {
                        post.oferta = offer
                        publicaciones.push(post)
                      }
                    }
                  }
                })
                return {
                  categories: categories,
                  publicaciones,
                  workfields: workfields
                }
              })
          })
      })
  },
  data () {
    Numeral.locale('es')
    return {
      search: {
        query: {
          find: '',
          filter: false
        },
        minPrice: '',
        maxPrice: ''
      },
      type: {
        product: true,
        entrepreneur: false,
        sale: false
      },
      imageUrl: process.env.imagesUrl,
      searchKeys: [], // Encabezados para la tabla segun los datos de busqueda
      searchMessage: false,
      categories: [],
      index: [],
      workfields: [],
      paginatedData: [[]],
      pages: 0,
      pagination: 0,
      loaded: true,
      processing: false
    }
  },
  methods: {
    async busquedaAvanzada () { // Busqueda avanzada usando un metodo similar al de las otras tablas de datos.
      /*
      * Emprendedores
      */
      if (this.processing) return
      this.processing = true
      if (this.type.entrepreneur) {
        let entrepreneurs = (await entrepreneurController.GETAll(this)).entrepreneurs
        this.pages = entrepreneurs.length
        let options = { text: false, filter: false }
        let entrepreneursFound = []
        entrepreneurs.forEach(entrepreneur => {
          if (entrepreneur.usuario && entrepreneur.usuario.FECH_CREACION) entrepreneursFound.push(entrepreneur)
        })
        if (this.search.query.find.length > 0) {
          options.text = true
          entrepreneursFound = []
          let entrepreneurSearch = entrepreneurs.map(entrepreneur => {
            if (entrepreneur.usuario && entrepreneur.usuario.FECH_CREACION) {
              if (entrepreneur.DESC_NOMBRE_FANTASIA.match(new RegExp(this.search.query.find, 'gi')) !== null) return entrepreneur
            }
          })

          entrepreneurSearch.forEach(entrepreneur => {
            if (entrepreneur) entrepreneursFound.push(entrepreneur)
          })
        }

        if (this.search.query.filter) {
          options.filter = true
          if (options.text) {
            let entrepreneurSearch = entrepreneursFound.map(entrepreneur => {
              if (entrepreneur.usuario && entrepreneur.usuario.FECH_CREACION) {
                if (entrepreneur.rubro.NOMB_RUBRO.match(new RegExp(this.search.query.filter, 'gi')) !== null) return entrepreneur
              }
            })
            entrepreneursFound = []
            entrepreneurSearch.forEach(entrepreneur => {
              if (entrepreneur) entrepreneursFound.push(entrepreneur)
            })
          } else {
            entrepreneursFound = []
            let entrepreneurSearch = entrepreneurs.map(entrepreneur => {
              if (entrepreneur.usuario && entrepreneur.usuario.FECH_CREACION) {
                if (entrepreneur.rubro.NOMB_RUBRO.match(new RegExp(this.search.query.filter, 'gi')) !== null) return entrepreneur
              }
            })

            entrepreneurSearch.forEach(entrepreneur => {
              if (entrepreneur) entrepreneursFound.push(entrepreneur)
            })
          }
        }

        entrepreneursFound.sort(function (a, b) {
          return a.DESC_NOMBRE_FANTASIA.localeCompare(b.DESC_NOMBRE_FANTASIA, 'es', { numeric: true })
        })
        entrepreneursFound = this.toGeneric(entrepreneursFound, 'entrepreneur')
        let paginatedData = (await custompaginator.paginate(entrepreneursFound)).paginatedData
        this.paginatedData = paginatedData
        this.pages = paginatedData.length
        this.pagination = 0
      }

      /*
      * Publicaciones/Productos
      */
      if (this.type.product) {
        let posts = (await postsController.GETAll(this)).posts
        this.pages = posts.length
        let options = { text: false, filter: false, price: false }
        let postsFound = posts
        if (this.search.query.find.length > 0) { // Si posee texto en el buscador...
          options.text = true
          postsFound = []
          let postSearch = posts.map(post => {
            if (post.NOMB_PUBLICACION.match(new RegExp(this.search.query.find, 'gi')) !== null) return post
          })

          postSearch.forEach(post => {
            if (post) postsFound.push(post)
          })
        }

        if (this.search.query.filter) { // Si posee una categoria de busqueda...
          options.filter = true
          if (options.text) { // Y también texto en el buscador
            let postSearch = postsFound.map(post => {
              if (post.categoria.NOMB_CATEGORIA.match(new RegExp(this.search.query.filter, 'gi')) !== null) return post
            })
            postsFound = []
            postSearch.forEach(post => {
              if (post) postsFound.push(post)
            })
          } else { // Sin texto en el buscador...
            postsFound = []
            let postSearch = posts.map(post => {
              if (post.categoria.NOMB_CATEGORIA.match(new RegExp(this.search.query.filter, 'gi')) !== null) return post
            })

            postSearch.forEach(post => {
              if (post) postsFound.push(post)
            })
          }
        }

        if (this.search.minPrice.length > 0 || this.search.maxPrice.length > 0) { // Si hay rangos ingresados...
          options.price = true
          if (options.text || options.filter) { // Si el buscador tiene texto y/o también hay una categoría de filtro
            let postSearch = postsFound.map(post => {
              if (this.search.minPrice.length > 0 && this.search.maxPrice.length === 0) { // Si solo hay un rango inferior
                if (Number(post.NUMR_PRECIO) >= Number(this.search.minPrice)) return post
              }
              if (this.search.minPrice.length === 0 && this.search.maxPrice.length > 0) { // Si solo hay un rango superior
                if (Number(post.NUMR_PRECIO) <= Number(this.search.maxPrice)) return post
              }
              if (this.search.minPrice.length > 0 && this.search.maxPrice.length > 0) { // Si estan ambos rangos
                if (Number(post.NUMR_PRECIO) >= Number(this.search.minPrice) &&
                Number(post.NUMR_PRECIO) <= Number(this.search.maxPrice)) return post
              }
            })
            postsFound = []
            postSearch.forEach(post => {
              if (post) postsFound.push(post)
            })
          } else {
            postsFound = []
            let postSearch = posts.map(post => {
              if (this.search.minPrice.length > 0 && this.search.maxPrice.length === 0) { // Si solo hay un rango inferior
                if (Number(post.NUMR_PRECIO) >= Number(this.search.minPrice)) return post
              }
              if (this.search.minPrice.length === 0 && this.search.maxPrice.length > 0) { // Si solo hay un rango superior
                if (Number(post.NUMR_PRECIO) <= Number(this.search.maxPrice)) return post
              }
              if (this.search.minPrice.length > 0 && this.search.maxPrice.length > 0) { // Si estan ambos rangos
                if (Number(post.NUMR_PRECIO) >= Number(this.search.minPrice) &&
                Number(post.NUMR_PRECIO) <= Number(this.search.maxPrice)) return post
              }
            })
            postSearch.forEach(post => {
              if (post) postsFound.push(post)
            })
          }
        }

        postsFound.sort(function (a, b) {
          return a.NOMB_PUBLICACION.localeCompare(b.NOMB_PUBLICACION, 'es', { numeric: true })
        })
        postsFound = this.toGeneric(postsFound, 'product')
        let paginatedData = (await custompaginator.paginate(postsFound)).paginatedData
        this.paginatedData = paginatedData
        this.pages = paginatedData.length
        this.pagination = 0
      }

      /*
      * Ofertas
      */
      if (this.type.sale) {
        let offers = (await offersController.GETAll(this)).offers
        this.pages = offers.length
        let offersFound = offers
        if (this.search.query.filter) {
          offersFound = []
          let offerSearch = offers.map(offer => {
            if (offer.publicacion.categoria.NOMB_CATEGORIA.match(new RegExp(this.search.query.filter, 'gi')) !== null) return offer
          })

          offerSearch.forEach(offer => {
            if (offer) offersFound.push(offer)
          })
        }

        offersFound.sort(function (a, b) {
          return a.publicacion.NOMB_PUBLICACION.localeCompare(b.publicacion.NOMB_PUBLICACION, 'es', { numeric: true })
        })
        offersFound = this.toGeneric(offersFound, 'sale')
        let paginatedData = (await custompaginator.paginate(offersFound)).paginatedData
        this.paginatedData = paginatedData
        this.pages = paginatedData.length
        this.pagination = 0
      }

      if (this.paginatedData[0].length === 0) {
        this.searchMessage = 'No se encontró ningún resultado.'
        this.paginatedData = [[]]
        this.pagination = 0
        this.pages = 0
      } else {
        this.searchMessage = false
      }
      this.processing = false
    },
    toGeneric (data, type) { // Transforma los datos de las busquedas en datos genericos, para que se acomoden a la tabla
      let dataAux = []
      let object = {}
      if (type === 'entrepreneur') {
        data.forEach(item => {
          if (!item.usuario.FLAG_BAN) {
            object = {
              0: item.imagen.URL_IMAGEN,
              1: item.IDEN_EMPRENDEDOR,
              2: item.DESC_NOMBRE_FANTASIA,
              3: item.DESC_NOMBRE_EMPRESA,
              4: item.DESC_EMPRENDEDOR.length > 80 ? item.DESC_EMPRENDEDOR.substring(0, 80) + '...' : item.DESC_EMPRENDEDOR,
              5: item.rubro.NOMB_RUBRO.length > 80 ? item.rubro.NOMB_RUBRO.substring(0, 80) + '...' : item.rubro.NOMB_RUBRO
            }
            dataAux.push(object)
          }
        })
        this.searchKeys = ['Nombre', 'Nombre Empresa', 'Descripción', 'Rubro']
        return dataAux
      }

      if (type === 'product') {
        data.forEach(item => {
          if (!item.FLAG_BAN && item.FLAG_VIGENTE && item.FLAG_VALIDADO) {
            object = {
              0: item.imagenes[0].URL_IMAGEN,
              1: item.IDEN_PUBLICACION,
              2: item.NOMB_PUBLICACION,
              3: item.categoria.NOMB_CATEGORIA.length > 80 ? item.categoria.NOMB_CATEGORIA.substring(0, 80) + '...' : item.categoria.NOMB_CATEGORIA,
              4: item.DESC_PUBLICACION.length > 80 ? item.DESC_PUBLICACION.substring(0, 80) + '...' : item.DESC_PUBLICACION,
              5: Numeral(item.NUMR_PRECIO).format('$ 0,0')
            }
            dataAux.push(object)
          }
        })
        this.searchKeys = ['Nombre', 'Categoría', 'Descripción', 'Precio']
        return dataAux
      }

      if (type === 'sale') {
        data.forEach(item => {
          if (!item.FLAG_BAN && item.FLAG_VIGENTE && item.FLAG_VALIDADO) {
            object = {
              0: item.publicacion.imagenes[0].URL_IMAGEN,
              1: item.publicacion.IDEN_PUBLICACION,
              2: item.publicacion.NOMB_PUBLICACION,
              3: item.publicacion.DESC_PUBLICACION.length > 80 ? item.publicacion.DESC_PUBLICACION.substring(0, 80) + '...' : item.publicacion.DESC_PUBLICACION,
              4: Numeral(item.NUMR_PRECIO).format('$ 0,0'),
              5: moment(item.FECH_TERMINO).format('DD-MM-YYYY'),
              6: item.publicacion.categoria.NOMB_CATEGORIA
            }
            dataAux.push(object)
          }
        })
        this.searchKeys = ['Nombre', 'Descripción', 'Precio', 'Fecha de Termino', 'Categoría']
        return dataAux
      }
    },
    globalSearch () {
      if (this.$route.query.nombre && this.$route.query.tipo) {
        // timeout con tiempo 0 ms, solo para empujar las asignaciones
        // y la llamada al metodo al final del call stack, para darle tiempo a la pagina para que carge completamente.
        setTimeout(() => {
          this.search.query.find = this.$route.query.nombre
          if (this.$route.query.tipo === 'publicacion') {
            this.type.product = true
            this.type.entrepreneur = false
            this.type.sale = false
          }
          if (this.$route.query.tipo === 'emprendedor') {
            this.type.product = false
            this.type.entrepreneur = true
            this.type.sale = false
          }
          this.busquedaAvanzada()
        }, 0)
      }
    },
    clean () {
      this.paginatedData = [[]]
      this.pagination = 0
      this.pages = 0
      this.search = {
        query: {
          find: '',
          filter: false
        },
        minPrice: '',
        maxPrice: ''
      }
    }
  },
  mounted () {
    this.globalSearch()
  },
  updated () {
    // Condicion para permitir utilizar el buscador ya estando en la página.
    if (this.loaded) {
      this.globalSearch()
      this.loaded = false
    }
  },
  head () {
    return {
      title: 'Búsqueda avanzada'
    }
  }
}
</script>
