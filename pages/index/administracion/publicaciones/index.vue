<template>
<section class="container-fluid" id="admin-faq">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Tus publicaciones</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-4 py-2">
          <nuxt-link :to="{ path: '/administracion/publicaciones/nueva' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-lg-4 offset-md-3 col-md-6 offset-sm-3 py-1">
          <input class="form-control" name="search" v-model.trim="search" placeholder="Buscar en mis publicaciones..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarPublicaciones()">
        </div>
      </div>
      <div class="row margin-top">
        <div class="col-12 table-responsive">
          <table class="table">
          <thead>
            <tr class="text-center">
              <th>Estado</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr :key="post.IDEN_PUBLICACION" v-for="post in paginatedData[pagination]" v-if="!post.FLAG_BAN">
              <td>
                <icon :name="post.FLAG_VIGENTE ? 'check' : 'times'" :title="post.FLAG_VIGENTE ? 'Habilitado' : 'Deshabilitado'"></icon>
              </td>
              <td>{{post.NOMB_PUBLICACION}}</td>
              <td>{{post.CODI_TIPO_PUBLICACION == 'P' ? 'Producto' : 'Servicio' }}</td>
              <td>{{post.categoria.NOMB_CATEGORIA}}</td>
              <td>
                <nuxt-link :to="{ path: '/administracion/publicaciones/editar/'+post.IDEN_PUBLICACION }">
                  <button class="btn btn-tabla">Editar</button>
                </nuxt-link>
                <nuxt-link :to="{ path: '/administracion/publicaciones/ofertas/'+post.IDEN_PUBLICACION }">
                  <button class="btn btn-tabla">Oferta</button>
                </nuxt-link>
                <a class="btn" @click="setState(post)">
                  <button class="btn btn-tabla" v-if="!post.FLAG_VIGENTE">Habilitar</button>
                  <button class="btn btn-tabla" v-if="post.FLAG_VIGENTE">Deshabilitar</button>
                </a>
              </td>
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
                <span class="page-link" v-bind:class="{ 'font-weight-bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
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
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/myaccount'
import controllerPosts from '~/controllers/posts'
// import moment from 'moment'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app, store }) {
    return controller.GET(app, store._vm.loggedUser.id)
      .then(({ user }) => {
        return controllerPosts.GETPostEmprendedor(app, user.emprendedor.IDEN_EMPRENDEDOR)
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
          })
        /* .then(({ posts }) => {
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
      pagination: 0, // Numero de la pagina
      pages: 0, // Conteo cantidad total de paginas
      paginatedData: [[]], // Datos paginados
      search: '',
      postsAux: []
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
  computed: mapGetters([
    'loggedUser'
  ]),
  middleware: 'authenticated',
  head () {
    return {
      title: 'Publicaciones'
    }
  }
}
</script>
