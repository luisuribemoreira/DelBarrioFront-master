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
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar Pregunta..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarPregunta()">
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
                    <button class="btn btn-tabla" title="Editar">Editar</button>
                  </nuxt-link>
                </td>
                  <td>
                  <a @click="deleteFaq(f)">
                    <button class="btn btn-tabla">Eliminar</button>
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
  data () {
    return {
      faqs: [],
      search: '',
      postsAux: []
    }
  },
  methods: {
    deleteFaq: function (f) {
      controller.DELETE(f, this)
    },
    buscarPregunta () {
      // Copiar todas las faqs, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.faqs
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todas las razones en que el nombre o parte de ellos posea el texto escrito en el buscador
        let postAux = this.postsAux.map(f => {
          if (f.NOMB_FAQ.match(new RegExp(this.search, 'gi')) !== null) return f
        })

        // Limpia el listado actual y lo llena con otro que cumplan el criterio de busqueda
        this.faqs = []
        postAux.forEach(f => {
          if (f) this.faqs.push(f)
        })

        // Ordena el listado obtenido en orden lexicografico.
        this.faqs.sort(function (a, b) {
          return a.NOMB_FAQ.localeCompare(b.NOMB_FAQ)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.faqs = this.postsAux
      }
    }
  },
  head () {
    return {
      title: 'Preguntas Frecuentes'
    }
  }
}
</script>
