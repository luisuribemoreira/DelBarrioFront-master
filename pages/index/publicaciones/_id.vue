<template>
<div v-if="!post.FLAG_BAN">
  <section class="product-top section">
    <div class="container">
      <div class="row">
        <div class="col">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item breadcrumb-item--home"><a href="/">Inicio</a></li>
              <li class="breadcrumb-item"><a href="/listado-productos">Publicaciones</a></li>
              <li class="breadcrumb-item"><a :href="'/emprendedores/' + post.emprendedor.IDEN_EMPRENDEDOR">{{post.emprendedor.DESC_NOMBRE_FANTASIA}}</a></li>
              <li class="breadcrumb-item active" aria-current="page">{{post.NOMB_PUBLICACION}}</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </section>

<section id="el-producto" class="product-info section">
    <div class="container">
      <div class="row">
        <div class="col-md-5">
          <no-ssr>
          <carousel
                    :navigationEnabled="true"
                    :loop="true"
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
            <social-sharing
                      v-bind:title="post.NOMB_PUBLICACION + ' | Del Barrio - Providencia'"
                      description="Portal de emprendimientos en Providencia."
                      v-bind:quote="post.NOMB_PUBLICACION + ' - Portal de emprendimientos en Providencia.'"
                      hashtags="delbarrio,providencia"
                      :url="ruta + 'publicaciones/' + post.IDEN_PUBLICACION"
                      inline-template>
              <div class="social-media mt-5 text-center">
                <div class="container d-flex justify-content-center">

                <p>Compartir en</p>
                <network network="facebook"><a class="pl-2 pr-2" style="cursor:pointer;"><i class="fab fa-facebook-square" :scale="2" name="facebook-square" :aria-hidden="true"></i></a></network>
                <network network="twitter"><a class="pl-2 pr-2" style="cursor:pointer;"><i  class="fab fa-twitter-square" :scale="2" name="twitter-square" :aria-hidden="true"></i></a></network>
                </div>
            </div>
          </social-sharing>

        </div><!-- columna -->
        <div class="col-md-7">
          <h2 class="product-info--title h2">{{post.NOMB_PUBLICACION}}</h2>
           <div class="stars mt-3">
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
            <!--<p v-else><a href="#" data-toggle="modal" data-target="#modal"> ({{ post.calificaciones.length }} {{ post.calificaciones.length === 1 ? 'calificación' : 'calificaciones' }})</a></p>-->
          </div>
          <p class="mt-3"><i class="far fa-eye"></i> ({{post.NUMR_CONTADOR}})</p>
          <p><a v-if="isAuthenticated" href="#" v-scroll-to="'#listComentarios'">({{ post.comentarios.length }} {{ post.comentarios.length === 1 ? 'comentario' : 'comentarios' }})</a>
          <a v-else data-toggle="modal" data-target="#modal">({{ post.comentarios.length }} {{ post.comentarios.length === 1 ? 'comentario' : 'comentarios' }})</a><p>
          <h3 class="product-info--price h3 mt-5" v-if="post.oferta">Oferta!</h3>
          <h3 class="product-info--price h3" v-if="post.oferta">
            <small>
              <strike>${{ post.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</strike>
              Rebaja de un {{ rebaja }}%
            </small>
          </h3>
          <h3 class="product-info--price h3" v-if="post.oferta">
            ${{ post.oferta.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}
          </h3>
          <h3 class="product-info--price h3" v-else>
            ${{ post.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}
          </h3>
          <p class="p mt-4 product-info--text">{{post.DESC_PUBLICACION}}</p>
          <p class="btn btn-primary btn-primary__turquoise mt-4"><nuxt-link style="color: white" :to="'/emprendedores/' + post.emprendedor.IDEN_EMPRENDEDOR">Contactar al vendedor</nuxt-link></p>
          <div v-if="isAuthenticated && post.emprendedor.IDEN_USUARIO !== loggedUser.id">
          <p class="product-info--report mt-4"><a href="#" @click="type = 'pub', denItem = post.DESC_PUBLICACION" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'"><i class="fas fa-exclamation-circle"></i> Denunciar publicación</a></p>
          </div>
          <p v-if="!post.FLAG_VALIDADO" class="margin-top">Esta publicación ha sido aceptada automáticamente y no ha pasado por moderación</p>
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /El Producto -->

<!--Comentarios / Calificaciones -->
 <section class="product-comments section">
    <div class="container">
      <div id="interacciones" v-if="isAuthenticated">
      <div class="row">
        <div class="col">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" id="ratings-tab" data-toggle="tab" href="#ratings" role="tab" aria-controls="ratings" aria-selected="true">Calificaciones</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="comments-tab" data-toggle="tab" href="#comments" role="tab" aria-controls="comments" aria-selected="false">Comentarios</a>
            </li>
          </ul>
          <!-- TAB_CALIFICACIONES -->
          <div class="tab-content pt-5 pb-5">
            <div class="tab-pane active" id="ratings" role="tabpanel" aria-labelledby="ratings-tab">
              <div class="ratings-form" v-if="post.emprendedor.IDEN_USUARIO !== loggedUser.id">
                <h2><i class="far fa-thumbs-up text-turquoise"></i> Calificaciones</h2>
                <p class="mt-3">Ingresa tu calificación</p>
                <div class="stars mt-3">
                <no-ssr>
                  <star-rating
                  v-model="rating.NUMR_VALOR"
                  :increment="1"
                  :star-size="35"
                  data-vv-name="calificacion"
                  name="calificacion"
                  v-validate data-vv-rules="required">
                </star-rating>
              </no-ssr>
                </div>
                <form @submit.prevent="validateRating" class="mt-3">
                  <div class="form-group">
                    <textarea class="form-control"
                      name="comentario"
                      :rows="5"
                      v-model.trim="rating.DESC_CALIFICACION"
                      v-validate data-vv-rules="min:10|max:250"></textarea>
                  </div>
                  <small class="text-danger" v-show="messageRating">{{ messageRating }}</small><br/>
                  <small class="text-danger" v-show="errors.has('comentario')">{{ errors.first('comentario') }}<br /></small>
                  <button type="submit" class="btn btn-danger mt-2">Calificar</button>
                </form>
              </div>

              <div id="rating" v-if="post.calificaciones.length > 0" class="ratings-comments mt-5">
              <div class="col-12">
              <h3>Última calificación</h3>
              <div class="stars mt-2">
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
              <p class="mt-4">{{post.calificaciones[0].DESC_CALIFICACION}}</p>
              <p class="product-info--report mt-3"><a href="#" @click="type = 'cal', iden = post.calificaciones[0].IDEN_CALIFICACION, denItem = post.calificaciones[0].DESC_CALIFICACION" class="margin-top" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'"><i class="fas fa-exclamation-circle"></i>Denunciar calificación</a></p>
              <p class="text-center"><a data-toggle="modal" data-target="#modal" href="#">Ver más</a></p>
            </div>
            </div>
            </div><!-- /TAB_CALIFICACIONES -->

            <!--TAB_COMENTARIOS -->
            <div class="tab-pane" id="comments" role="tabpanel" aria-labelledby="comments-tab">
              <div class="comments-form" v-if="post.emprendedor.IDEN_USUARIO !== loggedUser.id">
                <h2><i class="far fa-comments text-turquoise"></i> Comentarios</h2>
                <p class="mt-3">Ingresa tu comentario</p>
                 <!--FORM DE COMENTAR-->
                <form class="mt-2" @submit.prevent="validateComment">
                  <div class="form-group">
                    <textarea class="form-control"
                              id="exampleFormControlTextarea1"
                              :rows="5"
                              v-validate data-vv-rules="required|min:10|max:250"
                              data-vv-as="comentario"
                              name="com"
                              v-model.trim="comment.DESC_COMENTARIO"></textarea>
                  </div>
                    <small class="text-danger" v-show="errors.has('com')">{{ errors.first('com') }}<br /></small>
                    <button type="submit" class="btn btn-danger mt-2">Comentar</button>
                </form>
                <!-- FIN FORM COMENTAR -->
              </div>
          <div id="listComentarios" class="ratings-comments mt-5" v-for="c in post.comentarios" :key="c.IDEN_COMENTARIO">
          <div v-if="c.IDEN_COMENTARIO && (c.FLAG_BAN || c.usuario.FLAG_BAN)" class="col-12">
            <p class="margin-top-20">
              <icon name="info-circle"> </icon>
              <span> Este comentario ha sido eliminado por no cumplir con los <a target="_blank" :href="terms">términos y condiciones</a> del sitio</span>
            </p>
          </div>
          <div v-else class="ratings-comments">
            <p class="mt-4">
              <small class="margin-left">{{c.FECH_CREACION | dateFormat}}</small>
              <br>
              <a class="mt-4">{{c.DESC_COMENTARIO}}</a>
            </p>
            <hr>
            <p v-if="c.respuesta.DESC_RESPUESTA" class="ratings-comments mt-5">
              <small class="margin-left">{{c.respuesta.FECH_CREACION | dateFormat}}</small>
              <br>
              <a class="mt-4">Respuesta: {{c.respuesta.DESC_RESPUESTA}}</a>
            </p>

            <!-- FORM RESPUESTA -->
            <div v-if="!c.respuesta.IDEN_RESPUESTA && post.emprendedor.IDEN_USUARIO === loggedUser.id">
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
                <small class="text-danger" v-if="message.error">{{ message.answer }}<br/></small>
                <small class="text-danger" v-if="errors.has('resp')">{{ errors.first('resp') }}<br /></small>
                <p><button type="submit" class="btn btn-default">Comentar</button></p>
              </form>
              </div>
            </div>
            <!-- FIN FORM RESPUESTA -->
            <p class="product-info--report mt-3" v-if="c.IDEN_COMENTARIO && !c.FLAG_BAN && !c.usuario.FLAG_BAN && c.IDEN_USUARIO !== loggedUser.id">
              <a href="#" @click="type = 'com', iden = c.IDEN_COMENTARIO, denItem = c.DESC_COMENTARIO" class="margin-top" data-toggle="modal" :data-target= "isAuthenticated ? '#denounceModal' : '#modal'"><i class="fas fa-exclamation-circle"></i>Denunciar comentario</a>
            </p>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
            <p>Debes <nuxt-link to="/autenticar">iniciar sesión</nuxt-link> para obtener más información</p>
            <p>¿No tienes cuenta aún? <nuxt-link to="/registro">¡Regístrate!</nuxt-link></p>
          </div>
    </div>
  </section>

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
              <small class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</small>
              <small class="text-danger" v-if="error.length">{{ error }}</small>
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
        if (post.emprendedor.usuario.FLAG_BAN || !post.FLAG_VIGENTE || !post.FLAG_VALIDADO) redirect('/')
        let contactos = {}
        let rebaja = 0
        if (post.oferta.length > 0) {
          let oferta
          post.oferta.forEach(o => {
            if (!o.FLAG_BAN && o.FLAG_VIGENTE && o.FLAG_VALIDADO) oferta = o
          })
          if (oferta) {
            post.oferta = oferta
            rebaja = Math.round(100 - (Number(oferta.NUMR_PRECIO) / Number(post.NUMR_PRECIO)) * 100)
          } else {
            post.oferta = undefined
          }
        } else {
          post.oferta = undefined
        }
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
            // Si el usuario viendo el post está autenticado...
            if (store._vm.isAuthenticated) {
              // Y además es el dueño del POST, se retorna todo menos las calificaciones.
              if (post.emprendedor.usuario.IDEN_USUARIO === store._vm.loggedUser.id) {
                return {
                  post: post,
                  denouncereasons: denouncereasons,
                  contactos,
                  rebaja
                }
              }
              // Si no es el dueño, entonces se retorna su calificacion.
              return ratingscontroller.GET(app)
                .then(({ calificaciones }) => {
                  let calificacionAux = {}
                  calificaciones.forEach(c => {
                    if (c.IDEN_USUARIO === store._vm.loggedUser.id && c.IDEN_PUBLICACION === post.IDEN_PUBLICACION) {
                      calificacionAux = c
                    }
                  })
                  return {
                    post: post,
                    denouncereasons: denouncereasons,
                    rating: calificacionAux,
                    contactos,
                    rebaja
                  }
                })
            } else {
              // Si no esta autenticado se retorna solo el post y los datos del emprendedor.
              return {
                post: post,
                contactos,
                rebaja
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
      message: { error: false, answer: '' },
      rebaja: 0,
      ruta: process.env.sharesUrl,
      messageRating: false
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
    validateRating () {
      if (this.processing) return
      this.processing = true
      this.messageRating = false
      this.$validator.validate('comentario').then(async (result) => {
        if (result) {
          if (this.rating.NUMR_VALOR != null) {
            if (this.rating.IDEN_CALIFICACION) {
              await ratingscontroller.PUT(this, this.rating.IDEN_CALIFICACION)
            } else {
              await ratingscontroller.POST(this)
            }
          } else {
            this.messageRating = 'Debe ingresar una puntuacion para calificar esta publicacion'
          }
        }
      })
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
      return moment(String(date)).format('DD/MM/YYYY')
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
