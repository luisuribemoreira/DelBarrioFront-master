<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center py-1">Ofertas sin revisar</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 offset-md-4 col-md-6 offset-sm-3 py-1">
          <div class="input-group">
            <input class="form-control border border-right-0" name="search" v-model.trim="search" placeholder="Buscar Título de Oferta..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarOfertas()">
            <span class="input-group-append">
            <button class="btn btn-outline-secondary border-left-0" type="submit">
              <i class="fa fa-search"></i>
            </button>
            </span>
          </div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-12 table-responsive">
          <table class="table">
          <thead>
            <tr class="text-center">
              <th>Título</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Precio Original</th>
              <th>Precio Oferta</th>
              <th>Fecha Inicio</th>
              <th>Fecha Término</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr v-for="oferta in paginatedData[pagination]" :key="oferta.IDEN_OFERTA">
              <td><nuxt-link :to="{ path: '/publicaciones/' + oferta.publicacion.IDEN_PUBLICACION }">{{oferta.publicacion.NOMB_PUBLICACION}}</nuxt-link></td>
              <td>{{oferta.publicacion.CODI_TIPO_PUBLICACION == 'P' ? 'Producto' : 'Servicio' }}</td>
              <td>{{oferta.publicacion.categoria.NOMB_CATEGORIA}}</td>
              <td>{{oferta.publicacion.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}}</td>
              <td>{{oferta.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}}</td>
              <td>{{oferta.FECH_INICIO}}</td>
              <td>{{oferta.FECH_TERMINO}}</td>
              <td>
                <a class="btn" @click="acceptOffer(oferta)" title="Aceptar"><button class="btn btn-tabla">Aceptar</button></a>
                <a class="btn" @click="banOffer(oferta)" title="Rechazar"><button class="btn btn-tabla">Rechazar</button></a>
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
import offerController from '~/controllers/offers'
import controller from '~/controllers/admin/postmoderation'
import moment from 'moment'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return offerController.GETAll(app)
      .then(ofertas => {
        let offers = []
        ofertas.offers.forEach((oferta, index) => {
          if (!oferta.FLAG_VALIDADO && !oferta.FLAG_BAN) {
            oferta.FECH_INICIO = moment(oferta.FECH_INICIO).format('DD-MM-YYYY')
            oferta.FECH_TERMINO = moment(oferta.FECH_TERMINO).format('DD-MM-YYYY')
            offers.push(oferta)
          }
        })
        return custompaginator.paginate(offers)
          .then(({ paginatedData }) => {
            let pages = paginatedData.length
            return {
              offers,
              paginatedData,
              pages
            }
          })
      })
  },
  data () {
    this.$store.state.title = 'ModerarOfertas'
    return {
      offers: [],
      search: '',
      offersAux: [],
      pagination: 0,
      pages: 0,
      paginatedData: [[]],
      processing: false
    }
  },
  methods: {
    async acceptOffer (oferta) {
      if (this.processing) return
      this.processing = true
      if (await controller.acceptOffer(this, oferta)) {
        this.offers = this.offers.filter(el => el.IDEN_OFERTA !== oferta.IDEN_OFERTA)
        this.paginatedData = (await custompaginator.paginate(this.offers)).paginatedData
        this.pages = this.paginatedData.length
        this.pagination = 0
      }
      this.processing = false
    },
    async banOffer (oferta) {
      if (this.processing) return
      this.processing = true

      if (await controller.banOffer(this, oferta)) {
        this.offers = this.offers.filter(el => el.IDEN_OFERTA !== oferta.IDEN_OFERTA)
        this.paginatedData = (await custompaginator.paginate(this.offers)).paginatedData
        this.pages = this.paginatedData.length
        this.pagination = 0
      }
      this.processing = false
    },
    buscarOfertas () {
      // Copiar todos los.oferta.offers, si existen, a una variable auxiliar para no perder la lista original
      if (this.offersAux.length === 0) {
        this.offersAux = this.paginatedData
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los offer en que el titulo o parte de el posea el texto escrito en el buscador
        let offerSearch = this.offers.map(offer => {
          if (offer.publicacion.NOMB_PUBLICACION.match(new RegExp(this.search, 'gi')) !== null) return offer
        })

        // Limpia los.oferta.offers actuales y lo llena con los.oferta.offers que cumplan el criterio de busqueda
        let offerFound = []
        offerSearch.forEach(offer => {
          if (offer) offerFound.push(offer)
        })

        // Ordena los.oferta.offers en orden lexicografico.
        offerFound.sort(function (a, b) {
          return a.publicacion.NOMB_PUBLICACION.localeCompare(b.publicacion.NOMB_PUBLICACION)
        })
        // Se llama al paginador con la lista de objetos encontrados
        custompaginator.paginate(offerFound)
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
        this.paginatedData = this.offersAux
        this.pagination = 0
        this.pages = this.paginatedData.length
      }
    }
  },
  filters: {
    dateFormat: function (date) {
      return moment(String(date)).format('DD/MM/YYYY HH:mm')
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Moderar ofertas'
    }
  }
}
</script>
