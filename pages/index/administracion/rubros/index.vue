<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Rubros</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link :to="{ path: '/administracion/rubros/nuevo' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar Nombre de Rubro..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarRubro()">
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
              <tr :key="workfield.IDEN_RUBRO" v-for="workfield in workfields">
                <td>
                  <icon :name="workfield.FLAG_VIGENTE ? 'check' : 'times'" :title="workfield.FLAG_VIGENTE ? 'Habilitado': 'Deshabilitado'"></icon>
                </td>
                <td>{{workfield.NOMB_RUBRO}}</td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/rubros/editar/'+ workfield.IDEN_RUBRO }" class="btn btn-secondary">
                    <button class="btn btn-tabla" title="Editar">Editar</button>
                  </nuxt-link>
                  <a class="btn" v-on:click="setState(workfield)">
                    <button class="btn btn-tabla" v-if="!workfield.FLAG_VIGENTE">Habilitar</button>
                    <button class="btn btn-tabla" v-if="workfield.FLAG_VIGENTE">Deshabilitar</button>
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
import controller from '~/controllers/admin/workfields'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  data () {
    return {
      workfields: [],
      search: '',
      postsAux: []
    }
  },
  methods: {
    setState (workfield) {
      controller.setState(this, workfield)
    },
    buscarRubro () {
      // Copiar todos los rubros, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.workfields
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los rubros en que el nombre o parte de ellos posea el texto escrito en el buscador
        let postAux = this.postsAux.map(workfield => {
          if (workfield.NOMB_RUBRO.match(new RegExp(this.search, 'gi')) !== null) return workfield
        })

        // Limpia los rubros actuales y lo llena con los rubros que cumplan el criterio de busqueda
        this.workfields = []
        postAux.forEach(workfield => {
          if (workfield) this.workfields.push(workfield)
        })

        // Ordena los Rubros en orden lexicografico.
        this.workfields.sort(function (a, b) {
          return a.NOMB_RUBRO.localeCompare(b.NOMB_RUBRO)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.workfields = this.postsAux
      }
    }
  },
  head () {
    return {
      title: 'Rubros'
    }
  }
}
</script>
