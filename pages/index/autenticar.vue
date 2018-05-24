<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-3 fondo-beige">
          <h2 class="text-center">Inicia sesión</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label>Correo electrónico</label>
              <input type="text" v-model="auth.email" class="form-control"/>
            </div>
            <div class="form-group margin-top">
              <label>Contraseña</label>
              <input type="password" v-model="auth.password" class="form-control"/>
            </div>
            <div v-if='message'>
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
      message: ''
    }
  },
  methods: {
    validateBeforeSubmit () {
      // this.$validator.validateAll().then((result) => {
      //   if (result) {
      //     controller.authenticate(this)
      //   }
      // }
      controller.login(this)
        .then(() => {
          if (!this.error) {
            this.$router.push({ path: '/' })
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
