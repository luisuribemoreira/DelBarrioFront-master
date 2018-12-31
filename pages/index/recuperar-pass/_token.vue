<template>
    <section class="login section">
    <div class="container">
      <div class="row">
        <div class="login--content col-lg-6 offset-lg-3 col-md-8 offset-md-2" v-if="user">
          <h2 class="h2 text-center">Recuperar contraseña</h2>
          <form  class="mt-4" @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Correo Electrónico</label>
              <input v-validate data-vv-rules="required|email" data-vv-as="correo" name="correo" type="text" v-model.trim="user.user.EMAIL_USUARIO" class="form-control" readonly/>
              <small class="text-danger" v-show="errors.has('correo')">{{ errors.first('correo') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass">Contraseña</label><span style="color: grey"> (*No utilice palabras o números de conocimiento público)</span>
              <input v-validate data-vv-rules="min:6" data-vv-as="contraseña" name="pass" type="password" v-model.trim="user.pass" class="form-control"/>
              <small class="text-danger" v-show="errors.has('pass')">{{ errors.first('pass') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass2">Confirmar Contraseña</label>
              <input type="password" data-vv-as="contraseña" name="pass2" v-model.trim="user.pass2" class="form-control"/>
              <small class="text-danger" v-if="error_pw">{{ error_pw }}</small>
            </div>
            <div v-if="message">
            <small class="text-danger">{{ message }}</small>
            </div>
            <button class="btn btn-primary btn-primary__turquoise " type="submit">Enviar </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import controller from '~/controllers/auth'
// import emailer from '~/controllers/admin/emailer'

export default {
    middleware: 'anonymous',
    asyncData ({app, params}) {
      return controller.GETResetPassword(app, params.token)
        .then(user => {
          return {
            user: user
          }
        })
    },
    data () {
      return {
        user: {},
        error: false,
        message: '',
        processing: false,
        error_pw: ''
      }
    },
    methods: {
      validateBeforeSubmit () {
        if (this.processing) return
        this.processing = true
        this.error_pw = ''
        this.$validator.validateAll().then(async (result) => {
        // Se valida que las contraseñas coincidan
          if (this.user.pass && (!this.user.pass2 || this.user.pass !== this.user.pass2)) {
            this.error_pw = 'Las contraseñas deben coincidir'
          }
          if (this.error_pw) {
            result = undefined
          }
          if (result) {
            // let mail = this.user.EMAIL_USUARIO
            // let password = this.user.pass
            await controller.PUTResetPassword(this, this.user.user.RESET_PASSWORD_TOKEN)
          }
          this.processing = false
        })
      }
    },
    head () {
      return {
        title: 'Cambiar contraseña'
      }
    }
}
</script>
