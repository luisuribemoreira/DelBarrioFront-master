<template>
<div>
  <section class="entrepreneur-top section">
    <div class="container">
      <div class="row">
        <div class="col">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item breadcrumb-item--home"><a href="/">Inicio</a></li>
              <li class="breadcrumb-item"><a href="/administracion/emprendedores">Emprendedores</a></li>
              <li class="breadcrumb-item active" aria-current="page">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</li>
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
                <img :src="entrepreneur.imagen.URL_IMAGEN ? imageUrl + entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid margin-img" alt="">
              </div>
              <div class="item carousel-item" data-slide-number="1">
                <img :src="entrepreneur.imagen.URL_IMAGEN ? imageUrl + entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid margin-img" alt="">
              </div>
              <div class="item carousel-item" data-slide-number="2">
                <img :src="entrepreneur.imagen.URL_IMAGEN ? imageUrl + entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid margin-img" alt="">
              </div>
              <div class="item carousel-item" data-slide-number="3">
                <img :src="entrepreneur.imagen.URL_IMAGEN ? imageUrl + entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid margin-img" alt="">
              </div>
            </div>

            <!-- main slider carousel nav controls -->
            <ul class="carousel-indicators list-inline mt-3">
              <li class="list-inline-item active">
                <a id="carousel-selector-0" class="selected" data-slide-to="0" data-target="#entrepreneur-info--carousel">
                <img :src="entrepreneur.imagen.URL_IMAGEN ? imageUrl + entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid margin-img" alt="">
                </a>
              </li>
              <li class="list-inline-item">
                <a id="carousel-selector-1" data-slide-to="1" data-target="#entrepreneur-info--carousel">
                <img :src="entrepreneur.imagen.URL_IMAGEN ? imageUrl + entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid margin-img" alt="">
                </a>
              </li>
              <li class="list-inline-item">
                <a id="carousel-selector-2" data-slide-to="2" data-target="#entrepreneur-info--carousel">
                <img :src="entrepreneur.imagen.URL_IMAGEN ? imageUrl + entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid margin-img" alt="">
                </a>
              </li>
              <li class="list-inline-item">
                <a id="carousel-selector-3" data-slide-to="3" data-target="#entrepreneur-info--carousel">
                <img :src="entrepreneur.imagen.URL_IMAGEN ? imageUrl + entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-fluid margin-img" alt="">
                </a>
              </li>
            </ul>
          </div>
          <div class="social-media mt-5 text-center">
            <a href="#" class="pl-2 pr-2"><i class="fab fa-facebook-square"></i></a>
            <a href="#" class="pl-2 pr-2"><i class="fab fa-twitter-square"></i></a>
          </div>
        </div>
        <!-- /col images -->
        
        <div class="col-md-7">
          <h2 class="entrepreneur-info--title h2">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</h2>
          <p class="entrepreneur-info--title"><i>{{entrepreneur.DESC_NOMBRE_EMPRESA}}</i></p>
          <div class="stars mt-3">
            <i class="fas fa-star text-warning"></i>
            <i class="fas fa-star text-warning"></i>
            <i class="fas fa-star text-warning"></i>
            <i class="far fa-star text-warning"></i>
            <i class="far fa-star text-warning"></i>
          </div>
          <p class="p mt-4 entrepreneur-info--text">{{entrepreneur.DESC_EMPRENDEDOR}}</p>
          
          <h5 class="entrepreneur-info--subtitle h5 mt-5">Datos de contacto</h5>
          <ul class="list-unstyled mt-3">
            <li class="mb-2">
              

              <!-- Aqui va el numero, no pude hacer el v-if -->

              <i class="fas fa-phone-square fa-lg text-turquoise mr-2"></i> +56 9 3456 7890</li>
              
              <p>Debes <nuxt-link to="/autenticar">iniciar sesión</nuxt-link> para ver los datos del emprendedor</p>
              <p>¿No tienes cuenta aún? <nuxt-link to="/registro">¡Regístrate!</nuxt-link></p>
              
        

            <li class="mb-2"><i class="fas fa-map-marked-alt fa-lg text-turquoise mr-2"></i> Av. Providencia 544, Providencia, Santiago.</li>
            <li class="mb-2"><i class="fas fa-envelope fa-lg text-turquoise mr-2"></i>{{entrepreneur.usuario.EMAIL_USUARIO}}</li>
          </ul>
        </div>
        <!-- /col info -->
      </div>
    </div>
  </section>
  <!-- EMPRENDEDOR -->
  
  <!-- MAPA -->
  <section class="entrepreneur-map">
    <div class="container-fluid">
      <div class="row">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.5792240152987!2d-70.62953658541339!3d-33.434212880778546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c58680ccc59f%3A0x35d790eaf21c17f2!2sAv.+Providencia+544%2C+Providencia%2C+Regi%C3%B3n+Metropolitana!5e0!3m2!1ses!2scl!4v1537015968767" width="100%" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>
      </div>
    </div>
  </section>
  <!-- /MAPA -->

  <!-- ########################################################################################## 
  
                    <div v-if="isAuthenticated">
                      <h5 v-if="entrepreneur.usuario.telefonos.length != 0">{{entrepreneur.usuario.telefonos.length == 1 ? 'Teléfono' : 'Teléfonos'}}</h5>
                      <ul class="list-unstyled" v-for="phone in entrepreneur.usuario.telefonos" :key="phone.IDEN_FONO">
                        <li><a :href="'tel:'+phone.NUMR_FONO">{{phone.NUMR_FONO}}</a></li>
                      </ul>
                      
                      <div v-if="entrepreneur.redes_sociales.length != 0">
                        <h5>Búscanos también en nuestras redes sociales</h5>
                        AQUÍ VAN LAS RRSS
                      </div>
                      
                      <h5>¿Tienes alguna duda? Envíanos un correo electrónico a <a :href="'mailto:'+entrepreneur.usuario.EMAIL_USUARIO">{{entrepreneur.usuario.EMAIL_USUARIO}}</a></h5>
                    </div>
                    <div v-else class="contorno">
                      <p>Debes <nuxt-link to="/autenticar">iniciar sesión</nuxt-link> para ver los datos del emprendedor</p>
                      <p>¿No tienes cuenta aún? <nuxt-link to="/registro">¡Regístrate!</nuxt-link></p>
                    </div>
                    
   ########################################################################################## -->

    
    
  <!-- ########################################################################################## 
    
    <section id="ubicacion">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 no-padding">
                    <h2 class="text-center">Ubicación</h2>
                    <gmap-map
                      :center="geocode ? geocode.geometry.location : { lat: -33.4488897, lng: -70.6692655 }"
                      :zoom="15"
                      style="width:100%; height:300px">
                      <gmap-marker
                      :position="geocode ? geocode.geometry.location : { lat: -33.4488897, lng: -70.6692655 }">
                      </gmap-marker>
                      <gmap-info-window v-if="geocode" :position="geocode ? geocode.geometry.location : { lat: -33.4488897, lng: -70.6692655 }">
                        {{ geocode.formatted_address }}
                      </gmap-info-window>
                    </gmap-map>
                </div>
            </div>
        </div>
    </section>
   ########################################################################################## -->
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
        // Si el emprendedor al que se intenta ingresar aun no ha completado su registro
        // se redirecciona al landing a todo aquel que no sea admin o super admin.
        if (!entrepreneur.usuario.FECH_CREACION && (!store._vm.isAuthenticated ||
        (store._vm.isAuthenticated && !(store._vm.isAuthenticated.rol === 103 || store._vm.isAuthenticated.rol === 104)))) {
          redirect('/')
        }
        let direccion
        try {
          direccion = entrepreneur.usuario.persona.contacto.Direccion[0].DESC_CONTACTO
        } catch (err) {
          // Nada
        }
        return locationController.GETLocation(app, direccion)
          .then(({ geocode }) => {
            return {
              entrepreneur: entrepreneur,
              geocode: geocode
            }
          })
      })
  },
  data () {
    return {
      geocode: undefined,
      imageUrl: process.env.imagesUrl,
      entrepreneur: []
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
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
