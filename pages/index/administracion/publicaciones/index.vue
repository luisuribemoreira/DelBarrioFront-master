<template>
<section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Tus publicaciones</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link :to="{ path: '/administracion/publicaciones/nueva' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <input class="form-control" name="search" v-model="search" placeholder="Buscar en mis publicaciones..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarPublicaciones()">
        </div>
      </div>
      <div class="row margin-top">
        <div class="col-xs-12 table-responsive">
          <table class="table table-responsive">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="post.IDEN_PUBLICACION" v-for="post in posts"><!--v-if="!post.FLAG_BAN"-->
              <td>
                <icon :name="post.FLAG_VIGENTE ? 'check' : 'times'" :title="post.FLAG_VIGENTE ? 'Habilitado' : 'Deshabilitado'"></icon>
              </td>
              <td>{{post.NOMB_PUBLICACION}}</td>
              <td>{{post.CODI_TIPO_PUBLICACION == 'P' ? 'Producto' : 'Servicio' }}</td>
              <td>{{post.categoria.NOMB_CATEGORIA}}</td>
              <td>
                <nuxt-link :to="{ path: '/administracion/publicaciones/editar/'+post.IDEN_PUBLICACION }" class="btn btn-secondary">
                  <icon name="pencil-square-o" title="Editar"></icon>
                </nuxt-link>
                <nuxt-link :to="{ path: '/administracion/publicaciones/ofertas/'+post.IDEN_PUBLICACION }" class="btn btn-secondary">
                  <i class="fa fa-money" title="Oferta"></i>
                </nuxt-link>
                <a class="btn" v-if="!post.FLAG_BAN" v-bind:class="post.FLAG_VIGENTE ? 'btn-danger' : 'btn-success'" @click="setState(post)" v-bind:title="post.FLAG_VIGENTE ? 'Deshabilitar' : 'Habilitar'">
                  <i class="fa" v-bind:class="post.FLAG_VIGENTE ? 'fa-times' : 'fa-check'"></i>
                </a>
                 <label v-if="post.FLAG_VIGENTE" style="padding: 10px">Deshabilitar</label>
                 <label v-if="!post.FLAG_VIGENTE" style="padding: 10px">Habilitar</label>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/myaccount'
import controllerPosts from '~/controllers/posts'
import moment from 'moment'

export default {
  asyncData ({ app, store }) {
    return controller.GET(app, store._vm.loggedUser.id)
      .then(({ user }) => {
        return controllerPosts.GETPostEmprendedor(app, user.emprendedor.IDEN_EMPRENDEDOR)
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
  computed: mapGetters([
    'loggedUser'
  ]),
  head () {
    return {
      title: 'Publicaciones'
    }
  }
}
</script>
