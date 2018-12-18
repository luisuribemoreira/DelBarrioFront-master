<template>
  <section id="admin" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Cambiar contraseña</h2>
        </div>
      </div>
 <!-- CONFIGURACION DE CUENTA -->
     <div class="margin-top">
        <div class="col-lg-6 mx-auto">
          <div class="row justify-content-center">
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="pass">Contraseña</label><span style="color: grey"> (*No utilice palabras o números de conocimiento público)</span>
              <input v-validate data-vv-rules="min:6" data-vv-as="contraseña" name="pass" type="password" v-model.trim="user.pass" class="form-control"/>
              <small class="text-danger" v-show="errors.has('pass')">{{ errors.first('pass') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass2">Confirmar Contraseña</label>
              <input type="password" data-vv-as="contraseña" name="pass2" v-model.trim="user.pass2" class="form-control"/>
              <small class="text-danger" v-if="dataErrorMsg.error_pw">{{ dataErrorMsg.error_pw }}</small>
            </div>
            <div class="row justify-content-center pb-3">
              <button type="submit" class="btn btn-default" >Guardar</button>
            </div>
            </form>
          </div>
        </div>
      </div>

    </div> <!-- /container -->
  </section>

</template>
<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/myaccount'
import emailer from '~/controllers/admin/emailer'

export default {
  asyncData ({ app, store }) {
    store.commit('SET_TITLE', 'ConfiguracionAdmin')
    return controller.GET(app, store._vm.loggedUser.id)
      .then(({ user }) => {
        return {
          user: user
        }
      })
  },
  data () {
    this.$store.state.title = 'ConfiguracionAdmin'
    return {
      dataErrorMsg: {},
      processing: false
    }
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
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
          let mail = this.user.EMAIL_USUARIO
          let password = this.user.pass
          let err = await controller.PUT(this, this.user)
          if (!err) {
            emailer.sendMail(this, mail, 'Cambio de contraseña',
              'Su nueva contraseña para entrar a DelBarrio es: ' + password + '.')
          }
        }
        this.processing = false
      })
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  middleware: 'authenticated',
  head () {
    return {
      title: 'Configuración'
    }
  }
}
</script>
