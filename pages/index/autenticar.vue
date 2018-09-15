<template>

  <section id="publicacion" class="container-fluid">
    <div class="container">
       <hr>
    </div>
    <div class="container border p-3">
      <div class="row">
        <div class="col-md-6 col-md-offset-3 fondo-beige">
          <h2 class="text-center">Inicia sesión</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label>Correo electrónico</label>
              <input type="text" v-validate data-vv-rules="required|email" v-model="auth.email" class="form-control" name="email"/>
              <small class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</small>
            </div>
            <div class="form-group margin-top">
              <label>Contraseña</label>
              <input type="password" v-validate data-vv-rules="required" v-model="auth.password" class="form-control" name="pass"/>
              <small class="text-danger" v-show="errors.has('pass')">{{ errors.first('pass') }}</small>
            </div>
            <div v-if="message">
              <small class="text-danger">{{ message }}</small>
            </div>
            <button class="btn btn-default" type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
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
      /* this.$validator.validateAll().then((result) => {
        if (result) {
          controller.authenticate(this)
        }
      } */
      if (this.processing) return
      this.processing = true
      this.$validator.validateAll().then(result => {
        if (result) {
          this.auth.email = this.auth.email.toLowerCase()
          controller.login(this)
            .then(() => {
              if (!this.error) {
                this.$router.push({ path: '/redirect' })
              } else {
                this.processing = false
              }
            })
        } else {
          this.processing = false
        }
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
