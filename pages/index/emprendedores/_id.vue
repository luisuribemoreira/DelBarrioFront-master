<template>
<div>
  <section class="entrepreneur-top section">
    <div class="container">
      <div class="row">
        <div class="col">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item breadcrumb-item--home"><a href="/">Inicio</a></li>
              <li class="breadcrumb-item"><a href="/listado-emprendedores">Emprendedores</a></li>
              <li class="breadcrumb-item active" aria-current="page">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</li>
              <li class="ml-auto">
                <form @submit.prevent="btnVolver()">
                <button class="btn btn-round btn-round__turquoise text-white" type="submit"><i class="fas fa-hand-point-left"></i> Volver</button>
                </form>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </section>
  <!-- EMPRENDEDOR -->
  <section class="entrepreneur-info section">
    <div class="container">
      <div class="row">
        <div class="col-md-5">
          <div id="entrepreneur-info--carousel" class="carousel slide">
            <!-- main slider carousel items -->
            <div class="carousel-inner">
              <div class="active item carousel-item" data-slide-number="0">
                <img v-lazy="entrepreneur.imagen.URL_IMAGEN ? imageUrl + entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid margin-img" alt="">
              </div>
            </div>
          </div>
            <social-sharing
                      v-bind:title="entrepreneur.DESC_NOMBRE_FANTASIA + ' | Del Barrio - Providencia'"
                      description="Portal de emprendimientos en Providencia."
                      v-bind:quote="entrepreneur.DESC_NOMBRE_FANTASIA + ' - Portal de emprendimientos en Providencia.'"
                      hashtags="Vitrinapro,VitrinaProvidencia,providencia"
                      :url="ruta + 'emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR"
                      inline-template>
              <div class="social-media mt-5 text-center">
                <div class="container d-flex justify-content-center">
                <p>Compartir en</p>
                <network network="facebook"><a class="pl-2 pr-2" style="cursor:pointer;"><i class="fab fa-facebook-square" :scale="2" name="facebook-square" :aria-hidden="true"></i></a></network>
                <network network="twitter"><a class="pl-2 pr-2" style="cursor:pointer;"><i  class="fab fa-twitter-square" :scale="2" name="twitter-square" :aria-hidden="true"></i></a></network>
                </div>
            </div>
          </social-sharing>
        </div>
        <!-- /col images -->

        <div class="col-md-7">
          <h2 class="entrepreneur-info--title h2">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</h2>
          <p class="entrepreneur-info--title"><i>{{entrepreneur.DESC_NOMBRE_EMPRESA}}</i></p>
          <p class="p mt-4 entrepreneur-info--text">{{entrepreneur.DESC_EMPRENDEDOR}}</p>

          <h5 class="entrepreneur-info--subtitle h5 mt-5">Datos de contacto</h5>
          <div v-if="isAuthenticated">
            <ul class="list-unstyled mt-3">
              <li class="mb-2"><i class="fas fa-mobile-alt fa-lg text-turquoise mr-2"></i>{{contactos.celular}}</li>
              <li class="mb-2" v-if="contactos.telefono.length > 0"><i class="fas fa-phone-square fa-lg text-turquoise mr-2"></i>{{contactos.telefono}}</li>
              <li class="mb-2"><i class="fas fa-envelope fa-lg text-turquoise mr-2"></i>{{ contactos.correo }}</li>
              <li class="mb-2"><i class="fas fa-map-marked-alt fa-lg text-turquoise mr-2"></i>{{ contactos.direccion }}</li>
            </ul>
            <h5 class="entrepreneur-info--subtitle h5" v-if="rss.twitter || rss.instagram || rss.facebook || rss.web">Redes Sociales</h5>
            <ul class="list-unstyled mt-3">
              <li class="mb-2" v-if="rss.twitter"><i class="fab fa-twitter fa-lg text-turquoise mr-2"></i><a target="_blank" :href="'//' + rss.twitter">Twitter</a></li>
              <li class="mb-2" v-if="rss.instagram"><i class="fab fa-instagram fa-lg text-turquoise mr-2"></i><a target="_blank" :href="'//' + rss.instagram">Instagram</a></li>
              <li class="mb-2" v-if="rss.facebook"><i class="fab fa-facebook fa-lg text-turquoise mr-2"></i><a target="_blank" :href="'//' + rss.facebook">Facebook</a></li>
              <li class="mb-2" v-if="rss.web"><i class="fas fa-external-link-alt fa-lg text-turquoise mr-2"></i><a target="_blank" :href="'//' + rss.web">Página Web</a></li>
            </ul>
            <h5>¿Tienes alguna duda? Envíanos un correo electrónico a <a class="text-primary">{{contactos.correo}}</a></h5>
          </div>
          <div v-else>
            <p>Debes <nuxt-link to="/autenticar">iniciar sesión</nuxt-link> para ver los datos del emprendedor</p>
            <p>¿No tienes cuenta aún? <nuxt-link to="/registro">¡Regístrate!</nuxt-link></p>
          </div>
        </div>
        <!-- /col info -->
      </div>
    </div>
  </section>
  <!-- EMPRENDEDOR -->
  <section class="mb-5">

    <style>
    .blog .carousel-indicators {
      left: 0;
      top: auto;
      bottom: -40px;

    }

    /* The colour of the indicators */
    .blog .carousel-indicators li {
      background: #a3a3a3;
      border-radius: 50%;
      width: 8px;
      height: 8px;
    }

    .blog .carousel-indicators .active {
      background: #707070;
    }
    </style>
    <div class="container" v-if="posts[0].length > 0">
      <div class="row blog">
        <div class="col-md-12">
          <div id="blogCarousel" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#blogCarousel" :class="{ active: activePage === 0 ? page === 1 : page === (activePage + 1) }" v-for="page in pages + 1" :key="page - 1" :data-slide-to="page - 1" @click="activePage = page - 1"></li>
            </ol>
            <!-- Carousel items -->
            <div class="carousel-inner">
              <div class="carousel-item active">
                <div class="row">
                  <div class="col-md-3" v-for="post in posts[activePage]" :key="post.IDEN_PUBLICACION">
                    <nuxt-link :to="'/publicaciones/' + post.IDEN_PUBLICACION">
                      <img v-lazy="post.imagenes.length > 0 ? imageUrl + post.imagenes[0].URL_IMAGEN : '/img/no-image.svg'" alt="Image" style="max-width:100%;">
                    </nuxt-link>
                  </div>
                </div>
                <!--.row-->
              </div>
              <!--.item-->
            </div>
            <!--.carousel-inner-->
          </div>
          <!--.Carousel-->
        </div>
      </div>
    </div>
</section>

  <!-- MAPA -->
  <section id="ubicacion" class="entrepreneur-map">
      <div class="container-fluid">
          <div class="row" style="margin-right: 0px;margin-left: 0px;">
                  <gmap-map
                    :center="geocode ? geocode.geometry.location : { lat: -33.4488897, lng: -70.6692655 }"
                    :zoom="15"
                    style="width:100%; height:450px; border: 0;">
                    <gmap-marker
                    :position="geocode ? geocode.geometry.location : { lat: -33.4488897, lng: -70.6692655 }">
                    </gmap-marker>
                    <gmap-info-window v-if="geocode" :position="geocode ? geocode.geometry.location : { lat: -33.4488897, lng: -70.6692655 }">
                      {{ geocode.formatted_address }}
                    </gmap-info-window>
                  </gmap-map>
          </div>
      </div>
  </section>
  <!-- /MAPA -->
  </div>
</template>

<script>
import controller from '~/controllers/admin/entrepreneurs'
import locationController from '~/controllers/location'
import { mapGetters } from 'vuex'

export default {
  asyncData ({ app, params, redirect, store }) {
    return controller.GET(app, params.id)
      .then(emprendedor => {
        // Si el emprendedor al que se intenta ingresar no existe, se redirecciona al landing
        if (!emprendedor) redirect('/')
        let entrepreneur = emprendedor.entrepreneur
        if (entrepreneur.usuario.FLAG_BAN) redirect('/')
        // Si el emprendedor al que se intenta ingresar aun no ha completado su registro
        // se redirecciona al landing a todo aquel que no sea admin o super admin.
        if (!entrepreneur.usuario.FECH_CREACION && (!store._vm.isAuthenticated ||
        (store._vm.isAuthenticated && !(store._vm.isAuthenticated.rol === 103 || store._vm.isAuthenticated.rol === 104)))) {
          redirect('/')
        }
        // Datos de contácto
        let contactos = { telefono: '', celular: '', correo: '', direccion: '' }
        let rss = { twitter: false, facebook: false, instagram: false, web: false }
        try {
          contactos.direccion = entrepreneur.usuario.persona.contacto.Direccion[0].DESC_CONTACTO
        } catch (err) {
          // Nada...
        }

        try {
          // Telefono se inicializa distinto ya que este es opcional y puede no existir.
          contactos.telefono = entrepreneur.usuario.persona.contacto.Telefono
            ? entrepreneur.usuario.persona.contacto.Telefono[0].DESC_CONTACTO.substring(0, 2) + ' ' + entrepreneur.usuario.persona.contacto.Telefono[0].DESC_CONTACTO.substring(2) : ''
          contactos.celular = entrepreneur.usuario.persona.contacto.Celular[0].DESC_CONTACTO.substring(0, 1) + ' ' + entrepreneur.usuario.persona.contacto.Celular[0].DESC_CONTACTO.substring(1)
          contactos.correo = entrepreneur.usuario.persona.contacto.Correo[0].DESC_CONTACTO

          // Redes Sociales
          rss.twitter = entrepreneur.usuario.persona.contacto.Twitter ? entrepreneur.usuario.persona.contacto.Twitter[0].DESC_CONTACTO : false
          rss.facebook = entrepreneur.usuario.persona.contacto.Facebook ? entrepreneur.usuario.persona.contacto.Facebook[0].DESC_CONTACTO : false
          rss.instagram = entrepreneur.usuario.persona.contacto.Instagram ? entrepreneur.usuario.persona.contacto.Instagram[0].DESC_CONTACTO : false
          rss.web = entrepreneur.usuario.persona.contacto.Web ? entrepreneur.usuario.persona.contacto.Web[0].DESC_CONTACTO : false
        } catch (err) {
          // Nada...
        }

        // Se ordenan los posts en arreglos de a 4 para el carrusel.
        let posts = [[]]
        let pages = 0
        entrepreneur.publicaciones = entrepreneur.publicaciones.filter(el => !el.FLAG_BAN && el.FLAG_VIGENTE && el.FLAG_VALIDADO)
        entrepreneur.publicaciones.sort((a, b) => {
          if (new Date(a.FECH_CREACION) > new Date(b.FECH_CREACION)) return -1
          if (new Date(a.FECH_CREACION) < new Date(b.FECH_CREACION)) return 1
          return 0
        })
        entrepreneur.publicaciones.forEach((publicacion, index) => {
          posts[pages].push(publicacion)
          if ((index + 1) % 4 === 0 && entrepreneur.publicaciones[index + 1]) {
            pages++
            posts[pages] = []
          }
        })
        return locationController.GETLocation(app, contactos.direccion)
          .then(({ geocode }) => {
            return {
              entrepreneur: entrepreneur,
              geocode: geocode,
              contactos,
              rss,
              posts,
              pages
            }
          })
      })
  },
  data () {
    return {
      geocode: undefined,
      imageUrl: process.env.imagesUrl,
      entrepreneur: [],
      activePage: 0,
      pages: 0,
      posts: [[]],
      contactos: {},
      rss: {},
      ruta: process.env.sharesUrl
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  methods: {
    btnVolver () {
      window.history.back()
    }
  },
  head () {
    return {
      title: 'Perfil',
      meta: [
        { hid: 'description', name: 'description', content: this.entrepreneur.DESC_EMPRENDEDOR },
        { property: 'og:title', content: this.entrepreneur.NOMB_FANTASIA },
        { property: 'og:description', content: this.entrepreneur.DESC_EMPRENDEDOR },
        { property: 'og:image', content: this.entrepreneur.imagen.URL_IMAGEN }
      ]

    }
  }
}
</script>
