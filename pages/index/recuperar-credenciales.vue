<template>
    <section class="login section">
    <div class="container">
      <div class="row">
        <div class="login--content col-lg-6 offset-lg-3 col-md-8 offset-md-2">
          <h2 class="h2 text-center">Recuperar contraseña</h2>
          <form  class="mt-4" @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label>Correo electrónico</label>
              <input type="text" v-validate data-vv-rules="required|email" v-model.trim="auth.email" class="form-control" name="email"/>
              <small class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</small>
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
import emailer from '~/controllers/admin/emailer'

export default {
  middleware: 'anonymous',
  data () {
    return {
      auth: {},
      error: false,
      message: '',
      processing: false,
      tokenAux: ''
    }
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      this.message = ''
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          this.auth.email = this.auth.email.toLowerCase()
          let mail = this.auth.email
          await controller.forgotPassword(this)
          if (!this.error) {
            emailer.sendMail(this, mail, 'Cambio de contraseña',
              'Hemos recibido una solicitud de cambio de contraseña para su cuenta en Vitrina Pro, por favor haga clic en el siguiente link: ' + '\n\n' +
              'http://' + location.host + '/recuperar-pass/' + this.tokenAux + '\n\n' +
              'Si usted no envío esta solicitud, por favor ignore este correo')
            this.$router.push({ path: '/' })
          }
        }
        this.processing = false
      })
    }
  },

  head () {
    return {
      title: 'Recuperar contraseña'
    }
  }
}
</script>
