<template>
  <section id="admin-faq" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">FAQ</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-4 py-2">
          <nuxt-link :to="{ path: '/administracion/preguntas-frecuentes/nueva' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-lg-4 offset-md-3 col-md-6 offset-sm-3 py-1">
          <div class="input-group">
            <input class="form-control border border-right-0" name="search" v-model.trim="search" placeholder="Buscar Pregunta..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarPregunta()">
            <span class="input-group-append">
            <button class="btn btn-outline-secondary border-left-0" type="submit">
              <i class="fa fa-search"></i>
            </button>
            </span>
          </div>
        </div>
      </div>
      <div class="row margin-top">
        <div class="col-12 table-responsive">
          <table class="table">
            <thead>
              <tr class="text-center">
                <th>Pregunta</th>
                <th>Respuesta</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr :key="f.IDEN_FAQ" v-for="f in paginatedData[pagination]">
                <td>{{f.NOMB_FAQ}}</td>
                <td>{{f.DESC_FAQ}}</td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/preguntas-frecuentes/editar/'+f.IDEN_FAQ }">
                    <button class="btn btn-tabla" title="Editar">Editar</button>
                  </nuxt-link>
                  <a class="btn" @click="deleteFaq(f)">
                    <button class="btn btn-tabla" onClick="window.location.reload()">Eliminar</button>
                  </a>
                </td>
              </tr>
            </tbody>
          </table><!-- /tabla -->
             <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <!-- Solo permite retroceder si la pagina actual es mayor a 0 -->
                <span aria-label="Previous" v-on:click="pagination > 0 ? pagination-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <!-- Se crea la paginacion al pie de pagina. Se usa page - 1 ya que pagination debe apuntar a los indices del arreglo, por lo que parte de 0 -->
              <li class="page-item" v-bind:key="page" v-for="page in pages">
                <!-- Si la pagina actual es igual a la clickeada, esta se ennegrece -->
                <span class="page-link" v-bind:class="{ 'font-weight-bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <!-- Solo permite avanzar si la pagina actual es inferior a la cantidad de paginas totales - 1 -->
                <span aria-label="Next" v-on:click="pagination < paginatedData.length - 1 ? pagination++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
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
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ faqs }) => {
        return custompaginator.paginate(faqs)
          .then(({ paginatedData }) => {
            let pages = paginatedData.length
            return {
              faqs,
              paginatedData,
              pages
            }
          })
      })
  },
  data () {
    return {
      faqs: [],
      pagination: 0,
      pages: 0,
      paginatedData: [[]],
      search: '',
      faqAux: [],
      processing: false
    }
  },
  methods: {
    deleteFaq: async function (f) {
      if (this.processing) return
      this.processing = true
      await controller.DELETE(f, this)
      this.processing = false
    },
    buscarPregunta () {
      // Copiar todas las faqs, si existen, a una variable auxiliar para no perder la lista original
      if (this.faqAux.length === 0) {
        this.faqAux = this.paginatedData
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todas las razones en que el nombre o parte de ellos posea el texto escrito en el buscador
        let faqSearch = this.faqs.map(f => {
          if (f.NOMB_FAQ.match(new RegExp(this.search, 'gi')) !== null) return f
        })

        // Limpia el listado actual y lo llena con otro que cumplan el criterio de busqueda
        let faqFound = []
        faqSearch.forEach(f => {
          if (f) faqFound.push(f)
        })

        // Ordena el listado obtenido en orden lexicografico.
        faqFound.sort(function (a, b) {
          return a.NOMB_FAQ.localeCompare(b.NOMB_FAQ)
        })
        // Se llama al paginador con la lista de objetos encontrados
        custompaginator.paginate(faqFound)
          .then(({ paginatedData }) => {
            // Se reemplaza la lista paginada actual por la que contiene solo los objetos de la busqueda
            this.paginatedData = paginatedData
            // La cantidad total de paginas se reemplaza por la cantidad de paginas
            // de la nueva lista de objetos encontrados por la busqueda
            this.pages = paginatedData.length
            this.pagination = 0 // Se envia a la pagina inicial en caso de que la busqueda contenga mas de 10 objetos
          })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.paginatedData = this.faqAux
        this.pagination = 0
        this.pages = this.paginatedData.length
      }
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Preguntas Frecuentes'
    }
  }
}
</script>
