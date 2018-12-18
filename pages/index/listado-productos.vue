<template>
  <no-ssr>
  <div>
    <section class="publication-top section pt-0 pb-0">
		<div class="container-fluid">
			<div class="row">
				<img src="img/img-soyprovidencia/home-entrepreneur-bg.jpg" class="img-fluid" alt="Top">
			</div>
		</div>
	</section>
      <section id="busqueda" class="publication-products section">
      <div class="container">
      <div class="row">
				<div class="col">
					<h2 class="h2">Publicaciones</h2>
				</div>
			</div>
        <form class="margin-top" @submit.prevent v-on:submit="busquedaAvanzada()">

          <!-- Menu Producto -->
          <div class="row" v-if="type.product">
            <div class="col-lg-6">
              <div class="form-group">
                <label for="buscas">¿Buscas un producto o servicio?</label>
                <input type="text" class="form-control" placeholder="Buscar nombre de producto o servicio..." v-model.trim="search.query.find">
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

          <div class="mb-2">
            <button type="submit" class="btn btn-secondary">
              <icon name="search"></icon> <span class="icon-text"> Buscar</span>
            </button>
          </div>
        </form><!-- /Formulario -->
      </div><!-- /container -->
</section><!-- /Busqueda -->

    <!-- RESULTADOS BUSQUEDA -->
    <section class="publication-products section" v-if="paginatedData[0].length > 0">
      <div class="container">
          <div v-if="paginatedData[0].length > 0">
        <div class="row mt-5">
          <div class="col-lg-3 col-sm-6 text-center" :key="post.IDEN_PUBLICACION" v-for="post in paginatedData[pagination]">
                <div class="card">
                <nuxt-link class="card-img-link" :to="{ path: '/publicaciones/'+post.IDEN_PUBLICACION }">
                  <img v-if="post.imagenes.length === 0" v-lazy="'/img/no-image.svg'" class="card-img-top">
                  <img v-else v-lazy="imageUrl + post.imagenes[0].URL_IMAGEN" class="card-img-top">
                  </nuxt-link>
                  <div class="card-body">
                  <h5 class="card-title">{{post.NOMB_PUBLICACION}}</h5>
                  <p class="card-text">Fecha publicación: {{post.FECH_CREACION.substring(8,10) +'/' + post.FECH_CREACION.substring(5,7)+ '/' + post.FECH_CREACION.substring(0,4)}}</p>
                  <p class="card-text">{{post.DESC_PUBLICACION.length > 20 ? post.DESC_PUBLICACION.substring(0, 20) + '...' : post.DESC_PUBLICACION }}</p>
                  <p class="card-text card-price">$ {{ post.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</p>
                  <p class="card-text card-link">
                  <nuxt-link :to="{ path: '/publicaciones/'+post.IDEN_PUBLICACION }">Ver publicación</nuxt-link>
                  </p>
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
          </nav> <!-- /PAGINACION -->
          </div>
          <span v-if="searchMessage" class="text-info">{{ searchMessage }}</span>
      </div>
    </section> <!-- /Resultado Busqueda -->
    <!-- OFERTAS -->
<section id="productos" class="publication-sales section" v-if="publicaciones.length > 0">
      <div class="container">
        <div class="row mt-5">
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
                    style="width: 100%;">
            <slide v-for="post in publicaciones" class="px-2" :key="post.IDEN_PUBLICACION">
              <div class="card ">
              <nuxt-link class="card-img-link" :to="{ path: '/publicaciones/'+post.IDEN_PUBLICACION }">
                <img v-if="post.imagenes.length == 0" v-lazy="'/img/no-image.svg'" class="card-img-top" alt="">
                <img v-else v-lazy="imageUrl + post.imagenes[0].URL_IMAGEN" class="card-img-top" alt="">
              </nuxt-link>
              <div class="card-body">
              <h4 class="card-title">{{ post.NOMB_PUBLICACION }}</h4>
              <p class="card-text">{{ post.DESC_PUBLICACION.substring(0,15) }}...</p>
              <h5 class="card-price">$ {{ post.oferta.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
              </div>
              </div>
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
import custompaginator from '~/controllers/custompaginator'
import categoriescontroller from '~/controllers/admin/categories'
import workfieldsController from '~/controllers/admin/workfields'
import postsController from '~/controllers/posts'

export default {
  asyncData ({ app, store }) {
    store.commit('SET_TITLE', 'ListadoProductos')
    return postsController.GETAll(app)
      .then(({ posts }) => {
        return categoriescontroller.GETAllList(app)
          .then(({ categories }) => {
            categories.sort(function (a, b) {
              return a.NOMB_CATEGORIA.localeCompare(b.NOMB_CATEGORIA, 'es', { numeric: true })
            })
            return workfieldsController.GETAll(app)
              .then(async ({ workfields }) => {
                let publicaciones = []
                posts = posts.filter(el => !el.FLAG_BAN && el.FLAG_VALIDADO && el.FLAG_VIGENTE && !el.emprendedor.usuario.FLAG_BAN)
                posts.sort(function (a, b) {
                  if (new Date(a.FECH_CREACION) > new Date(b.FECH_CREACION)) return -1
                  if (new Date(a.FECH_CREACION) < new Date(b.FECH_CREACION)) return 1
                  return 0
                })
                posts.forEach(post => {
                  if (post.oferta.length > 0) {
                    let offer = post.oferta.filter(el => !el.FLAG_BAN && el.FLAG_VIGENTE && el.FLAG_VALIDADO)[0]
                    if (offer) {
                      post.oferta = offer
                      publicaciones.push(post)
                    }
                  }
                })
                let paginatedData = (await custompaginator.paginate(posts, 12)).paginatedData
                let pages = paginatedData.length
                return {
                  categories: categories,
                  publicaciones,
                  paginatedData,
                  pages,
                  posts,
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
        product: true
      },
      imageUrl: process.env.imagesUrl,
      searchKeys: [], // Encabezados para la tabla segun los datos de busqueda
      searchMessage: false,
      categories: [],
      ofertas: [],
      workfields: [],
      paginatedData: [[]],
      pages: 0,
      pagination: 0,
      postsAux: [],
      posts: []
    }
  },
  methods: {
    async busquedaAvanzada () { // Busqueda avanzada usando un metodo similar al de las otras tablas de datos.
      /*
      * Publicaciones/Productos
      */
      if (this.postsAux.length === 0) {
        this.postsAux = this.paginatedData
      }
      let options = { text: false, filter: false, price: false }
      let postsFound = this.posts

      if (this.search.query.find.length > 0) { // Si posee texto en el buscador...
        options.text = true
        postsFound = []
        let regex = new RegExp(this.search.query.find, 'gi')
        let postSearch = this.posts.map(post => {
          if (post.NOMB_PUBLICACION.match(regex) !== null) return post
        })

        postSearch.forEach(post => {
          if (post) postsFound.push(post)
        })
      }

      if (this.search.query.filter) { // Si posee una categoria de busqueda...
        options.filter = true
        if (options.text) { // Y también texto en el buscador
          let regex = new RegExp(this.search.query.filter, 'gi')
          let postSearch = postsFound.map(post => {
            if (post.categoria.NOMB_CATEGORIA.match(regex) !== null) return post
          })
          postsFound = []
          postSearch.forEach(post => {
            if (post) postsFound.push(post)
          })
        } else { // Sin texto en el buscador...
          postsFound = []
          let regex = new RegExp(this.search.query.filter, 'gi')
          let postSearch = this.posts.map(post => {
            if (post.categoria.NOMB_CATEGORIA.match(regex) !== null) return post
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
          let postSearch = this.posts.map(post => {
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

      if (options.filter || options.text || options.price) {
        postsFound.sort(function (a, b) {
          return a.NOMB_PUBLICACION.localeCompare(b.NOMB_PUBLICACION, 'es', { numeric: true })
        })
      }
      this.paginatedData = (await custompaginator.paginate(postsFound, 12)).paginatedData

      if (this.paginatedData[0].length === 0) {
        this.searchMessage = 'No se encontró ningún resultado.'
        this.paginatedData = [[]]
        this.pagination = 0
        this.pages = 0
      } else {
        this.pages = this.paginatedData.length
        this.pagination = 0
        this.searchMessage = false
      }
    }
  },
  head () {
    return {
      title: 'Listado de publicaciones'
    }
  }
}
</script>
