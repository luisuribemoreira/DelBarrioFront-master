<template>
  <section id="admin" class="container-fluid">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Mi cuenta</h2>
        </div>
      </div>
      <div class="row">
        <!-- EMPRENDEDOR - PREGUNTAS -->
        <div class="col-xs-12" v-if="isAuthenticated && loggedUser.rol === 102">
          <h3><icon name="comments-o" :aria-hidden="true" :scale="2"></icon><span style="vertical-align: super"> Preguntas</span></h3>
          <hr>
          <p><span class="label label-default">0</span> <span style="vertical-align: sub"> Que aún no respondiste</span></p>
        </div>
        <!-- CLIENTE - RESPUESTAS -->
        <div class="col-xs-12" v-if="isAuthenticated && loggedUser.rol === 101">
          <h3><icon name="comments-o" :aria-hidden="true" :scale="2"></icon><span style="vertical-align: super"> Respuestas</span></h3>
          <hr>
          <p><span class="label label-default">0</span> <span style="vertical-align: sub"> Te han respondido</span></p>
        </div>
      </div>
      <hr>
      <div v-if="isAuthenticated && loggedUser.rol === 102">
        <div class="row margin-top">
          <div class="col-xs-12">
            <h3>Tus destacados</h3>
            <small class="text-muted"><nuxt-link to="/administracion/publicaciones">Ver todos</nuxt-link></small>
          </div>
        </div>
        <div class="row">
          <transition-group name="ListPosts" tag="div">
            <div class="col-md-2 col-sm-3 col-xs-6 post-item" v-for="p in posts" :key="p.IDEN_PUBLICACION">
              <nuxt-link :to="'/publicaciones/'+p.IDEN_PUBLICACION ">
                <img v-if="p.imagenes.length === 0" v-lazy="'/img/no-image.svg'" class="img-responsive" alt="">
                <img v-else v-lazy="imageUrl + p.imagenes[0].URL_IMAGEN" class="img-responsive" alt="">
              </nuxt-link>
              <h4 class="text-center">{{ p.NOMB_PUBLICACION }}</h4> 
              <p class="text-center">{{ p.DESC_PUBLICACION.substring(0,20) }}</p>
              <h5 class="text-center">$ {{ p.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
            </div>
          </transition-group>
        </div>
        <hr class="margin-top">
      </div>
      <a class="btn btn-default" @click="selected = !selected">
        <icon name="wrench" :aria-hidden="true"></icon>
        <span style="vertical-align: text-buttom"> Configuración Cuenta</span>
      </a>
      <!-- CONFIGURACION DE CUENTA -->
      <div v-if="selected" class="margin-top">
        <div style="text-align: center">
          <h2><span style="vertical-align: super" > Mis datos</span></h2>
          <hr>
        </div>
        <div class="col-md-6 fondo-beige">
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Nombres</label>
              <input v-validate data-vv-rules="required" data-vv-as="nombre" name="name" type="text" v-model="user.persona.NOMBRES" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname">Apellido Paterno</label>
              <input v-validate data-vv-rules="required" data-vv-as="apellido paterno" name="lastname" type="text" v-model="user.persona.APELLIDO_PATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname')">{{ errors.first('lastname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname2">Apellido Materno</label>
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
              <label for="pass">Contraseña</label>
              <input v-validate data-vv-rules="min:6" data-vv-as="contraseña" name="pass" type="password" v-model="user.pass" class="form-control"/>
              <small class="text-danger" v-show="errors.has('pass')">{{ errors.first('pass') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass2">Confirmar Contraseña</label>
              <input type="password" data-vv-as="contraseña" name="pass2" v-model="user.pass2" class="form-control"/>
              <small class="text-danger" v-if="dataErrorMsg.error_pw">{{ dataErrorMsg.error_pw }}</small>
            </div>
            <button type="submit" class="btn btn-default">Cambiar</button>
          </form>
        </div>
      </div>
      
    </div> <!-- /container -->
  </section>

</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/myaccount'
import controllerEmprendedor from '~/controllers/admin/entrepreneurs'
import customValidations from '~/controllers/customvalidations'
import Datepicker from 'vuejs-datepicker'

export default {
  asyncData ({ app, store }) {
    return controller.GET(app, store._vm.loggedUser.id)
      .then(({ user }) => {
        if (store._vm.loggedUser.rol === 102) {
          return controllerEmprendedor.GET(app, user.emprendedor.IDEN_EMPRENDEDOR)
            .then(({ entrepreneur }) => {
              return {
                user: user,
                posts: entrepreneur.publicaciones
              }
            })
        } else {
          return {
            user: user
          }
        }
      })
  },
  data () {
    return {
      selected: false,
      format: 'dd MMM, yyyy',
      posts: [],
      dataErrorMsg: { error_edad: undefined, error_pw: undefined },
      imageUrl: process.env.imagesUrl
    }
  },
  components: {
    Datepicker
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then(async (result) => {
        // Se limpian los mensajes
        this.dataErrorMsg = { error_edad: undefined, error_pw: undefined }

        // Se valida si la fecha ingresada coincide para poseer 18 años de edad o mas
        if (customValidations.isUnderAge(this.user.persona.FECH_FECHA_NACIMIENTO)) {
          this.dataErrorMsg.error_edad = 'Debe ser mayor de edad'
        }

        // Se valida que las contraseñas coincidan
        if (!this.user.pass2 || this.user.pass !== this.user.pass2) {
          this.dataErrorMsg.error_pw = 'Las contraseñas deben coincidir'
        }

        if (this.dataErrorMsg.error_edad || this.dataErrorMsg.error_pw) {
          result = undefined
        }

        if (result) {
          controller.PUT(this, this.user)
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