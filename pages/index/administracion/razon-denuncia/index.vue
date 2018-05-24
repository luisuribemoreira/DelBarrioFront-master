<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Razones de denuncia</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link :to="{ path: '/administracion/razon-denuncia/nuevo' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
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
            <th>Estado</th>
            <th>Nombre</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="denouncereason.IDEN_MOTIVO_DENUNCIA" v-for="denouncereason in denouncereasons">
            <td>
              <icon name="check" title="Habilitado" v-show='denouncereason.FLAG_VIGENTE'></icon>
              <icon name="times" title="Deshabilitado" v-show='!denouncereason.FLAG_VIGENTE'></icon>
            </td>
            <td>{{denouncereason.NOMB_MOTIVO_DENUNCIA}}</td>
            <td>
              <a class="btn" :class="denouncereason.FLAG_VIGENTE ? 'btn-danger' : 'btn-success'" v-on:click="setState(denouncereason)" :title="denouncereason.FLAG_VIGENTE ? 'Deshabilitar' : 'Habilitar'">
                <icon :name="denouncereason.FLAG_VIGENTE ? 'times' : 'check'"></icon>
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
import controller from '~/controllers/admin/denouncereasons'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  methods: {
    setState (denouncereason) {
      controller.setState(this, denouncereason)
    }
  },
  head () {
    return {
      title: 'Razones de denuncia'
    }
  }
}
</script>
