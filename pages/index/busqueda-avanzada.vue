<template>
  <no-ssr>
  <div>
    <section id="busqueda" class="container-fluid">
      <div class="container">
        <h4>Búsqueda avanzada</h4>
        <form class="margin-top" @submit.prevent v-on:submit="busquedaAvanzada()">
          
          <div class="row">
            <div class="col-sm-6">
              <label for="tipo" class="margin-top-20">Tipo</label>
              <div class="btn-group tipo-checkbox" style="width:100%">
                <label class="btn btn-info col-sm-4">
                  <input type="checkbox" autocomplete="off" name="product" v-model="type.product" v-on:click="type.sale = false, type.entrepreneur = false">
                  <icon label="Check">
                    <icon name="square" style="color: #fff"></icon>
                    <icon v-if="type.product" name="check" class="text-checkbox"></icon>
                  </icon>
                  <span> Producto</span>
                </label>
                <label class="btn btn-info col-sm-4">
                  <input type="checkbox" autocomplete="off" v-model="type.entrepreneur" v-on:click="type.product = false, type.sale = false">
                  <icon label="Check">
                    <icon name="square" style="color: #fff"></icon>
                    <icon v-if="type.entrepreneur" name="check" class="text-checkbox"></icon>
                  </icon>
                  <span> Emprendedor</span>
                </label>
                <label class="btn btn-info col-sm-4">
                  <input type="checkbox" autocomplete="off" v-model="type.sale" v-on:click="type.product = false, type.entrepreneur = false">
                  <icon label="Check">
                    <icon name="square" style="color: #fff"></icon>
                    <icon v-if="type.sale" name="check" class="text-checkbox"></icon>
                  </icon>
                  <span> Oferta</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Menu Producto -->
          <div class="row" v-if="type.product"> 
            <div class="col-sm-6">
              <div class="form-group">
                <label for="buscas">¿Qué Buscas? (Opcional)</label>
                <input type="text" class="form-control" placeholder="Buscar Nombre de Producto..." v-model="search.query.find">
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group pricerange">
                <label for="rangodeprecio" class="col-sm-12">Rango de precio de ${{search.minPrice}}{{search.maxPrice ? ' - $' + search.maxPrice : ''}} (Opcional)</label>
                <div class="col-sm-6">
                  <div class="input-group mb-2 mb-sm-0">
                    <div class="input-group-addon">$</div>
                    <input type="number" class="form-control" placeholder="Desde" name="min" v-model="search.minPrice">
                  </div>
                </div>
                <div class="col-sm-6 margin-top-responsive-20">
                  <div class="input-group mb-2 mb-sm-0">
                    <div class="input-group-addon">$</div>
                    <input type="number" class="form-control" placeholder="Hasta" name="max" v-model="search.maxPrice"> 
                  </div>                      
                </div>
              </div>
            </div>
            <div class="col-sm-9">
              <div class="form-group">
                <label for="categoria" class="margin-top-20">Categoría (Opcional)</label>
                <select class="form-control" v-model="search.query.filter">
                  <option v-bind:value="false"></option>
                  <option v-for="category in categories" :key="category.IDEN_CATEGORIA" v-if="category.FLAG_VIGENTE">{{category.NOMB_CATEGORIA}}</option>
                </select>
              </div>
            </div>
          </div> <!-- Fin Menu Producto -->

          <!-- Menu Emprendedor -->
          <div class="row" v-if="type.entrepreneur"> 
            <div class="col-sm-9">
              <div class="form-group">
                <label for="buscas">¿Qué Buscas? (Opcional)</label>
                <input type="text" class="form-control" placeholder="Buscar Nombre de Emprendedor..." v-model="search.query.find">
              </div>
            </div>
            <div class="col-sm-9">
              <div class="form-group">
                <label for="categoria" class="margin-top-20">Rubro (Opcional)</label>
                <select class="form-control" v-model="search.query.filter">
                  <option v-bind:value="false"></option>
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
                <select class="form-control" v-model="search.query.filter">
                  <option v-bind:value="false"></option>
                  <option v-for="category in categories" :key="category.IDEN_CATEGORIA" v-if="category.FLAG_VIGENTE">{{category.NOMB_CATEGORIA}}</option>
                </select>
              </div>
            </div>
          </div> <!-- Fin Menu Oferta -->

          <div class="mb-2">
            <button type="submit" class="btn btn-default">
              <icon name="search"></icon> <span class="icon-text"> Buscar</span>
            </button>
          </div>
        </form><!-- /Formulario -->
      </div><!-- /container -->
    </section><!-- /Busqueda -->

    <section>
      <div class="container">
        <div class="row margin-top">
          <div class="col-xs-12 table-responsive" v-if="paginatedData[0].length > 0">
            <table class="table table-hover table-condensed">
              <thead>
                <tr>
                  <th :key="header" v-for="header in searchKeys">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr :key="item[1]" v-for="item in paginatedData[pagination]">
                  <td>{{item[2]}}</td>
                  <td>{{item[3]}}</td>
                  <td>{{item[4]}}</td>
                  <td>{{item[5]}}</td>
                  <td v-if="item[6]">{{item[6]}}</td>
                  <td v-if="item[7]">{{item[7]}}</td>
                </tr>
              </tbody>
            </table><!-- /tabla generica de datos -->
            <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <span aria-label="Previous" v-on:click="pagination > 0 ? pagination-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <li class="page-item" v-bind:key="page" v-for="page in pages">
                <span class="page-link" v-bind:class="{ 'font-weight: bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
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
      </div>
    </section> <!-- Resultado Busqueda -->

    <section id="emprendedores" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <h2 class="text-center">Emprendedores</h2>
          </div>
          <div class="col-xs-12 py-5">
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
                    >
              <slide v-for="emprendedor in index.emprendedores" :key="emprendedor.IDEN_EMPRENDEDOR" v-if="emprendedor.usuario.FECH_CREACION">
                <nuxt-link :to="'/emprendedores/'+emprendedor.IDEN_EMPRENDEDOR">
                  <img :src="emprendedor.imagen.URL_IMAGEN ? emprendedor.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid">
                </nuxt-link>
                <h3 class="text-center">{{emprendedor.DESC_NOMBRE_FANTASIA}}</h3>
              </slide>
            </carousel>
          </div>
        </div>
      </div><!-- /container -->
    </section><!-- /Emprendedores -->
    
    <section id="productos" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <h2 class="no-margin-top">Publicaciones Destacadas</h2>
          </div>
      </div>
      <div class="row margin-top">
        <div class="row">
          <transition-group name="list" tag="div">
            <div class="col-md-2 col-sm-3 col-xs-6 post-item" v-for="post in index.publicaciones" :key="post.IDEN_PUBLICACION"  v-if="post.FLAG_VIGENTE && !post.FLAG_BAN && post.FLAG_VALIDADO">
              <nuxt-link :to="{ path: '/publicaciones/'+post.IDEN_PUBLICACION }">
                <img v-if="post.imagenes.length == 0" v-lazy="'/img/no-image.svg'" class="img-fluid" alt="">
                <img v-else v-lazy="imageUrl + post.imagenes[0].URL_IMAGEN" class="img-fluid" alt="">
              </nuxt-link>
              <h4 class="text-center">{{ post.NOMB_PUBLICACION }}</h4> 
              <p class="text-center">{{ post.DESC_PUBLICACION.substring(0,20) }}...</p>
              <h5 class="text-center">$ {{ post.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
            </div>
          </transition-group>
        <!-- Productos -->
        </div><!-- /row -->
      </div><!-- /row -->
    </div><!-- /container -->
  </section><!-- /Producto -->

  </div>
</no-ssr>
</template>

<script>
import moment from 'moment'
import controller from '~/controllers/index'
import custompaginator from '~/controllers/custompaginator'
import categoriescontroller from '~/controllers/admin/categories'
import workfieldsController from '~/controllers/admin/workfields'
import entrepreneurController from '~/controllers/admin/entrepreneurs'
import postsController from '~/controllers/posts'
import offersController from '~/controllers/offers'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ index }) => {
        return categoriescontroller.GETAllList(app)
          .then(({ categories }) => {
            return workfieldsController.GETAll(app)
              .then(({ workfields }) => {
                return {
                  categories: categories,
                  index: index,
                  workfields: workfields
                }
              })
          })
      })
  },
  data () {
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
      pagination: 0
    }
  },
  methods: {
    async busquedaAvanzada () { // Busqueda avanzada usando un metodo similar al de las otras tablas de datos.
      /*
      * Emprendedores
      */
      if (this.type.entrepreneur) {
        let entrepreneurs = (await entrepreneurController.GETAll(this)).entrepreneurs
        this.pages = entrepreneurs.length
        let options = { text: false, filter: false }
        let entrepreneursFound = entrepreneurs
        if (this.search.query.find) {
          options.text = true
          entrepreneursFound = []
          let entrepreneurSearch = entrepreneurs.map(entrepreneur => {
            if (entrepreneur.DESC_NOMBRE_FANTASIA.match(new RegExp(this.search.query.find, 'gi')) !== null) return entrepreneur
          })

          entrepreneurSearch.forEach(entrepreneur => {
            if (entrepreneur) entrepreneursFound.push(entrepreneur)
          })
        }

        if (this.search.query.filter) {
          options.filter = true
          if (options.text) {
            let entrepreneurSearch = entrepreneursFound.map(entrepreneur => {
              if (entrepreneur.rubro.NOMB_RUBRO.match(new RegExp(this.search.query.filter, 'gi')) !== null) return entrepreneur
            })
            entrepreneursFound = []
            entrepreneurSearch.forEach(post => {
              if (post) entrepreneursFound.push(post)
            })
          } else {
            entrepreneursFound = []
            let entrepreneurSearch = entrepreneurs.map(entrepreneur => {
              if (entrepreneur.rubro.NOMB_RUBRO.match(new RegExp(this.search.query.filter, 'gi')) !== null) return entrepreneur
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
        custompaginator.paginate(entrepreneursFound)
          .then(({ paginatedData }) => {
            this.paginatedData = paginatedData
            this.pages = paginatedData.length
            this.pagination = 0
          })
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
        custompaginator.paginate(postsFound)
          .then(({ paginatedData }) => {
            this.paginatedData = paginatedData
            this.pages = paginatedData.length
            this.pagination = 0
          })
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
        custompaginator.paginate(offersFound)
          .then(({ paginatedData }) => {
            this.paginatedData = paginatedData
            this.pages = paginatedData.length
            this.pagination = 0
          })
      }

      if (this.paginatedData[0].length === 0) {
        this.searchMessage = 'No se encontró ningún resultado.'
        this.paginatedData = [[]]
        this.pagination = 0
        this.pages = 0
      } else {
        this.searchMessage = false
      }
    },
    toGeneric (data, type) { // Transforma los datos de las busquedas en datos genericos, para que se acomoden a la tabla
      let dataAux = []
      let object = {}
      if (type === 'entrepreneur') {
        data.forEach(item => {
          if (!item.usuario.FLAG_BAN) {
            object = {
              1: item.IDEN_EMPRENDEDOR,
              2: item.DESC_NOMBRE_FANTASIA,
              3: item.DESC_NOMBRE_EMPRESA,
              4: item.DESC_EMPRENDEDOR,
              5: item.rubro.NOMB_RUBRO.length > 40 ? item.rubro.NOMB_RUBRO.substring(0, 40) + '...' : item.rubro.NOMB_RUBRO
            }
            dataAux.push(object)
          }
        })
        this.searchKeys = ['Nombre', 'Nombre Empresa', 'Descripción', 'Rubro']
        return dataAux
      }

      if (type === 'product') {
        data.forEach(item => {
          if (!item.FLAG_BAN) {
            object = {
              1: item.IDEN_PUBLICACION,
              2: item.NOMB_PUBLICACION,
              3: item.categoria.NOMB_CATEGORIA.length > 40 ? item.categoria.NOMB_CATEGORIA.substring(0, 40) + '...' : item.categoria.NOMB_CATEGORIA,
              4: item.DESC_PUBLICACION.length > 40 ? item.DESC_PUBLICACION.substring(0, 40) + '...' : item.DESC_PUBLICACION,
              5: item.NUMR_PRECIO
            }
            dataAux.push(object)
          }
        })
        this.searchKeys = ['Nombre', 'Categoría', 'Descripción', 'Precio']
        return dataAux
      }

      if (type === 'sale') {
        data.forEach(item => {
          if (!item.FLAG_BAN && item.FLAG_VIGENTE) {
            object = {
              1: item.IDEN_OFERTA,
              2: item.publicacion.NOMB_PUBLICACION,
              3: item.publicacion.DESC_PUBLICACION.length > 40 ? item.publicacion.DESC_PUBLICACION.substring(0, 40) + '...' : item.publicacion.DESC_PUBLICACION,
              4: item.NUMR_PRECIO,
              6: item.publicacion.categoria.NOMB_CATEGORIA,
              5: moment(item.FECH_TERMINO).format('DD-MM-YYYY')
            }
            dataAux.push(object)
          }
        })
        this.searchKeys = ['Nombre', 'Descripción', 'Precio', 'Fecha de Termino', 'Categoría']
        return dataAux
      }
    }
  },
  head () {
    return {
      title: 'Búsqueda avanzada'
    }
  }
}
</script>
