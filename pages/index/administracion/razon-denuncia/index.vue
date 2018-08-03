<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Razones de Denuncia</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link :to="{ path: '/administracion/razon-denuncia/nuevo' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar Nombre de Razón de Denuncia..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarRazon()">
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
            <th>Nombre de Razón</th>
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
              <a class="btn" v-on:click="setState(denouncereason)">
                <button class="btn btn-tabla" v-if="!denouncereason.FLAG_VIGENTE">Habilitar</button>
                <button class="btn btn-tabla" v-if="denouncereason.FLAG_VIGENTE">Deshabilitar</button>
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
  data () {
    return {
      denouncereasons: [],
      search: '',
      postsAux: []
    }
  },
  methods: {
    setState (denouncereason) {
      controller.setState(this, denouncereason)
    },
    buscarRazon () {
      // Copiar todas las razones, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.denouncereasons
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todas las razones en que el nombre o parte de ellos posea el texto escrito en el buscador
        let postAux = this.postsAux.map(denouncereason => {
          if (denouncereason.NOMB_MOTIVO_DENUNCIA.match(new RegExp(this.search, 'gi')) !== null) return denouncereason
        })

        // Limpia el listado actual y lo llena con otro que cumplan el criterio de busqueda
        this.denouncereasons = []
        postAux.forEach(denouncereason => {
          if (denouncereason) this.denouncereasons.push(denouncereason)
        })

        // Ordena el listado obtenido en orden lexicografico.
        this.denouncereasons.sort(function (a, b) {
          return a.NOMB_MOTIVO_DENUNCIA.localeCompare(b.NOMB_MOTIVO_DENUNCIA)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.denouncereasons = this.postsAux
      }
    }
  },
  head () {
    return {
      title: 'Razones de denuncia'
    }
  }
}
</script>
