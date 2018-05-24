<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Publicaciones sin revisar</h2>
        </div>
      </div>
      <div class="row">
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
              <th>Título</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Fecha creación</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="post.IDEN_PUBLICACION" v-for="post in posts" v-if="!post.FLAG_VALIDADO && !post.FLAG_BAN">
              <td>{{post.NOMB_PUBLICACION}}</td>
              <td>{{post.CODI_TIPO_PUBLICACION == 'P' ? 'Producto' : 'Servicio' }}</td>
              <td>{{post.categoria.NOMB_CATEGORIA}}</td>
              <td>{{post.FECH_CREACION | dateFormat}}</td>
              <td>
                <a class="btn btn-success" @click="acceptPost(post)" title="Aceptar"><icon name="check"></icon></a>
                <a class="btn btn-danger" @click="ban(post)" title="Rechazar"><icon name="times"></icon></a>
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
  methods: {
    acceptPost (post) {
      controller.acceptPost(this, post)
    },
    ban (post) {
      controller.ban(this, post)
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
