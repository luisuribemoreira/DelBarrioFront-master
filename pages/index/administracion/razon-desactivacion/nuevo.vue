<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 offset-md-3">
          <h2 class="text-center">Nueva razón de desactivación</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Nombre</label>
              <input v-validate data-vv-rules="required|min:5|max:100" data-vv-as="nombre" name="name" type="text" v-model="deactivationreason.NOMB_MOTIVO_DESHABILITACION" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div v-if='message'>
              <span>{{message}}</span>
            </div>
            <button type="submit" class="btn btn-default">Guardar</button>
          </form>
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import controller from '~/controllers/admin/deactivationreasons'

export default {
  data () {
    return {
      deactivationreason: {},
      message: false,
      processing: false
    }
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      this.$validator.validateAll().then((result) => {
        if (result) {
          controller.POST(this)
        } else {
          this.processing = false
        }
      })
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Nueva razón de desactivación de denuncia'
    }
  }
}
</script>
