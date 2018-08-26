<template>
<section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Publicaciones</h2>
        </div>
      </div>
      <!--Buscador de publicaciones -->
      <div class="row">
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <form class="mx-2 my-auto d-inline w-50">
            <div class="input-group">
                <input type="text" class="form-control border border-right-0" placeholder="Buscar en publicaciones..." autocomplete="off" autofocus="autofocus" v-model="search" @keyup="buscarPublicaciones()">
                <span class="input-group-append">
                <button class="btn btn-outline-secondary border border-left-0" type="submit">
                    <i class="fa fa-search"></i>
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
      <!-- /Buscador de publicaciones-->
      <!-- Tabla de resultados -->
      <div class="row margin-top">
        <div class="col-xs-12 table-responsive">
          <table class="table table-hover table-condensed">
          <thead>
            <tr>
              <th></th>
              <th>Título</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="post.IDEN_PUBLICACION" v-for="post in posts" v-if="!post.FLAG_BAN && post.FLAG_VIGENTE && post.FLAG_VALIDADO">
              <td><img :src="post.imagen.URL_IMAGEN ? post.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid"></td>
              <td>{{post.NOMB_PUBLICACION}}</td>
              <td>$ {{ post.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
      <!-- /Tabla de resultados -->
    </div>
  </section>
</template>

<script>
import controllerPosts from '~/controllers/posts'
import moment from 'moment'

export default {
  asyncData ({ app, store }) {
    return controllerPosts.GETAll(app)
      .then(({ posts }) => {
        // Ordena los posts segun la fecha, el mas reciente primero y el mas antiguo al final
        posts.sort(function (a, b) {
          if (moment(a.FECH_CREACION).isAfter(b.FECH_CREACION)) return -1
          if (moment(a.FECH_CREACION).isBefore(b.FECH_CREACION)) return 1
          return 0
        })
        return {
          posts: posts
        }
      })
  },
  data () {
    return {
      posts: [],
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
  head () {
    return {
      title: 'Publicaciones'
    }
  }
}
</script>
