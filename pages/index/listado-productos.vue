<template>
<section class="container-fluid" id="admin-faq">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Publicaciones</h2>
        </div>
      </div>
      <!--Buscador de publicaciones -->
      <div class="row">
        <div class="col-lg-4 offset-md-4 col-md-6 offset-sm-3 margin-top py-1">
            <div class="input-group text-truncate">
                <input type="text" class="form-control border border-right-0" placeholder="Buscar en publicaciones..." autocomplete="off" autofocus="autofocus" v-model="search" @keyup="buscarPublicaciones()">
              <div class="input-group-btn">
                <icon name="search"></icon>
              </div>
            </div>
        </div>
      </div>
      <!-- /Buscador de publicaciones-->
      <!-- Tabla de resultados -->
      <div class="row">
        <div class="col-12 table-responsive">
          <table class="table">
          <thead>
            <tr class="text-center">
              <th>Imagen</th>
              <th>Título</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr :key="post.IDEN_PUBLICACION" v-for="post in paginatedData[pagination]" v-if="!post.FLAG_BAN && post.FLAG_VIGENTE && post.FLAG_VALIDADO">
              <td>
                <nuxt-link :to="{ path: '/publicaciones/'+post.IDEN_PUBLICACION }">
                <img :src="post.imagenes.length > 0 && post.imagenes[0].URL_IMAGEN ? imageUrl + post.imagenes[0].URL_IMAGEN : '/img/no-image.svg'" class="img-fluid">
                </nuxt-link>
              </td>
              <td><nuxt-link :to="{ path: '/publicaciones/'+post.IDEN_PUBLICACION }">{{post.NOMB_PUBLICACION}}</nuxt-link></td>
              <td>$ {{ post.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</td>
            </tr>
          </tbody>
        </table>
         <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <!-- Solo permite retroceder si la pagina actual es mayor a 0 -->
                <span aria-label="Previous" v-on:click="pagination > 0 ? pagination-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <!-- Se crea la paginacion al pie de pagina. Se usa page - 1 ya que pagination debe apuntar a los indices del arreglo, por lo que parte de 0 -->
              <li class="page-item" v-bind:key="page" v-for="page in pages">
                <!-- Si la pagina actual es igual a la clickeada, esta se ennegrece -->
                <span class="page-link" v-bind:class="{ 'font-weight: bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <!-- Solo permite avanzar si la pagina actual es inferior a la cantidad de paginas totales - 1 -->
                <span aria-label="Next" v-on:click="pagination < paginatedData.length - 1 ? pagination++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <!-- /Tabla de resultados -->
    </div>
  </section>
</template>

<script>
import controllerPosts from '~/controllers/posts'
// import moment from 'moment'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app, store }) {
    return controllerPosts.GETAll(app)
      .then(({ posts }) => {
        return custompaginator.paginate(posts)
          .then(({ paginatedData }) => {
            let pages = paginatedData.length
            return {
              posts,
              paginatedData,
              pages
            }
          })
        /*  .then(({ posts }) => {
            // Ordena los posts segun la fecha, el mas reciente primero y el mas antiguo al final
            posts.sort(function (a, b) {
              if (moment(a.FECH_CREACION).isAfter(b.FECH_CREACION)) return -1
              if (moment(a.FECH_CREACION).isBefore(b.FECH_CREACION)) return 1
              return 0
            })
            return {
              posts: posts
            }
          }) */
      })
  },
  data () {
    return {
      posts: [],
      pagination: 0,
      pages: 0,
      paginatedData: [[]],
      search: '',
      postsAux: [],
      imageUrl: process.env.imagesUrl
    }
  },
  methods: {
    setState (post) {
      controllerPosts.setState(this, post)
    },
    buscarPublicaciones () {
      // Copiar todos los posts, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.paginatedData
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los post en que el titulo o parte de el posea el texto escrito en el buscador
        let postSearch = this.posts.map(post => {
          if (post.NOMB_PUBLICACION.match(new RegExp(this.search, 'gi')) !== null) return post
        })

        // Limpia los posts actuales y lo llena con los posts que cumplan el criterio de busqueda
        let postFound = []
        postSearch.forEach(post => {
          if (post) postFound.push(post)
        })

        // Ordena los posts en orden lexicografico.
        postFound.sort(function (a, b) {
          return a.NOMB_PUBLICACION.localeCompare(b.NOMB_PUBLICACION)
        })
        // Se llama al paginador con la lista de objetos encontrados
        custompaginator.paginate(postFound)
          .then(({ paginatedData }) => {
            // Se reemplaza la lista paginada actual por la que contiene solo los objetos de la busqueda
            this.paginatedData = paginatedData
            // La cantidad total de paginas se reemplaza por la cantidad de paginas
            // de la nueva lista de objetos encontrados por la busqueda
            this.pages = paginatedData.length
            this.pagination = 0 // Se envia a la pagina inicial en caso de que la busqueda contenga mas de 10 objetos
          })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.paginatedData = this.postsAux
        this.pagination = 0
        this.pages = this.paginatedData.length
      }
    }
  },
  head () {
    return {
      title: 'Publicaciones'
    }
  }
}
</script>
