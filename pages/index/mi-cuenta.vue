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
        <div class="container">
        <div class="row">
          </div>
      <div class="row margin-top">
        <div class="row">
          <transition-group name="ListPosts" tag="div">
            <div class="col-md-2 col-sm-3 col-xs-6 post-item" v-for="e in posts" :key="e.IDEN_EMPRENDEDOR" >
              <nuxt-link :to="'/publicaciones/'+e.IDEN_PUBLICACION ">
                <img v-if="e.imagenes.length == 0" v-lazy="'/img/no-image.svg'" class="img-responsive" alt="">
                <img v-else v-lazy="imageUrl + e.imagenes[0].URL_IMAGEN" class="img-responsive" alt="">
              </nuxt-link>
              <h4 class="text-center">{{ e.NOMB_PUBLICACION }}</h4> 
              <p class="text-center">{{ e.DESC_PUBLICACION.substring(0,20) }}</p>
              <h5 class="text-center">$ {{ e.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
        </div>
          </transition-group>
        <!-- Productos -->
        </div><!-- /row -->
      </div><!-- /row -->
    </div><!-- /container -->
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
              <input v-validate data-vv-rules="required" data-vv-as="nombre" name="name" type="text" v-model="user.persona" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="name">Apellido Paterno</label>
              <input v-validate data-vv-rules="required" data-vv-as="apellido paterno" name="lastname" type="text" v-model="user.persona" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname')">{{ errors.first('lastname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="name">Apellido Materno</label>
              <input v-validate data-vv-rules="required" data-vv-as="apellido materno" name="lastname2" type="text" v-model="user.persona" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname2')">{{ errors.first('lastname2') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="date">Fecha de Nacimiento</label>
              <datepicker 
                language="es"
                :format='format'
                v-model="user.persona"
                :bootstrapStyling = "true"
                name="date"
              ></datepicker>
            </div>
            <div class="form-group margin-top">
              <label for="name">Contraseña</label>
              <input v-validate data-vv-rules="required" data-vv-as="contraseña" name="pass" type="password" v-model="user.pass" class="form-control"/>
            </div>
            <button type="submit" class="btn btn-default" @click="PUT()">Cambiar</button>
          </form>
        </div>
      </div>
      
    </div> <!-- /container -->
  </section>

</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/myaccount'
import Datepicker from 'vuejs-datepicker'
import controllerEmprendedor from '~/controllers/admin/entrepreneurs'
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
      persona: {},
      format: 'dd MMM, yyyy',
      posts: [],
      imageUrl: process.env.imageUrl
    }
  },
  components: {
    Datepicker
  },
  methods: {
    PUT (category) {
      controller.PUT(this)
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