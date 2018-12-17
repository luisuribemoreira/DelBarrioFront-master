<template>
<section>
    <section class="publication-top section pt-0 pb-0">
		  <div class="container-fluid">
			  <div class="row">
				  <img src="img/img-soyprovidencia/home-slider-2.jpg" class="img-fluid" alt="Top">
			  </div>
	  	</div>
  	</section>
     <section class="publication-products section">
      <div class="container">
         <h2 class="h2">Ofertas</h2>
          <div class="row mt-5"  v-if="paginatedData[pagination].length > 0">
              <div class="col-lg-3 col-sm-6 text-center" v-for="oferta in paginatedData[pagination]" :key="oferta.IDEN_OFERTA">
                <div class="card">
                <nuxt-link class="card-img-link" :to="{ path: '/publicaciones/'+oferta.IDEN_PUBLICACION }">
                  <img v-if="!oferta.publicacion.imagenes || oferta.publicacion.imagenes.length === 0" v-lazy="'/img/no-image.svg'" class="card-img-top" alt="">
                  <img v-else v-lazy="imageUrl + oferta.publicacion.imagenes[0].URL_IMAGEN" class="card-img-top" alt="">
                </nuxt-link>
                <div class="card-body">
                <h4 class="card-title">{{ oferta.publicacion.NOMB_PUBLICACION }}</h4>
                <p class="text-center">{{ oferta.publicacion.DESC_PUBLICACION.substring(0,15) }}...</p>
                <p class="text-center">Desde: {{ oferta.FECH_INICIO }} <br> Hasta: {{ oferta.FECH_TERMINO }}</p>
                <h5 class="card-price">$ {{ oferta.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
                <p class="card-link">
                 <nuxt-link :to="{ path: '/publicaciones/'+oferta.publicacion.IDEN_PUBLICACION }">Ver oferta</nuxt-link>
                </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mr-auto my-auto" v-else>
            <h3 class="text-center"> No existen ofertas en este momento, <br>pero te invitamos a revisar el listado de Productos <br>
            <a class="text-primary" href="/listado-productos">aquí</a></h3>
          </div>
          <!-- PAGINACION -->
            <nav aria-label="Page navigation" v-if="paginatedData[pagination].length > 0">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <span aria-label="Previous" v-on:click="pagination > 0 ? pagination-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <li class="page-item" v-bind:key="page" v-for="page in pages">
                <span class="page-link" v-bind:class="{ 'font-weight-bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <span aria-label="Next" v-on:click="pagination < paginatedData.length - 1 ? pagination++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav> <!-- /PAGINACION -->
      </div>
      </section>
  </section>
</template>

<script>
import controller from '~/controllers/offers'
import moment from 'moment'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(ofertas => {
        let offers = []
        ofertas.offers.forEach((oferta, index) => {
          if (oferta.FLAG_VALIDADO && oferta.FLAG_VIGENTE && !oferta.FLAG_BAN && oferta.publicacion.FLAG_VIGENTE &&
                !oferta.publicacion.emprendedor.usuario.FLAG_BAN && oferta.publicacion.emprendedor.usuario.FECH_CREACION) {
            oferta.FECH_INICIO = moment(oferta.FECH_INICIO).format('DD-MM-YYYY')
            oferta.FECH_TERMINO = moment(oferta.FECH_TERMINO).format('DD-MM-YYYY')
            offers.push(oferta)
          }
        })
        offers.sort((a, b) => {
          if (new Date(a.FECH_CREACION) > new Date(b.FECH_CREACION)) return -1
          if (new Date(a.FECH_CREACION) < new Date(b.FECH_CREACION)) return 1
          return 0
        })
        return custompaginator.paginate(offers, 12)
          .then(({paginatedData}) => {
            let pages = paginatedData.length
            return {
              posts: offers,
              paginatedData,
              pages
            }
          })
      })
  },
  data () {
    return {
      imageUrl: process.env.imagesUrl,
      ofertas: [],
      pagination: 0,
      pages: 0,
      paginatedData: [[]],
      offers: []
    }
  },
  head () {
    return {
      title: 'Ofertas'
    }
  }
}
</script>
