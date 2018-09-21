<template>
<div v-if="!post.FLAG_BAN">
  <section id="el-producto" class="container-fluid">
    <div class="container">
      <div class="row margin-top-sec">
        <div class="col-xl-6">
          <no-ssr>
          <carousel 
                    :navigationEnabled="true"
                    :loop="false"
                    paginationActiveColor="#89dbee"
                    paginationColor="#b2ebd1"
                    :paginationSize="20"
                    easing="linear"
                    :speed="300"
                    :perPage="1"
                    :autoplay ="false"
                    :autoplayTimeout="5000"
                    :navigationClickTargetSize="0"
                    style="width: 100%;"
                    >
              <slide v-for="imagen in post.imagenes" :key="imagen.IDEN_IMAGEN">
                <img v-if="imagen.URL_IMAGEN" v-lazy="imageUrl + imagen.URL_IMAGEN" class="img-fluid" alt="">
                <img v-else v-lazy="'/img/no-image.svg'" class="img-fluid" alt="">
            </slide>
          </carousel><!--- Carrousel Grande -->
          </no-ssr>
        </div><!-- columna -->
        <div class="col-md-6">
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
            <p>Número(s) de Contácto</p>
            <ul class="list-unstyled">
              <li>Celular: {{ contactos.celular }}</li>
              <li v-if="contactos.telefono.length > 0">Teléfono: {{ contactos.telefono }}</li>
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
          <div v-if="isAuthenticated && post.emprendedor.IDEN_USUARIO !== loggedUser.id">
          <a href="#" @click="type = 'pub', denItem = post.DESC_PUBLICACION" class="margin-top label label-danger" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'"><icon name="exclamation-circle"></icon><span style="vertical-align: super"> Denunciar</span></a>
          </div>
          <p v-if="!post.FLAG_VALIDADO" class="margin-top">Esta publicación ha sido aceptada automáticamente y no ha pasado por moderación</p>
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /El Producto -->

  <div id="interacciones" v-if="isAuthenticated">
    <!-- CALIFICACIONES -->
    <section id="calificaciones" class="container-fluid">
        <div class="container">
          <div class="row" v-if="post.emprendedor.IDEN_USUARIO !== loggedUser.id">
            <div class="col-12">
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
                    v-model.trim="rating.DESC_CALIFICACION"
                    v-validate data-vv-rules="min:10|max:250"
                  ></textarea>
                </div>
                <small class="text-danger" v-show="errors.has('value')">{{ errors.first('value') }}</small>
                <button type="submit" class="btn btn-default">Calificar</button>
              </form>
            </div>
          </div>
          <div id="rating" class="row mt-5" v-if="post.calificaciones.length > 0">
            <div class="col-12">
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
              <p><a href="#" @click="type = 'cal', iden = post.calificaciones[0].IDEN_CALIFICACION, denItem = post.calificaciones[0].DESC_CALIFICACION" class="margin-top" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'">Denunciar</a></p>
              <p class="text-center"><a data-toggle="modal" data-target="#modal" href="#">Ver más</a></p>
            </div>
          </div>
        </div><!-- /container -->
      
    </section><!-- /Calificaciones -->

    <!-- COMENTARIOS -->
    <section id="comentarios" name="comentarios" class="container-fluid">
        <div class="container">  
        <div class="row" v-if="post.emprendedor.IDEN_USUARIO !== loggedUser.id">
          <div class="col-12">
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
                v-model.trim="comment.DESC_COMENTARIO">
              </textarea>
            </div>
            <small class="text-danger" v-show="errors.has('com')">{{ errors.first('com') }}</small>
            <p><button type="submit" class="btn btn-default">Comentar</button></p>
          </form>
          <!--FIN FORM DE COMENTAR-->
          </div> <!-- col -->
        </div><!-- row -->
        <!--  -->
        <div id="listComentarios" class="row mt-5" v-for="c in post.comentarios" :key="c.IDEN_COMENTARIO">
          <div v-if="c.FLAG_BAN || c.usuario.FLAG_BAN" class="col-12">
            <p class="margin-top-20">
              <icon name="info-circle"> </icon>
              <span> Este comentario ha sido eliminado por no cumplir con los <a target="_blank" :href="terms">términos y condiciones</a> del sitio</span>
            </p>
          </div>
          <div v-else class="col-12">
            <p class="margin-top-20">
              <icon name="comment"> </icon>
              <small class="margin-left"> {{c.FECH_CREACION | dateFormat}}</small>
              {{c.DESC_COMENTARIO}}
            </p>
            <p v-if="c.respuesta.DESC_RESPUESTA" class="mt-3 ml-3">
              <icon name="comments-o"> </icon>
              <small> {{c.respuesta.FECH_CREACION | dateFormat}}</small>
              {{c.respuesta.DESC_RESPUESTA}}
            </p>

            <!-- FORM RESPUESTA -->
            <div v-if="c.respuesta.DESC_RESPUESTA === undefined && post.emprendedor.IDEN_USUARIO === loggedUser.id">
              <p>
                <a href="#" @click.prevent @click="selected = c.IDEN_COMENTARIO" class="margin-top">Responder</a>
              </p>
              <form @submit.prevent="validateAnswer" v-if="selected === c.IDEN_COMENTARIO">
                <div class="form-group margin-top-20">
                  <textarea 
                    class="form-control"
                    :rows="3"
                    v-validate data-vv-rules="min:2|max:250"
                    data-vv-as="respuesta"
                    name="resp"
                    v-model.trim="answer.DESC_RESPUESTA">
                  </textarea>
                </div>
                <small class="text-danger" v-if="message.error">{{ message.answer }}</small> <br/>
                <small class="text-danger" v-show="errors.has('resp')">{{ errors.first('resp') }}</small>
                <p><button type="submit" class="btn btn-default">Comentar</button></p>
              </form>
              </div>
            </div>
            <!-- FIN FORM RESPUESTA -->
            <p>
              <a v-if="!c.FLAG_BAN && !c.usuario.FLAG_BAN && c.IDEN_USUARIO !== loggedUser.id" href="#" @click="type = 'com', iden = c.IDEN_COMENTARIO, denItem = c.DESC_COMENTARIO" class="margin-top" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'">Denunciar</a>
            </p>
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
            <div :key="rating.IDEN_CALIFICACION" v-for="rating in post.calificaciones" v-if="post.calificaciones.length > 0">
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
              <p><a href="#" @click="type = 'cal', iden = rating.IDEN_CALIFICACION, denItem = rating.DESC_CALIFICACION" class="margin-top" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'">Denunciar</a></p>
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
            <button ref="dismissModal" type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Denunciar {{type == 'pub' ? 'publicación' : type == 'cal' ? 'calificación' : 'comentario'}}</h4>
          </div>
          <div class="modal-body">
            <h5>Descripción {{type == 'pub' ? 'publicación' : type == 'cal' ? 'calificación' : 'comentario'}}</h5>
            <p>{{ denItem }}</p>
            <form @submit.prevent="validateDenounce()">
              <h5>Selecciona tu motivo de denuncia</h5>
              <div class="form-group" :key="denouncereason.IDEN_MOTIVO_DENUNCIA" v-for="denouncereason in denouncereasons" v-if="denouncereason.FLAG_VIGENTE">
                <div class="radio">
                  <label>
                    <input type="radio" name="denounce" :value="denouncereason.IDEN_MOTIVO_DENUNCIA" v-model.trim="denounce.IDEN_MOTIVO_DENUNCIA"> {{denouncereason.NOMB_MOTIVO_DENUNCIA}}
                  </label>
                </div>
              </div>
              <div v-if="denouncereasons.length === 0" class="form-group">
                <i>Aún no hay motivos de denuncia registrados.</i>
              </div>
              <div class="form-group margin-top">
                <label for="denounceComment">Más detalles</label>
                <textarea 
                  class="form-control"
                  :rows="5"
                  v-validate data-vv-rules="required|min:10|max:250"
                  name="description"
                  v-model.trim="denounce.DESC_DENUNCIA">
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
<div v-else style="text-align:center">
 Esta publicación ha sido baneada.
</div>

</template>

<script>
import controller from '~/controllers/posts'
import commentscontroller from '~/controllers/comments'
import answerscontroller from '~/controllers/answers'
import ratingscontroller from '~/controllers/ratings'
import denouncereasonscontroller from '~/controllers/admin/denouncereasons'
import denouncecontroller from '~/controllers/admin/denounces'

import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  asyncData ({ app, params, store, redirect }) {
    return controller.GET(app, params.id)
      .then(publicacion => {
        if (!publicacion) redirect('/')
        let post = publicacion.post
        if (post.emprendedor.usuario.FLAG_BAN) redirect('/')
        let contactos = {}
        // Filtro de calificaciones con usuarios baneados.
        let calificaciones = []
        post.calificaciones.forEach(calificacion => {
          if (!calificacion.FLAG_BAN && !calificacion.usuario.FLAG_BAN) calificaciones.push(calificacion)
        })
        post.calificaciones = calificaciones
        if (post.calificaciones.length < 5) post.NUMR_CALIFICACION = 0
        // Asignacion de contactos de forma segura
        try {
          // Telefono se inicializa distinto ya que este es opcional y puede no existir.
          contactos.telefono = post.emprendedor.usuario.persona.contacto.Telefono
            ? post.emprendedor.usuario.persona.contacto.Telefono[0].DESC_CONTACTO.substring(0, 1) + ' ' + post.emprendedor.usuario.persona.contacto.Telefono[0].DESC_CONTACTO.substring(1) : ''
          contactos.celular = post.emprendedor.usuario.persona.contacto.Celular[0].DESC_CONTACTO.substring(0, 1) + ' ' + post.emprendedor.usuario.persona.contacto.Celular[0].DESC_CONTACTO.substring(1)
          contactos.correo = post.emprendedor.usuario.persona.contacto.Correo[0].DESC_CONTACTO
        } catch (err) {
          // Nada...
        }
        return denouncereasonscontroller.GETAll(app)
          .then(({ denouncereasons }) => {
            let calificaciones = []
            post.calificaciones.forEach(c => {
              if (!c.FLAG_BAN) calificaciones.push(c)
            })
            post.calificaciones = calificaciones
            if (store._vm.isAuthenticated) {
              if (post.emprendedor.usuario.IDEN_USUARIO === store._vm.loggedUser.id) {
                return {
                  post: post,
                  denouncereasons: denouncereasons,
                  contactos
                }
              }
              return ratingscontroller.GET(app)
                .then(({ calificaciones }) => {
                  let calificacionAux = {}
                  calificaciones.forEach(c => {
                    if (c.IDEN_USUARIO === store._vm.loggedUser.id) {
                      calificacionAux = c
                    }
                  })
                  return {
                    post: post,
                    denouncereasons: denouncereasons,
                    rating: calificacionAux,
                    contactos
                  }
                })
            } else {
              return {
                post: post,
                contactos
              }
            }
          })
      })
  },
  data () {
    return {
      comment: {},
      answer: {},
      selected: '',
      rating: {},
      type: '',
      denounce: { DESC_DENUNCIA: '' },
      iden: '',
      error: '',
      imageUrl: process.env.imagesUrl,
      post: [],
      terms: process.env.termsUrl,
      contactos: {},
      denItem: {},
      processing: false,
      message: { error: false, answer: '' }
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  methods: {
    validateComment () {
      if (this.processing) return
      this.processing = true
      this.$validator.validate('com').then(async (result) => {
        if (result) {
          await commentscontroller.POST(this)
        }
        this.processing = false
      })
    },
    validateAnswer () {
      if (this.processing) return
      this.processing = true
      this.$validator.validate('resp').then(async (result) => {
        if (result) {
          await answerscontroller.POST(this)
        }
        this.processing = false
      })
    },
    async validateRating () {
      if (this.processing) return
      this.processing = true
      if (this.rating.NUMR_VALOR != null) {
        if (this.rating.IDEN_CALIFICACION) {
          await ratingscontroller.PUT(this, this.rating.IDEN_CALIFICACION)
        } else {
          await ratingscontroller.POST(this)
        }
      }
      this.processing = false
    },
    validateDenounce () {
      if (this.processing) return
      this.processing = true
      this.$validator.validate('description').then(async (result) => {
        if (result) {
          await denouncecontroller.POST(this)
          this.denounce = { DESC_DENUNCIA: '' }
          this.$refs.dismissModal.click()
        }
        this.processing = false
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
        { property: 'og:image', content: this.imageUrl + this.post.imagenes.length > 0 ? this.post.imagenes[0].URL_IMAGEN : '/img/no-image.svg' }
      ]
    }
  }
}
</script>
