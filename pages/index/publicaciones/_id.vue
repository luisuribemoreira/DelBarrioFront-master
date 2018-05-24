<template>
<div>
  <section id="el-producto" class="container-fluid">
    <div class="container">
      <div class="row margin-top-sec">
        <div class="col-sm-6">
          <div id="carousel" class="carousel slide">
            <div class="carousel-inner">
              <div class="item active">
                <img :src="post.imagenes.length > 0 ? imageUrl + post.imagenes[0].URL_IMAGEN : '/img/no-image.svg'" class="img-responsive" alt="">
              </div>
              <div class="item" :key="img.IDEN_IMAGEN" v-for="img in post.imagenes">
                <img :src="'https://delbarrio.barrenechea.cl/' + img.URL_IMAGEN" class="img-responsive" alt="">
              </div>
            </div>
          </div><!--- Carrousel Grande -->
          <div class="clearfix">
            <div id="thumbcarousel" class="carousel slide" :data-interval="false">
              <div class="carousel-inner">
                <div class="item active" v-if="post.imagenes.length>1" >
                  <div data-target="#carousel" :data-slide-to="img.$index" class="thumb" v-bind:key="img.IDEN_IMAGEN" v-for="img in post.imagenes">
                      <img v-bind:src="imageUrl + img.URL_IMAGEN" class="img-responsive" alt="">
                  </div>                
                </div><!-- /item -->
              </div><!-- /carousel-inner -->
            </div> <!-- /thumbcarousel -->
          </div><!-- /clearfix -->
        </div><!-- columna -->
        <div class="col-sm-6">
          <h2>{{post.NOMB_PUBLICACION}}</h2>
          <div class="estrellas">
            <no-ssr>
              <star-rating 
                v-model="post.NUMR_CALIFICACION"
                :increment="0.1"
                :star-size="35"
                :inline="true"
                :read-only="true">
              </star-rating>
            </no-ssr>
            <p v-if="post.calificaciones.length < 5">Aún no hay suficientes calificaciones</p>
            <p v-else><a href="#" data-toggle="modal" data-target="#modal"> ({{ post.calificaciones.length }} {{ post.calificaciones.length === 1 ? 'calificación' : 'calificaciones' }})</a></p>
          </div>
          <p class="margin-top-20"><icon name="eye"></icon> ({{post.NUMR_CONTADOR}})</p>
          <a v-if="isAuthenticated" href="#" v-scroll-to="'#comentarios'">({{ post.comentarios.length }} {{ post.comentarios.length === 1 ? 'comentario' : 'comentarios' }})</a>
          <a v-else data-toggle="modal" data-target="#modal">({{ post.comentarios.length }} {{ post.comentarios.length === 1 ? 'comentario' : 'comentarios' }})</a>
          <h3>$ {{ post.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h3>
          <h4>Descripción</h4>                    
          <p class="info-prod">{{post.DESC_PUBLICACION}}</p>
          <hr>
          <!-- DATOS DEL EMPRENDEDOR -->
          <h4>Información del vendedor</h4>
          <div v-if="isAuthenticated">
            <p><label>{{post.emprendedor.DESC_NOMBRE_FANTASIA}}</label></p>
            <p>{{post.emprendedor.DESC_EMPRENDEDOR}}</p>
            <!-- Listado de números de contacto -->
            <p v-if="post.emprendedor.usuario.telefonos.length != 0">{{post.emprendedor.usuario.telefonos.length == 1 ? 'Teléfono' : 'Teléfonos'}}</p>
            <ul class="list-unstyled" v-for="phone in post.emprendedor.usuario.telefonos" :key="phone.IDEN_FONO">
              <li> <a :href="'tel:'+phone.NUMR_FONO">{{phone.NUMR_FONO}}</a></li>
            </ul>
            <p><small>{{post.emprendedor.rubro.NOMB_RUBRO}}</small></p>
            <p><nuxt-link :to="'/emprendedores/' + post.emprendedor.IDEN_EMPRENDEDOR">Ver más</nuxt-link></p>
          </div>
          <!-- Mensaje de no iniciado sesión-->
          <div v-else>
            <p>Debes <nuxt-link to="/autenticar">iniciar sesión</nuxt-link> para visualizar esta funcionalidad</p>
            <p>¿No tienes cuenta aún? <nuxt-link to="/registro">¡Regístrate!</nuxt-link></p>
          </div>
          <hr>
          <social-sharing
                      v-bind:title="post.NOMB_PUBLICACION + ' | Del Barrio - Providencia'"
                      description="Portal de emprendimientos en Providencia."
                      v-bind:quote="post.NOMB_PUBLICACION + ' - Portal de emprendimientos en Providencia.'"
                      hashtags="delbarrio,providencia"
                      inline-template>
              <div class="redes-sociales">
                <network network="facebook"><a style="cursor:pointer;"><icon :scale="2" name="facebook-square" :aria-hidden="true"></icon></a></network>
                <network network="twitter"><a style="cursor:pointer;"><icon :scale="2" name="twitter-square" :aria-hidden="true"></icon></a></network>
            </div>
          </social-sharing>
          <a href="#" @click="type = 'pub'" class="margin-top label label-danger" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'"><icon name="exclamation-circle"></icon><span style="vertical-align: super"> Denunciar</span></a>
          <p v-if="!post.FLAG_VALIDADO" class="margin-top">Esta publicación ha sido aceptada automáticamente y no ha pasado por moderación</p>
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /El Producto -->

  <div id="interacciones" v-if="isAuthenticated">
    <!-- CALIFICACIONES -->
    <section id="calificaciones" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <hr>
            <h2 class="margin-top">Calificaciones</h2>
            <p>Ingresa tu calificación</p>
            <no-ssr>
              <star-rating
                v-model="rating.NUMR_VALOR"
                :increment="1"
                :star-size="35"
                data-vv-name="value"
                name="value"
                v-validate data-vv-rules="required">
              </star-rating>
            </no-ssr>
            <form @submit.prevent="validateRating">
              <div class="form-group margin-top-20">
                <textarea class="form-control" 
                  :rows="3"
                  v-model="rating.DESC_CALIFICACION"
                  v-validate data-vv-rules="min:10|max:250"
                ></textarea>
              </div>
              <small class="text-danger" v-show="errors.has('value')">{{ errors.first('value') }}</small>

              <button type="submit" class="btn btn-default">Calificar</button>
            </form>
          </div>
        </div>
              
        <div id="rating" class="row margin-top" v-if="post.calificaciones.length > 0">
          <div class="col-xs-12 contorno">
            <h3>Última calificación</h3>
            <div class="estrellas">
              <no-ssr>
                <star-rating
                  v-model="post.calificaciones[0].NUMR_VALOR"
                  :increment="1"
                  :star-size="35"
                  :read-only="true">
                </star-rating>
              </no-ssr>
            </div>
            <small>{{post.calificaciones[0].FECH_CREACION | dateFormat}}</small>
            <p class="margin-top-20">{{post.calificaciones[0].DESC_CALIFICACION}}</p>
            <p><a href="#" @click="type = 'cal', iden = post.calificaciones[0].IDEN_CALIFICACION" class="margin-top" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'">Denunciar</a></p>
            <p class="text-center"><a data-toggle="modal" data-target="#modal" href="#">Ver más</a></p>
          </div>
        </div>
      </div><!-- /container -->
    </section><!-- /Calificaciones -->

    <!-- COMENTARIOS -->
    <section id="comentarios" name="comentarios" class="container-fluid">
      <div class="container">
        <div class="row">
          <hr>
          <h2 class="margin-top">Comentarios</h2>
          <p>Ingresa tu comentario</p>

          <!--FORM DE COMENTAR-->
          <form @submit.prevent="validateComment">
            <div class="form-group margin-top-20">
              <textarea 
                class="form-control"
                :rows="3"
                v-validate data-vv-rules="required|min:10|max:250"
                data-vv-as="comentario"
                name="com"
                v-model="comment.DESC_COMENTARIO">
              </textarea>
            </div>
            <small class="text-danger" v-show="errors.has('com')">{{ errors.first('com') }}</small>
            <p><button type="submit" class="btn btn-default">Comentar</button></p>
          </form>
          <!--FIN FORM DE COMENTAR-->

        </div>
        <div id="listComentarios" class="row margin-top" v-for="c in post.comentarios" :key="c.IDEN_COMENTARIO">
          <div v-if="c.FLAG_BAN" class="col-xs-12 contorno ban">
            <p class="margin-top-20">
              <icon name="info-circle"> </icon>
              <span> Este comentario ha sido eliminado por no cumplir con los <a>términos y condiciones</a> del sitio</span>
            </p>
          </div>
          <div v-else class="col-xs-12 contorno">
            <p class="margin-top-20">
              <icon name="comment"> </icon>
              <small class="margin-left"> {{c.FECH_CREACION | dateFormat}}</small>
              {{c.DESC_COMENTARIO}}
            </p>
            <p v-if="c.respuesta.DESC_RESPUESTA" class="margin-top-20">
              <icon name="comments-o"> </icon>
              <small> {{c.respuesta.FECH_CREACION | dateFormat}}</small>
              {{c.respuesta.DESC_RESPUESTA}}
            </p>
            <p>
              <a href="#" @click="type = 'com', iden = c.IDEN_COMENTARIO" class="margin-top" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'">Denunciar</a>
            </p>
          </div>
        </div>
      </div><!-- /container -->
    </section><!-- /Comentarios -->
  </div>

  <!-- Modals -->
  <section id="modals">
    <!-- Modal de calificacion -->
    <div class="modal fade" id="modal" v-if="isAuthenticated" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Calificaciones</h4>
          </div>
          <div class="modal-body">
            <div :key="rating.IDEN_CALIFICACION" v-for="rating in post.calificaciones">
              <no-ssr>
                <star-rating 
                  v-model="rating.NUMR_VALOR"
                  :increment="0.1"
                  :star-size="20"
                  :read-only="true">
                </star-rating>
              </no-ssr>
              <p><small>{{rating.FECH_CREACION | dateFormat}}</small></p>
              <p>{{rating.DESC_CALIFICACION}} </p>
              <hr>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Volver</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de denuncia -->
    <div class="modal fade" id="denounceModal" v-if="isAuthenticated" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Denunciar {{type == 'pub' ? 'publicación' : type == 'cal' ? 'calificación' : 'comentario'}}</h4>
          </div>
          <div class="modal-body">
            <form @submit.prevent="validateDenounce()">
              <h5>Selecciona tu motivo de denuncia</h5>
              <div class="form-group" :key="denouncereason.IDEN_MOTIVO_DENUNCIA" v-for="denouncereason in denouncereasons">
                <div class="radio">
                  <label>
                    <input type="radio" name="denounce" :value="denouncereason.IDEN_MOTIVO_DENUNCIA" v-model="denounce.IDEN_MOTIVO_DENUNCIA"> {{denouncereason.NOMB_MOTIVO_DENUNCIA}}
                  </label>
                </div>
              </div>
              <div class="form-group margin-top">
                <label for="denounceComment">Más detalles</label>
                <textarea 
                  class="form-control"
                  :rows="5"
                  v-validate data-vv-rules="required"
                  name="description"
                  v-model="denounce.DESC_DENUNCIA">
                </textarea>
                <span :class="denounce.DESC_DENUNCIA.length > 250 || denounce.DESC_DENUNCIA.length < 10 ? 'text-danger' : ''">{{denounce.DESC_DENUNCIA.length}} de 250 caracteres</span>
              </div>
              <small class="text-danger" v-show="errors.has('description')">{{ errors.first('description') }}</small>
              <small class="text-danger" v-show="error.length">{{ error }}</small>
              <div>
                <button type="submit" class="btn btn-default">Enviar</button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Volver</button>
          </div>
        </div>
      </div>
    </div>

    <!--Autenticar modal-->
    <div class="modal fade" id="modal" v-if="!isAuthenticated" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">¡No puedes ver este contenido!</h4>
          </div>
          <div class="modal-body">
            <p>Debes <nuxt-link to="/autenticar">iniciar sesión</nuxt-link> para visualizar esta funcionalidad</p>
            <p>¿No tienes cuenta aún? <nuxt-link to="/registro">¡Regístrate!</nuxt-link></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Volver</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

</template>

<script>
import controller from '~/controllers/posts'
import commentscontroller from '~/controllers/comments'
import ratingscontroller from '~/controllers/ratings'
import denouncereasonscontroller from '~/controllers/admin/denouncereasons'
import denouncecontroller from '~/controllers/admin/denounces'

import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  asyncData ({ app, params }) {
    return controller.GET(app, params.id)
      .then(post => {
        return denouncereasonscontroller.GETAll(app)
          .then(denouncereasons => {
            return {
              post: post.post,
              denouncereasons: denouncereasons.denouncereasons
            }
          })
      })
  },
  data () {
    return {
      comment: {},
      rating: {},
      type: '',
      denounce: { DESC_DENUNCIA: '' },
      iden: '',
      error: '',
      imageUrl: process.env.imagesUrl
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  methods: {
    validateComment () {
      this.$validator.validate('com').then((result) => {
        if (result) commentscontroller.POST(this)
      })
    },
    validateRating () {
      if (this.rating.NUMR_VALOR != null) {
        ratingscontroller.POST(this)
      } else {
        console.log('')
      }
    },
    validateDenounce () {
      this.$validator.validate('description').then((result) => {
        if (result) denouncecontroller.POST(this)
      })
    }
  },
  filters: {
    dateFormat: function (date) {
      return moment(String(date)).format('DD/MM/YYYY HH:mm')
    }
  },
  head () {
    return {
      title: this.post.NOMB_PUBLICACION,
      meta: [
        { hid: 'description', name: 'description', content: this.post.DESC_PUBLICACION },
        { property: 'og:title', content: this.post.NOMB_PUBLICACION },
        { property: 'og:description', content: this.post.DESC_PUBLICACION },
        { property: 'og:image', content: this.imageUrl + this.post.imagenes[0].URL_IMAGEN }
      ]
    }
  }
}
</script>
