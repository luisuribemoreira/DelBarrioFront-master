<template>
  <section class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2 class="text-center">Ofertas</h2>
          </div>
        </div>
          <div class="row"  v-if="ofertas.length > 0">
            <transition-group name="list" tag="div">
              <div class="col-lg-6 col-md-6" v-for="oferta in ofertas" :key="oferta.IDEN_OFERTA">
                <nuxt-link :to="{ path: '/publicaciones/'+oferta.IDEN_PUBLICACION }">
                  <img v-if="!oferta.publicacion.imagenes || oferta.publicacion.imagenes.length === 0" v-lazy="'/img/no-image.svg'" class="img-fluid" alt="">
                  <img v-else v-lazy="imageUrl + oferta.publicacion.imagenes[0].URL_IMAGEN" class="img-fluid" alt="">
                </nuxt-link>
                <h4 class="text-center">{{ oferta.publicacion.NOMB_PUBLICACION }}</h4>
                <p class="text-center">{{ oferta.publicacion.DESC_PUBLICACION.substring(0,20) }}...</p>
                <p class="text-center">Desde {{ oferta.FECH_INICIO }} Hasta {{ oferta.FECH_TERMINO }}</p>
                <h5 class="text-center">$ {{ oferta.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
              </div>
            </transition-group>
          </div>
          <div class="mr-auto my-auto" v-else>
            <h3 class="text-center"> No existen ofertas en este preciso momento</h3>
          </div>
      </div>
  </section>
</template>

<script>
import controller from '~/controllers/offers'
import moment from 'moment'

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
        return {
          ofertas: offers
        }
      })
  },
  data () {
    return {
      imageUrl: process.env.imagesUrl,
      ofertas: []
    }
  },
  head () {
    return {
      title: 'Ofertas'
    }
  }
}
</script>
