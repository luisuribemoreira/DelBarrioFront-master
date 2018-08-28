<template>
  <section id="admin" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Mi cuenta</h2>
        </div>
      </div>
      <div class="row">
        <!-- EMPRENDEDOR - PREGUNTAS -->
        <div class="col-12" v-if="isAuthenticated && loggedUser.rol === 102">
          <h3><icon name="comments-o" :aria-hidden="true" :scale="2"></icon><span style="vertical-align: super"> Preguntas</span></h3>
          <hr>
          <p><span class="label label-default">{{ preguntas }}</span> <span style="vertical-align: sub"> Que aún no respondiste</span></p>
        </div>
        <!-- CLIENTE - RESPUESTAS -->
        <div class="col-12" v-if="isAuthenticated && loggedUser.rol === 101">
          <h3><icon name="comments-o" :aria-hidden="true" :scale="2"></icon><span style="vertical-align: super"> Respuestas</span></h3>
          <hr>
          <p><span class="label label-default">{{ respuestas }}</span> <span style="vertical-align: sub"> Te han respondido</span></p>
        </div>
      </div>
      <hr>
      <div v-if="isAuthenticated && loggedUser.rol === 102">
        <div class="row margin-top">
          <div class="col-12">
            <h3>Tus destacados</h3>
            <small class="text-muted"><nuxt-link to="/administracion/publicaciones">Ver todos</nuxt-link></small>
          </div>
        </div>
        <div class="row">
          <transition-group name="ListPosts" tag="div">
            <div class="col-lg-2 col-md-3 col-6 post-item" v-for="p in posts" :key="p.IDEN_PUBLICACION"  v-if="p.FLAG_VIGENTE && !p.FLAG_BAN">
              <nuxt-link :to="'/publicaciones/'+p.IDEN_PUBLICACION ">
                <img v-if="p.imagenes.length === 0" v-lazy="'/img/no-image.svg'" class="img-responsive" alt="">
                <img v-else v-lazy="imageUrl + p.imagenes[0].URL_IMAGEN" class="img-responsive" alt="">
              </nuxt-link>
              <h4 class="text-center">{{ p.NOMB_PUBLICACION }}</h4> 
              <p class="text-center">{{ p.DESC_PUBLICACION.substring(0,20) }}...</p>
              <h5 class="text-center">$ {{ p.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
              <p class="text-center"><icon name="eye"></icon> ({{p.NUMR_CONTADOR}})  |  <icon name="comments-o"></icon>({{ p.PREG_SIN_RESPONDER }})</p>
              <p class="text-center"></p>
            </div>
          </transition-group>
        </div>
        <hr class="margin-top">
      </div>
      <a class="btn btn-secondary" @click="selected = !selected">
        <icon name="wrench" :aria-hidden="true"></icon>
        <span> Configuración Cuenta</span>
      </a>
      <!-- CONFIGURACION DE CUENTA -->
      <div v-if="selected" class="margin-top">
        <div>
          <h2 class="text-center"><span>Datos de emprendedor</span></h2>
          <hr>
        </div>
        <div class="col-lg-6">
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Nombres</label><span style="color: red"> (Formato ej: Marcelo Díaz)</span>
              <input v-validate data-vv-rules="required" data-vv-as="nombre" name="name" type="text" v-model="user.persona.NOMBRES" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname">Apellido Paterno</label><span style="color: red"> (Formato ej: Pérez)</span>
              <input v-validate data-vv-rules="required" data-vv-as="apellido paterno" name="lastname" type="text" v-model="user.persona.APELLIDO_PATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname')">{{ errors.first('lastname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname2">Apellido Materno</label><span style="color: red"> (Formato ej: Gallardo)</span>
              <input v-validate data-vv-rules="required" data-vv-as="apellido materno" name="lastname2" type="text" v-model="user.persona.APELLIDO_MATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname2')">{{ errors.first('lastname2') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="date">Fecha de Nacimiento</label>
              <datepicker 
                language="es"
                :format='format'
                v-model="user.persona.FECH_FECHA_NACIMIENTO"
                :bootstrapStyling = "true"
                name="date"
              ></datepicker>
            </div>
            <div v-if="dataErrorMsg.error_edad">
              <small class="text-danger">{{ dataErrorMsg.error_edad }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass">Contraseña</label><span style="color: red"> (*No utilice palabras o números de conocimiento público)</span>
              <input v-validate data-vv-rules="min:6" data-vv-as="contraseña" name="pass" type="password" v-model="user.pass" class="form-control"/>
              <small class="text-danger" v-show="errors.has('pass')">{{ errors.first('pass') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass2">Confirmar Contraseña</label>
              <input type="password" data-vv-as="contraseña" name="pass2" v-model="user.pass2" class="form-control"/>
              <small class="text-danger" v-if="dataErrorMsg.error_pw">{{ dataErrorMsg.error_pw }}</small>
            </div>
            <div v-if="loggedUser.rol === 102">
              <div>
                <h2 class="text-center"><span>Datos de Empresa</span></h2>
                <hr>
              </div>
              <div class="row">
                <div class="margin-left col-md-6">
                  <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="3.6"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          v-bind:initial-image="imagen ? imageUrl + imagen.URL_IMAGEN : ''"
                          ></croppa>
                  </no-ssr>
                </div>
              </div>
              <div v-if="dataErrorMsg.error_foto">
                <small class="text-danger">{{ dataErrorMsg.error_foto }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Nombre de Fantasía</label><span style="color: red"> (Formato ej: Artesanías Doña Anita)</span>
                <input v-validate data-vv-rules="required" data-vv-as="nombre fantasia" name="nombre fantasia" type="text" v-model="user.emprendedor.DESC_NOMBRE_FANTASIA" class="form-control"/>
                <small class="text-danger" v-show="errors.has('nombre fantasia')">{{ errors.first('nombre fantasia') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Descripción</label><span style="color: red"> (*Breve resumen sobre el servicio o producto ofrecido)</span>
                <input v-validate data-vv-rules="required|min:30|max:255" data-vv-as="descripcion" name="descripcion" type="text" v-model="user.emprendedor.DESC_EMPRENDEDOR" class="form-control"/>
                <small class="text-danger" v-show="errors.has('descripcion')">{{ errors.first('descripcion') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Dirección Comercial</label><span style="color: red"> (*Domicilio que es usado para ser contactado por sus clientes)</span>
                <input v-validate data-vv-rules="required" data-vv-as="direccion" name="direccion" type="text" v-model="user.persona.contacto.Direccion[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('direccion')">{{ errors.first('direccion') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Teléfono (Optativo)</label><span style="color: red"> (Formato ej: 224213146)</span>
                <input v-validate data-vv-rules="min:9|max:9" data-vv-as="telefono" name="telefono" type="text" v-model="user.persona.contacto.Telefono[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('telefono')">{{ errors.first('telefono') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Celular</label><span style="color: red"> (Formato ej: 982275364)</span>
                <input v-validate data-vv-rules="required|min:9|max:9" data-vv-as="celular" name="celular" type="text" v-model="user.persona.contacto.Celular[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('celular')">{{ errors.first('celular') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Correo de Contácto</label><span style="color: red"> (Formato ej: contacto@emprendimiento.cl)</span>
                <input v-validate data-vv-rules="required|email" data-vv-as="correo" name="correo" type="text" v-model="user.persona.contacto.Correo[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('correo')">{{ errors.first('correo') }}</small>
              </div>
              <button type="submit" class="btn btn-default">Guardar</button>
            </div>
          </form>
        </div>
      </div>
      
    </div> <!-- /container -->
  </section>

</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/myaccount'
import controllerPosts from '~/controllers/posts'
import customValidations from '~/controllers/customvalidations'
import commentsController from '~/controllers/comments'
import controllerImages from '~/controllers/images'
import Datepicker from 'vuejs-datepicker'

export default {
  asyncData ({ app, store }) {
    return controller.GET(app, store._vm.loggedUser.id)
      .then(({ user }) => {
        if (store._vm.loggedUser.rol === 102) {
          return controllerPosts.GETPostEmprendedor(app, user.emprendedor.IDEN_EMPRENDEDOR)
            .then(async ({ posts }) => {
              let preguntas = 0
              let PREG_SIN_RESPONDER
              posts.forEach(post => {
                PREG_SIN_RESPONDER = 0
                if (post.comentarios.length > 0) {
                  post.comentarios.forEach(comentario => {
                    if (!comentario.respuesta.IDEN_RESPUESTA) {
                      preguntas++
                      PREG_SIN_RESPONDER++
                    }
                  })
                }
                post.PREG_SIN_RESPONDER = PREG_SIN_RESPONDER
              })
              // Ordena los posts por fecha de creacion. El más reciente aparece primero en la lista (izquierda a derecha en la vista)
              posts.sort(function (a, b) {
                if (a.FECH_CREACION > b.FECH_CREACION) return -1
                if (a.FECH_CREACION < b.FECH_CREACION) return 1
              })
              // Se inicializa el Telefono como objeto vacio en caso de que el usuario no tenga un telefono definido.
              // Se inicializan todos los campos para evitar errores.
              if (!user.persona.contacto.Telefono) user.persona.contacto.Telefono = [{}]
              if (!user.persona.contacto.Direccion) user.persona.contacto.Direccion = [{}]
              if (!user.persona.contacto.Celular) user.persona.contacto.Celular = [{}]
              if (!user.persona.contacto.Correo) user.persona.contacto.Correo = [{}]
              let imagen = await (await controllerImages.GETByEmprendedor(app, user.emprendedor.IDEN_EMPRENDEDOR)).image
              return {
                user: user,
                posts: posts,
                preguntas: preguntas,
                imagen: imagen
              }
            })
        } else {
          return commentsController.GETByUser(app, store._vm.loggedUser.id)
            .then(({ comentarios }) => {
              let respuestas = 0
              comentarios.forEach(comentario => {
                if (comentario.respuesta.IDEN_RESPUESTA) respuestas++
              })
              return {
                user: user,
                respuestas
              }
            })
        }
      })
  },
  data () {
    return {
      selected: false,
      format: 'dd MMM, yyyy',
      posts: [],
      dataErrorMsg: { error_edad: undefined, error_pw: undefined, error_foto: undefined },
      imageUrl: process.env.imagesUrl,
      entrepreneur: {},
      preguntas: 0,
      imagen: undefined,
      user: {}
    }
  },
  components: {
    Datepicker
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then(async (result) => {
        // Se limpian los mensajes
        this.dataErrorMsg = { error_edad: undefined, error_pw: undefined, error_foto: undefined }
        // Se valida si la fecha ingresada coincide para poseer 18 años de edad o mas
        if (customValidations.isUnderAge(this.user.persona.FECH_FECHA_NACIMIENTO)) {
          this.dataErrorMsg.error_edad = 'Debe ser mayor de edad'
        }

        // Se valida que las contraseñas coincidan
        if (this.user.pass && (!this.user.pass2 || this.user.pass !== this.user.pass2)) {
          this.dataErrorMsg.error_pw = 'Las contraseñas deben coincidir'
        }

        let blobs = []
        // Recorrer directamente los componentes, en vez de los modelos
        for (var key in this.$children) {
          // Validar que efectivamente contiene los atributos que corresponden a un componente vue-croppa
          if (this.$children[key] && this.$children[key].$children && this.$children[key].$children[0] && this.$children[key].$children[0].imageSet) {
            let blob = await this.$children[key].$children[0].promisedBlob()
            blobs.push(blob)
          }
        }

        if (blobs.length === 0) {
          this.dataErrorMsg.error_foto = 'Debe seleccionar una foto'
        }

        if (this.dataErrorMsg.error_edad || this.dataErrorMsg.error_pw || this.dataErrorMsg.error_foto) {
          result = undefined
        }

        if (result) {
          if (this.loggedUser.rol === 102) {
            this.user.blobs = blobs
            controller.PUTEmprendedor(this)
          } else {
            controller.PUT(this, this.user)
          }
        }
      })
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  head () {
    return {
      title: 'Mi Cuenta'
    }
  }
}
</script>