<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Categorías</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-4 py-2">
          <nuxt-link to="/administracion/categorias/nueva" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-lg-4 offset-md-3 col-md-6 offset-sm-3 py-1">
          <div class="input-group">
            <input class="form-control border border-right-0" name="search" v-model.trim="search" placeholder="Buscar Nombre de Categoría..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarCategoria()">
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
            <tbody class="text-center" :key="category.IDEN_CATEGORIA" v-for="category in paginatedData[pagination]">
              <!-- CATEGORÍAS -->
              <tr data-toggle="collapse" @click="selected = category.IDEN_CATEGORIA, open = !open">
                <td>
                  <icon class="fa-2x" :name="category.FLAG_VIGENTE ? 'check' : 'times'" v-bind:title="category.FLAG_VIGENTE ? 'Habilitado' : 'Deshabilitado'"></icon>
                </td>
                <td><icon v-if="category.subcategorias.length > 0" name="angle-down"></icon> <b> {{category.NOMB_CATEGORIA}}</b></td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/categorias/editar/'+category.IDEN_CATEGORIA }">
                    <button class="btn btn-tabla" title="Editar">Editar</button>
                  </nuxt-link>
                  <a class="btn" @click="setState(category)">
                  <button class="btn btn-tabla" v-if="!category.FLAG_VIGENTE">Habilitar</button>
                  <button class="btn btn-tabla" v-if="category.FLAG_VIGENTE">Deshabilitar</button>
                  </a>
                </td>
              </tr>
              <!-- SUBCATEGORÍAS -->
              <tr :id="category.IDEN_CATEGORIA" v-if="category.IDEN_CATEGORIA == selected && open" v-for="subcategory in category.subcategorias" :key="subcategory.IDEN_CATEGORIA">
                <td>
                  <icon :name="subcategory.FLAG_VIGENTE ? 'check' : 'times'" :title="subcategory.FLAG_VIGENTE ? 'Habilitado' : 'Deshabilitado'"></icon>
                </td>
                <td>{{subcategory.NOMB_CATEGORIA}}</td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/categorias/editar/'+subcategory.IDEN_CATEGORIA }">
                    <button class="btn btn-tabla" title="Editar">Editar</button>
                  </nuxt-link>
                   <a class="btn" @click="setState(subcategory)">
                  <button class="btn btn-tabla" v-if="!subcategory.FLAG_VIGENTE">Habilitar</button>
                  <button class="btn btn-tabla" v-if="subcategory.FLAG_VIGENTE">Deshabilitar</button>
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
import controller from '~/controllers/admin/categories'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ categories }) => {
        categories.sort(function (a, b) {
          return a.NOMB_CATEGORIA.localeCompare(b.NOMB_CATEGORIA, 'es', { numeric: true })
        })
        return custompaginator.paginate(categories)
          .then(({ paginatedData }) => {
            let pages = paginatedData.length
            return {
              categories,
              paginatedData,
              pages
            }
          })
      })
  },
  data () {
    this.$store.state.title = 'Categorias'
    return {
      open: false,
      selected: 'caret-down',
      categories: [],
      pagination: 0,
      pages: 0,
      paginatedData: [[]],
      search: '',
      cateAux: []
    }
  },
  methods: {
    setState (category) {
      controller.setState(this, category)
    },
    buscarCategoria () {
      // Copiar todas las catagorias, si existen, a una variable auxiliar para no perder la lista original
      if (this.cateAux.length === 0) {
        this.cateAux = this.paginatedData
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los nombres de categoria o parte de ellos posea el texto escrito en el buscador
        let cateSearch = this.categories.map(category => {
          if (category.NOMB_CATEGORIA.match(new RegExp(this.search, 'gi')) !== null) return category
        })

        // Limpia el listado actual y lo llena con otro que cumplan el criterio de busqueda
        let cateFound = []
        cateSearch.forEach(category => {
          if (category) cateFound.push(category)
        })

        // Ordena el listado obtenido en orden lexicografico.
        cateFound.sort(function (a, b) {
          return a.NOMB_CATEGORIA.localeCompare(b.NOMB_CATEGORIA)
        })
        // Se llama al paginador con la lista de objetos encontrados
        custompaginator.paginate(cateFound)
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
        this.paginatedData = this.cateAux
        this.pagination = 0
        this.pages = this.paginatedData.length
      }
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Categorías',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
