<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-3 fondo-beige">
          <h2 class="text-center">Nueva razón de denuncia</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Descripción</label>
              <input v-validate data-vv-rules="required|min:5|max:100" data-vv-as="nombre" name="name" type="text" v-model="denouncereason.NOMB_MOTIVO_DENUNCIA" class="form-control"/>
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
import controller from '~/controllers/admin/denouncereasons'

export default {
  data () {
    return {
      denouncereason: {},
      message: false
    }
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) controller.POST(this)
      })
    }
  },
  head () {
    return {
      title: 'Nueva razón denuncia'
    }
  }
}
</script>
