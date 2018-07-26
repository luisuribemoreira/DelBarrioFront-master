<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Ofertas sin revisar</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar Título de Oferta..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarOfertas()">
            <div class="input-group-btn">
             <icon name="search" :aria-hidden="true"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="row margin-top">
        <div class="col-xs-12 table-responsive">
          <table class="table table-responsive">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Precio Antiguo</th>
              <th>Precio Oferta</th>
              <th>Fecha Inicio</th>
              <th>Fecha Término</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="oferta in oferta.offers" :key="oferta.IDEN_OFERTA" v-if="!oferta.FLAG_VALIDADO && !oferta.FLAG_BAN">
              <td><nuxt-link :to="{ path: '/publicaciones/' + oferta.publicacion.IDEN_PUBLICACION }">{{oferta.publicacion.NOMB_PUBLICACION}}</nuxt-link></td>
              <td>{{oferta.publicacion.CODI_TIPO_PUBLICACION == 'P' ? 'Producto' : 'Servicio' }}</td>
              <td>{{oferta.publicacion.categoria.NOMB_CATEGORIA}}</td>
              <td>{{oferta.publicacion.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}}</td>
              <td>{{oferta.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}}</td>
              <td>{{oferta.FECH_INICIO}}</td>
              <td>{{oferta.FECH_TERMINO}}</td>
              <td>
                <a class="btn btn-success" @click="acceptOffer(oferta)" title="Aceptar"><icon name="check"></icon></a>
                <a class="btn btn-danger" @click="banOffer(oferta)" title="Rechazar"><icon name="times"></icon></a>
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
import offerController from '~/controllers/offers'
import controller from '~/controllers/admin/postmoderation'
import moment from 'moment'

export default {
  asyncData ({ app }) {
    return offerController.GETAll(app)
      .then(ofertas => {
        ofertas.offers.forEach((oferta, key) => {
          ofertas.offers[key].FECH_INICIO = moment(oferta.FECH_INICIO).format('DD-MM-YYYY')
          ofertas.offers[key].FECH_TERMINO = moment(oferta.FECH_TERMINO).format('DD-MM-YYYY')
        })
        return {
          oferta: ofertas,
          imagen: ofertas ? ofertas.images : {}
        }
      })
  },
  data () {
    return {
      offers: [],
      search: '',
      offersAux: []
    }
  },
  methods: {
    acceptOffer (oferta) {
      controller.acceptOffer(this, oferta)
    },
    banOffer (oferta) {
      controller.banOffer(this, oferta)
    },
    buscarOfertas () {
      // Copiar todos los.oferta.offers, si existen, a una variable auxiliar para no perder la lista original
      if (this.offersAux.length === 0) {
        this.offersAux = this.oferta.offers
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los offer en que el titulo o parte de el posea el texto escrito en el buscador
        let offerAux = this.offersAux.map(offer => {
          if (offer.publicacion.NOMB_PUBLICACION.match(new RegExp(this.search, 'gi')) !== null) return offer
        })

        // Limpia los.oferta.offers actuales y lo llena con los.oferta.offers que cumplan el criterio de busqueda
        this.oferta.offers = []
        offerAux.forEach(offer => {
          if (offer) this.oferta.offers.push(offer)
        })

        // Ordena los.oferta.offers en orden lexicografico.
        this.oferta.offers.sort(function (a, b) {
          return a.publicacion.NOMB_PUBLICACION.localeCompare(b.publicacion.NOMB_PUBLICACION)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.oferta.offers = this.offersAux
      }
    }
  },
  filters: {
    dateFormat: function (date) {
      return moment(String(date)).format('DD/MM/YYYY HH:mm')
    }
  },
  head () {
    return {
      title: 'Moderar ofertas'
    }
  }
}
</script>
