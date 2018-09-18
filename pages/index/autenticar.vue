<template>

  <section id="publicacion" class="container-fluid">
    <section class="login section">
    <div class="container">
      <div class="row">
        <div class="login--content col-lg-6 offset-lg-3 col-md-8 offset-md-2">
          <h2 class="h2 text-center">Iniciar Sesión</h2>
          <form  class="mt-4" @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label>Correo electrónico</label>
              <input type="text" v-validate data-vv-rules="required|email" v-model.trim="auth.email" class="form-control" name="email"/>
              <small class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</small>
            </div>
            <div class="form-group margin-top">
              <label>Contraseña</label>
              <input type="password" v-validate data-vv-rules="required" v-model.trim="auth.password" class="form-control" name="pass"/>
              <small class="text-danger" v-show="errors.has('pass')">{{ errors.first('pass') }}</small>
            </div>
            <div v-if="message">
              <small class="text-danger">{{ message }}</small>
            </div>
            <button class="btn btn-primary btn-primary__turquoise" type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  </section>
    
    
  </section>
</template>

<script>
import controller from '~/controllers/auth'
export default {
  middleware: 'anonymous',
  data () {
    return {
      auth: {},
      error: false,
      message: '',
      processing: false
    }
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          this.auth.email = this.auth.email.toLowerCase()
          await controller.login(this)
          if (!this.error) {
            this.$router.push({ path: '/redirect' })
          }
        }
        this.processing = false
      })
    }
  },
  head () {
    return {
      title: 'Inicia Sesión'
    }
  }
}
</script>
