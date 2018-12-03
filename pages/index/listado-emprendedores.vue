<template>
<section>
  <section class="entrepreneur-list-top section pt-0 pb-0">
		<div class="container-fluid">
			<div class="row"></div>
		</div>
	</section>
	<!-- /TOP -->
<section class="entrepreneur-list section">
    <div class="container">
      <div class="row">
        <div class="col">
          <h2 class="h2">Emprendedores</h2>
        </div>
      </div>
      <!--Buscador de emprendedores -->
      <div class="row mt-4">
        <div class="col">
          <div class="row">
             <div class="col-lg-8 offset-lg-2">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Buscar emprendedor..." autocomplete="off" autofocus="autofocus" v-model.trim="search" @keyup="buscarEmprendedor()">
                 <div class="input-group-append">
										<button class="btn btn-outline-secondary border-left-0" type="button" disabled="true"><i class="fas fa-search"></i></button>
									</div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <!--/Buscador de emprendedores-->

      <!--Tabla de emprendedores-->
      <div class="row mt-5">
        <div class="col-lg-3 col-sm-6 text-center" :key="entrepreneur.IDEN_EMPRENDEDOR" v-for="entrepreneur in paginatedData[pagination]">
                  <div class="card">
                  <nuxt-link class="card-img-link" :to="{ path: '/emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR }">
                    <img v-if="!entrepreneur.imagen || !entrepreneur.imagen.URL_IMAGEN" v-lazy="'/img/no-image.svg'" class="card-img-top">
                    <img v-else v-lazy="imageUrl + entrepreneur.imagen.URL_IMAGEN" class="card-img-top">
                  </nuxt-link>
                  <div class="card-body">
                    <h5 class="card-title">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</h5>
                    <p class="card-text">{{ entrepreneur.DESC_EMPRENDEDOR.length > 80 ? entrepreneur.DESC_EMPRENDEDOR.substring(0, 80) + '...' : entrepreneur.DESC_EMPRENDEDOR }}</p>
                  </div>
                </div>
            </div>
      </div>
      <!-- /TABLA EMPRENDEDORES -->
    <div class="row mt-5">
      <div class="col d-flex justify-content-center">
      <nav aria-label="Page navigation">
            <ul class="pagination">
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
</section>
</template>

<script>
import controller from '~/controllers/admin/entrepreneurs'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ entrepreneurs }) => {
        entrepreneurs = entrepreneurs.filter(el => el.usuario.FECH_CREACION && !el.usuario.FLAG_BAN)
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
        let regex = new RegExp(this.search, 'gi')
        let entreSearch = this.entrepreneurs.map(entrepreneur => {
          if (entrepreneur.DESC_NOMBRE_FANTASIA.match(regex) !== null) return entrepreneur
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
