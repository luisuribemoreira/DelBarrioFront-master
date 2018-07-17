<template>
  <section id="admin" class="container-fluid">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Cambiar contraseña</h2>
        </div>
      </div>
 <!-- CONFIGURACION DE CUENTA -->
     <div class="margin-top">
        <div class="col-md-6 fondo-beige">
          <form @submit.prevent="validateBeforeSubmit">
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

export default {
  asyncData ({ app, store }) {
    return controller.GET(app, store._vm.loggedUser.id)
      .then(({ user }) => {
        return {
          user: user
        }
      })
  },
  data () {
    return {
      dataErrorMsg: {}
    }
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then(async (result) => {
        // Se limpian los mensajes
        this.dataErrorMsg = {}

        // Se valida que las contraseñas coincidan
        if (this.user.pass && (!this.user.pass2 || this.user.pass !== this.user.pass2)) {
          this.dataErrorMsg.error_pw = 'Las contraseñas deben coincidir'
        }

        if (this.dataErrorMsg.error_pw) {
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
      title: 'Configuración'
    }
  }
}
</script>
