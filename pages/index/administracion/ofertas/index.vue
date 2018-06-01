<template>
  <section class="container-fluid">
    <div class="container">
      <div class="container fondo-beige">
        <div class="row">
          <div class="col-sm-6">
            <h2 class="no-margin-top">Ofertas</h2>
          </div>
        </div>
        <div class="row margin-top">
          <div class="row">
            <transition-group name="list" tag="div" v-if="oferta">
              <div class="col-md-3 col-sm-3 col-xs-6 post-item" v-for="oferta in oferta.offers" :key="oferta.IDEN_OFERTA">
                <nuxt-link :to="{ path: '/publicaciones/'+oferta.IDEN_PUBLICACION }">
                  <img v-if="!imagen[oferta.IDEN_PUBLICACION]" v-lazy="'/img/no-image.svg'" class="img-responsive" alt=""> 
                  <img v-else v-lazy="imageUrl + imagen[oferta.IDEN_PUBLICACION].URL_IMAGEN" class="img-responsive" alt="">
                </nuxt-link>
                <h4 class="text-center">{{ oferta.publicacion.NOMB_PUBLICACION }}</h4>
                <p class="text-center">{{ oferta.publicacion.DESC_PUBLICACION.substring(0,20) }}</p>
                <p class="text-center">Duracion: {{ oferta.FECH_INICIO.substring(5,10) }} {{ oferta.FECH_INICIO.substring(11,16) }} - {{ oferta.FECH_TERMINO.substring(5,10) }} {{ oferta.FECH_INICIO.substring(11,16) }}</p>
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

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(ofertas => {
        return {
          oferta: ofertas,
          imagen: ofertas ? ofertas.images : undefined
        }
      })
  },
  data () {
    return {
      imageUrl: process.env.imagesUrl
    }
  },
  head () {
    return {
      title: 'Ofertas'
    }
  }
}
</script>
