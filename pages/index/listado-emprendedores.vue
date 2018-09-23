<template>
<section class="container-fluid" id="admin-faq">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Emprendedores</h2>
        </div>
      </div>
      <!--Buscador de emprendedores -->
      <div class="row">
        <div class="col-lg-4 offset-md-4 col-md-6 offset-sm-3 margin-top py-1">
            <div class="input-group text-truncate">
                <input type="text" class="form-control border border-right-0" placeholder="Buscar emprendedor..." autocomplete="off" autofocus="autofocus" v-model.trim="search" @keyup="buscarEmprendedor()">
                 <div class="input-group-btn">
                  <icon name="search"></icon>
                </div>
            </div>
        </div>
      </div>
      <!--/Buscador de emprendedores-->
      <!--Tabla de emprendedores-->
      <div class="row">
        <div class="col-9 table-responsive">
          <table class="table">
            <thead>
              <tr class="text-center">
                <th>Imagen</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr :key="entrepreneur.IDEN_CATEGORIA" v-for="entrepreneur in paginatedData[pagination]" v-if="entrepreneur.usuario.FECH_CREACION && !entrepreneur.usuario.FLAG_BAN" >
                <td>
                  <nuxt-link :to="{ path: '/emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR }">
                    <img v-if="!entrepreneur.imagen || !entrepreneur.imagen.URL_IMAGEN" v-lazy="'/img/no-image.svg'" class="img-fluid" height="125" width="125">
                    <img v-else v-lazy="imageUrl + entrepreneur.imagen.URL_IMAGEN" class="img-fluid" height="125" width="125">
                  </nuxt-link>
                </td>
                <td>
                  <nuxt-link :to="{ path: '/emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR }">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</nuxt-link>
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
      <!--/Tabla de emprendedores-->
    </div>
  </section>
</template>

<script>
import controller from '~/controllers/admin/entrepreneurs'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ entrepreneurs }) => {
        return custompaginator.paginate(entrepreneurs)
          .then(({ paginatedData }) => {
            let pages = paginatedData.length
            return {
              entrepreneurs,
              paginatedData,
              pages
            }
          })
      })
  },
  data () {
    return {
      entrepreneurs: [],
      pagination: 0,
      pages: 0,
      paginatedData: [[]],
      search: '',
      postsAux: [],
      imageUrl: process.env.imagesUrl
    }
  },
  methods: {
    setState (entrepreneur) {
      controller.setState(this, entrepreneur)
    },
    buscarEmprendedor () {
      // Copiar todos los posts, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.paginatedData
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los emprendedores en que el nombre de fantasia del emprendedor o parte de el posea el texto escrito en el buscador
        let entreSearch = this.entrepreneurs.map(entrepreneur => {
          if (entrepreneur.DESC_NOMBRE_FANTASIA.match(new RegExp(this.search, 'gi')) !== null) return entrepreneur
        })

        // Limpia los emprendedores actuales y lo llena con los emprendedores que cumplan el criterio de busqueda
        let entreFound = []
        entreSearch.forEach(entrepreneur => {
          if (entrepreneur) entreFound.push(entrepreneur)
        })

        // Ordena los emprendedores en orden lexicografico.
        entreFound.sort(function (a, b) {
          return a.DESC_NOMBRE_FANTASIA.localeCompare(b.DESC_NOMBRE_FANTASIA)
        })
        // Se llama al paginador con la lista de objetos encontrados
        custompaginator.paginate(entreFound)
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
        this.paginatedData = this.postsAux
        this.pagination = 0
        this.pages = this.paginatedData.length
      }
    }
  },
  head () {
    return {
      title: 'Emprendedores'
    }
  }
}
</script>
