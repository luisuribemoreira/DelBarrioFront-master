<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Rubros</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-4 py-2">
          <nuxt-link :to="{ path: '/administracion/rubros/nuevo' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-lg-4 offset-md-3 col-md-6 offset-sm-3 py-1">
          <div class="input-group">
            <input class="form-control border border-right-0" name="search" v-model.trim="search" placeholder="Buscar Nombre de Rubro..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarRubro()">
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
                <th>Estado</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr :key="workfield.IDEN_RUBRO" v-for="workfield in paginatedData[pagination]">
                <td>
                  <icon :name="workfield.FLAG_VIGENTE ? 'check' : 'times'" :title="workfield.FLAG_VIGENTE ? 'Habilitado': 'Deshabilitado'"></icon>
                </td>
                <td>{{workfield.NOMB_RUBRO}}</td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/rubros/editar/'+ workfield.IDEN_RUBRO }">
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
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import controller from '~/controllers/admin/workfields'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ workfields }) => {
        workfields.sort(function (a, b) {
          return a.NOMB_RUBRO.localeCompare(b.NOMB_RUBRO, 'es', { numeric: true })
        })
        return custompaginator.paginate(workfields)
          .then(({ paginatedData }) => {
            let pages = paginatedData.length
            return {
              workfields,
              paginatedData,
              pages
            }
          })
      })
  },
  data () {
    this.$store.state.title = 'Rubros'
    return {
      workfields: [],
      pagination: 0, // Numero de la pagina
      pages: 0, // Conteo cantidad total de paginas
      paginatedData: [[]], // Datos paginados
      search: '',
      workfieldsAux: []
    }
  },
  methods: {
    setState (workfield) {
      controller.setState(this, workfield)
    },
    buscarRubro () {
      // Copiar todos los rubros, si existen, a una variable auxiliar para no perder la lista original
      if (this.workfieldsAux.length === 0) {
        this.workfieldsAux = this.paginatedData // Se copian los datos paginados, en este caso.
      }

      /*
      * Se utiliza el arreglo SIN paginacion para el algoritmo de busqueda.
      */
      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los rubros en que el nombre o parte de ellos posea el texto escrito en el buscador
        let workfieldSearch = this.workfields.map(workfield => {
          if (workfield.NOMB_RUBRO.match(new RegExp(this.search, 'gi')) !== null) return workfield
        })

        // Limpia los rubros actuales y lo llena con los rubros que cumplan el criterio de busqueda
        let workfieldsFound = []
        workfieldSearch.forEach(workfield => {
          if (workfield) workfieldsFound.push(workfield)
        })

        // Ordena los Rubros en orden lexicografico.
        workfieldsFound.sort(function (a, b) {
          return a.NOMB_RUBRO.localeCompare(b.NOMB_RUBRO)
        })

        // Se llama al paginador con la lista de objetos encontrados
        custompaginator.paginate(workfieldsFound)
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
        this.paginatedData = this.workfieldsAux
        this.pagination = 0 // Se devuelve a la pagina inicial de la lista
        this.pages = this.paginatedData.length // Se restaura la cantidad de paginas totales
      }
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Rubros'
    }
  }
}
</script>
