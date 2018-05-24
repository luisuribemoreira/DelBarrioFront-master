<template>
<div>
  <section id="el-emprendedor" class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-sm-12">
                    <h2>{{entrepreneur.DESC_NOMBRE_FANTASIA}}</h2>
                    <small><p>{{entrepreneur.DESC_NOMBRE_EMPRESA}}</p></small>
                    <p><small>{{entrepreneur.rubro.NOMB_RUBRO}}</small></p>
                    <p class="lead">{{entrepreneur.DESC_EMPRENDEDOR}}</p>
                    <h4>Datos de contacto</h4>
                    <!-- DATOS DEL EMPRENDEDOR -->
                    <div v-if="isAuthenticated">
                      <h5 v-if="entrepreneur.usuario.telefonos.length != 0">{{entrepreneur.usuario.telefonos.length == 1 ? 'Teléfono' : 'Teléfonos'}}</h5>
                      <ul class="list-unstyled" v-for="phone in entrepreneur.usuario.telefonos" :key="phone.IDEN_FONO">
                        <li><a :href="'tel:'+phone.NUMR_FONO">{{phone.NUMR_FONO}}</a></li>
                      </ul>
                      <!--
                      <div v-if="entrepreneur.redes_sociales.length != 0">
                        <h5>Búscanos también en nuestras redes sociales</h5>
                        AQUÍ VAN LAS RRSS
                      </div>
                      -->
                      <h5>¿Tienes alguna duda? Envíanos un correo electrónico a <a :href="'mailto:'+entrepreneur.usuario.EMAIL_USUARIO">{{entrepreneur.usuario.EMAIL_USUARIO}}</a></h5>
                    </div>
                    <div v-else class="contorno">
                      <p>Debes <nuxt-link to="/autenticar">iniciar sesión</nuxt-link> para ver los datos del emprendedor</p>
                      <p>¿No tienes cuenta aún? <nuxt-link to="/registro">¡Regístrate!</nuxt-link></p>
                    </div>
                    
                </div>
                <div class="col-md-6 col-sm-12 margin-top">
                   <img :src="entrepreneur.imagen.URL_IMAGEN ? entrepreneur.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-responsive margin-img" alt="">
                   <social-sharing
                      v-bind:title="entrepreneur.DESC_NOMBRE_FANTASIA + ' | Del Barrio - Providencia'"
                      description="Portal de emprendimientos en Providencia."
                      v-bind:quote="entrepreneur.DESC_NOMBRE_FANTASIA + ' - Portal de emprendimientos en Providencia.'"
                      hashtags="delbarrio,providencia"
                      inline-template>
                      <div class="redes-sociales" style="text-align: center">
                        <network network="facebook"><a style="cursor:pointer;"><icon :scale="2" name="facebook-square" :aria-hidden="true"></icon></a></network>
                        <network network="twitter"><a style="cursor:pointer;"><icon :scale="2" name="twitter-square" :aria-hidden="true"></icon></a></network>
                      </div>
                    </social-sharing>
                </div>
            </div>
        </div><!-- /container -->
    </section><!-- /El Emprendedor -->
    
    
    <section id="fila-productos" class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <h2>Publicaciones</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md-2 col-sm-6 margin-top-20">
                    <a href="el-producto.html"><img src="/img/producto.jpg" class="img-responsive" alt=""></a>
                </div>
                
                <div class="col-md-2 col-sm-6 margin-top-20">
                    <a href="el-producto.html"><img src="/img/producto.jpg" class="img-responsive" alt=""></a>
                </div>
                
                <div class="col-md-2 col-sm-6 margin-top-20">
                    <a href="el-producto.html"><img src="/img/producto.jpg" class="img-responsive" alt=""></a>
                </div>
                
                <div class="col-md-2 col-sm-6 margin-top-20">
                    <a href="el-producto.html"><img src="/img/producto.jpg" class="img-responsive" alt=""></a>
                </div>
                
                <div class="col-md-2 col-sm-6 margin-top-20">
                    <a href="el-producto.html"><img src="/img/producto.jpg" class="img-responsive" alt=""></a>
                </div>
                
                <div class="col-md-2 col-sm-6 margin-top-20">
                    <a href="el-producto.html"><img src="/img/producto.jpg" class="img-responsive" alt=""></a>
                </div>
            </div>
            
            <div class="row">
                <div class="col-xs-12 text-center">
                    <button type="button" class="btn btn-default"><a href="resultado-todo-productos.html">Ver todos los productos</a></button>
                </div>
            </div>
        </div><!-- /container -->
    </section><!-- /Fila de Productos -->
    
    
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
        </div><!-- /container -->
    </section><!-- /Ubicacion -->
  </div>
</template>

<script>
import controller from '~/controllers/admin/entrepreneurs'
import locationController from '~/controllers/location'
import { mapGetters } from 'vuex'

export default {
  asyncData ({ app, params }) {
    return controller.GET(app, params.id)
      .then(entrepreneur => {
        return locationController.GETLocation(app, 'infante 1415')
          .then(location => {
            return {
              entrepreneur: entrepreneur.entrepreneur
            }
          })
      })
  },
  data () {
    return {
      geocode: undefined
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  head () {
    return {
      title: 'Nuevo rubro',
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
