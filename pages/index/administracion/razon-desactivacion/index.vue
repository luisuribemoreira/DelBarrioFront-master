<template>

  <section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Razones de desactivación de cuenta</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link :to="{ path: '/administracion/razon-desactivacion/nuevo' }" class="btn btn-tabla"><i class="fa fa-plus"></i> Agregar</nuxt-link>
        </div>
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <form class="input-group text-truncate">
            <input class="form-control" name="search" placeholder="Buscar" autocomplete="off" autofocus="autofocus" type="text">
            <div class="input-group-btn">
              <button class="btn btn-outline-success" type="submit"><i class="fa fa-search" aria-hidden="true"></i></button>
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
          <tr :key="deactivationreason.IDEN_MOTIVO_DESHABILITACION" v-for="deactivationreason in deactivationreasons">
            <td>
              <i class="fa fa-check fa-2x" title="Habilitado" v-show='deactivationreason.FLAG_VIGENTE'></i>
              <i class="fa fa-times fa-2x" title="Deshabilitado" v-show='!deactivationreason.FLAG_VIGENTE'></i>
            </td>
            <td>{{deactivationreason.NOMB_MOTIVO_DESHABILITACION}}</td>
            <td>
              <a class="btn" v-bind:class="deactivationreason.FLAG_VIGENTE ? 'btn-danger' : 'btn-success'" v-on:click="setState(deactivationreason)" v-bind:title="deactivationreason.FLAG_VIGENTE ? 'Deshabilitar' : 'Habilitar'">
                <i class="fa" v-bind:class="deactivationreason.FLAG_VIGENTE ? 'fa-times' : 'fa-check'"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li>
                <a href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
              <li>
                <a href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
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
import controller from '~/controllers/admin/deactivationreasons'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  methods: {
    setState (deactivationreason) {
      controller.setState(this, deactivationreason)
    }
  },
  head () {
    return {
      title: 'Razones de desactivación de cuentas'
    }
  }
}
</script>
