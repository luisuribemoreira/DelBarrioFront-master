<template>

  <section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Razones de Desactivación de Cuenta</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link :to="{ path: '/administracion/razon-desactivacion/nuevo' }" class="btn btn-tabla"><i class="fa fa-plus"></i> Agregar</nuxt-link>
        </div>
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar Nombre de Razón de Desactivación..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarRazonDes">
            <div class="input-group-btn">
             <icon name="search" :aria-hidden="true"></icon>
            </div>
          </div>
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
              <a class="btn" v-on:click="setState(deactivationreason)">
                <button class="btn btn-tabla" v-if="!deactivationreason.FLAG_VIGENTE">Habilitar</button>
                <button class="btn btn-tabla" v-if="deactivationreason.FLAG_VIGENTE">Deshabilitar</button>
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
  data () {
    return {
      deactivationreasons: [],
      search: '',
      postsAux: []
    }
  },
  methods: {
    setState (deactivationreason) {
      controller.setState(this, deactivationreason)
    },
    buscarRazonDes () {
      // Copiar todas las razones, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.deactivationreasons
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todas las razones en que el nombre o parte de ellos posea el texto escrito en el buscador
        let postAux = this.postsAux.map(deactivationreason => {
          if (deactivationreason.NOMB_MOTIVO_DESHABILITACION.match(new RegExp(this.search, 'gi')) !== null) return deactivationreason
        })

        // Limpia el listado actual y lo llena con otro que cumplan el criterio de busqueda
        this.deactivationreasons = []
        postAux.forEach(deactivationreason => {
          if (deactivationreason) this.deactivationreasons.push(deactivationreason)
        })

        // Ordena el listado obtenido en orden lexicografico.
        this.deactivationreasons.sort(function (a, b) {
          return a.NOMB_MOTIVO_DESHABILITACION.localeCompare(b.NOMB_MOTIVO_DESHABILITACION)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.deactivationreasons = this.postsAux
      }
    }
  },
  head () {
    return {
      title: 'Razones de desactivación de cuentas'
    }
  }
}
</script>
