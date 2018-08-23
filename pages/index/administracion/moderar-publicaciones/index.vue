<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center py-1">Publicaciones sin revisar</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 py-1">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar Título de Publicación..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarPublicaciones()">
            <div class="input-group-btn">
             <icon name="search" :aria-hidden="true"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-xs-12 table-responsive">
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
          <tbody>
            <tr :key="post.IDEN_PUBLICACION" v-for="post in posts" v-if="!post.FLAG_VALIDADO && !post.FLAG_BAN">
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
            <ul class="pagination">
              <li>
                <a href="#" aria-label="Previous">
                  <span :aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
              <li>
                <a href="#" aria-label="Next">
                  <span :aria-hidden="true">&raquo;</span>
                </a>
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

export default {
  asyncData ({ app }) {
    return postcontroller.GETAll(app)
  },
  data () {
    return {
      posts: [],
      search: '',
      postsAux: []
    }
  },
  methods: {
    acceptPost (post) {
      controller.acceptPost(this, post)
    },
    ban (post) {
      controller.ban(this, post)
    },
    buscarPublicaciones () {
      // Copiar todos los posts, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.posts
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los post en que el titulo o parte de el posea el texto escrito en el buscador
        let postAux = this.postsAux.map(post => {
          if (post.NOMB_PUBLICACION.match(new RegExp(this.search, 'gi')) !== null) return post
        })

        // Limpia los posts actuales y lo llena con los posts que cumplan el criterio de busqueda
        this.posts = []
        postAux.forEach(post => {
          if (post) this.posts.push(post)
        })

        // Ordena los posts en orden lexicografico.
        this.posts.sort(function (a, b) {
          return a.NOMB_PUBLICACION.localeCompare(b.NOMB_PUBLICACION)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.posts = this.postsAux
      }
    }
  },
  filters: {
    dateFormat: function (date) {
      return moment(String(date)).format('DD/MM/YYYY HH:mm')
    }
  },
  head () {
    return {
      title: 'Moderar publicaciones'
    }
  }
}
</script>
