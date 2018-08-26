<template>
  <section class="container-fluid">
    <div class="container">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h2 class="no-margin-top">Ofertas</h2>
          </div>
        </div>
        <div class="row margin-top">
          <div class="row">
            <transition-group name="list" tag="div">
              <div class="col-lg-3 col-md-3 col-6 post-item" v-for="oferta in oferta.offers" :key="oferta.IDEN_OFERTA" v-if="oferta.publicacion.FLAG_VIGENTE && !oferta.FLAG_BAN && oferta.FLAG_VIGENTE && oferta.publicacion.FLAG_VALIDADO">
                <nuxt-link :to="{ path: '/publicaciones/'+oferta.IDEN_PUBLICACION }">
                  <img v-if="!imagen[oferta.IDEN_PUBLICACION]" v-lazy="'/img/no-image.svg'" class="img-fluid" alt=""> 
                  <img v-else v-lazy="imageUrl + imagen[oferta.IDEN_PUBLICACION].URL_IMAGEN" class="img-fluid" alt="">
                </nuxt-link>
                <h4 class="text-center">{{ oferta.publicacion.NOMB_PUBLICACION }}</h4>
                <p class="text-center">{{ oferta.publicacion.DESC_PUBLICACION.substring(0,20) }}...</p>
                <p class="text-center">Desde {{ oferta.FECH_INICIO }} Hasta {{ oferta.FECH_TERMINO }}</p>
                <h5 class="text-center">$ {{ oferta.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
              </div>
            </transition-group>
          </div>
        </div>
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
      imageUrl: process.env.imagesUrl,
      oferta: this.oferta,
      imagen: this.imagen
    }
  },
  head () {
    return {
      title: 'Ofertas'
    }
  }
}
</script>
