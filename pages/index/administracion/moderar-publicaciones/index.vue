<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center py-1">Publicaciones sin revisar</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 offset-md-4 col-md-6 offset-sm-3 py-1">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model.trim="search" placeholder="Buscar Título de Publicación..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarPublicaciones()">
            <div class="input-group-btn">
             <icon name="search"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-12 table-responsive">
          <table class="table">
          <thead>
            <tr class="text-center">
              <th>Título</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Fecha creación</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr :key="post.IDEN_PUBLICACION" v-for="post in paginatedData[pagination]">
              <td><nuxt-link :to="{ path: '/publicaciones/' + post.IDEN_PUBLICACION }">{{post.NOMB_PUBLICACION}}</nuxt-link></td>
              <td>{{post.CODI_TIPO_PUBLICACION == 'P' ? 'Producto' : 'Servicio' }}</td>
              <td>{{post.categoria.NOMB_CATEGORIA}}</td>
              <td>{{post.FECH_CREACION | dateFormat}}</td>
              <td>
                <a class="btn" @click="acceptPost(post)" title="Aceptar"><button class="btn btn-tabla">Aceptar</button></a>
                <a class="btn" @click="ban(post)" title="Rechazar"><button class="btn btn-tabla">Rechazar</button></a>
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
import postcontroller from '~/controllers/posts'
import controller from '~/controllers/admin/postmoderation'
import moment from 'moment'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return postcontroller.GETAll(app)
      .then(({ posts }) => {
        let postsAux = []
        posts.forEach(p => {
          if (!p.FLAG_VALIDADO && !p.FLAG_BAN) postsAux.push(p)
        })
        return custompaginator.paginate(postsAux)
          .then(({ paginatedData }) => {
            let pages = paginatedData.length
            return {
              posts,
              paginatedData,
              pages
            }
          })
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
      processing: false
    }
  },
  methods: {
    async acceptPost (post) {
      if (this.processing) return
      this.processing = true

      await controller.acceptPost(this, post)
      this.processing = false
    },
    async ban (post) {
      if (this.processing) return
      this.processing = true

      await controller.ban(this, post)
      this.processing = false
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
        let postsFound = []
        postSearch.forEach(post => {
          if (post) postsFound.push(post)
        })
        // Ordena los posts en orden lexicografico.
        postsFound.sort(function (a, b) {
          return a.NOMB_PUBLICACION.localeCompare(b.NOMB_PUBLICACION)
        })

        // Se llama al paginador con la lista de objetos encontrados
        custompaginator.paginate(postsFound)
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
        this.pagination = 0 // Se devuelve a la pagina inicial de la lista
        this.pages = this.paginatedData.length // Se restaura la cantidad de paginas totales
      }
    }
  },
  filters: {
    dateFormat: function (date) {
      return moment(String(date)).format('DD/MM/YYYY HH:mm')
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Moderar publicaciones'
    }
  }
}
</script>
