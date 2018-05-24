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
          <form class="input-group text-truncate">
            <input class="form-control" name="search" placeholder="Buscar" autocomplete="off" autofocus="autofocus" type="text">
            <div class="input-group-btn">
              <button class="btn btn-outline-success" type="submit"><icon name="search" :aria-hidden="true"></icon></button>
            </div>
          </form>
        </div>
      </div>
      <div class="row margin-top">
        <div class="col-xs-12 table-responsive">
          <table class="table table-responsive">
          <thead>
            <tr>
              <th></th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="post.IDEN_PUBLICACION" v-for="post in posts">
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
import controller from '~/controllers/posts'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  methods: {
    setState (post) {
      controller.setState(this, post)
    }
  },
  head () {
    return {
      title: 'Publicaciones'
    }
  }
}
</script>
