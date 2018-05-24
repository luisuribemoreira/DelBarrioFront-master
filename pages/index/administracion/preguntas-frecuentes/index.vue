<template>
  <section id="admin-faq" class="container-fluid">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">FAQ</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link :to="{ path: '/administracion/preguntas-frecuentes/nueva' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
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
          <table class="table table-hover table-condensed">
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Respuesta</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="f.IDEN_FAQ" v-for="f in faqs">
                <td>{{f.NOMB_FAQ}}</td>
                <td>{{f.DESC_FAQ}}</td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/preguntas-frecuentes/editar/'+f.IDEN_FAQ }" class="btn btn-secondary">
                    <icon name="pencil-square-o" title="Editar"></icon>
                  </nuxt-link>
                  <a class="btn btn-danger" @click="deleteFaq(f)">
                    <icon name="times" title="Deshabilitar"></icon>
                  </a>
                </td>
              </tr>
            </tbody>
          </table><!-- /tabla -->
                      
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
        <!-- /paginacion -->              
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import controller from '~/controllers/admin/faqs'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  methods: {
    deleteFaq: function (f) {
      controller.DELETE(f, this)
    }
  },
  head () {
    return {
      title: 'Preguntas Frecuentes'
    }
  }
}
</script>
