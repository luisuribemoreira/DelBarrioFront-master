<template>
<section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 offset-md-3">
          <h2 class="text-center">Nuevo Rubro</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Nombre</label>
              <input v-validate data-vv-rules="required|min:5|max:50" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.'-]{5,50}" title="Sólo letras, mínimo 5 máximo 50" data-vv-as="nombre" name="name" type="text" v-model.trim="workfield.NOMB_RUBRO" class="form-control"/>
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
import controller from '~/controllers/admin/workfields'

export default {
  data () {
    return {
      workfield: {},
      message: false,
      processing: false
    }
  },
  asyncData ({store}) {
    store.commit('SET_TITLE', 'Rubros')
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          await controller.POST(this)
        }
        this.processing = false
      })
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Nuevo rubro'
    }
  }
}
</script>
