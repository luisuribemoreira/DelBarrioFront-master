<template>
<section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 offset-md-3">
          <h2 class="text-center">Nueva razón de denuncia</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Descripción</label>
              <input v-validate data-vv-rules="required|min:5|max:100" pattern="[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ ,.'-]{5,100}" title="Sólo letras y numeros, mínimo 5 máximo 100" data-vv-as="nombre" name="name" type="text" v-model.trim="denouncereason.NOMB_MOTIVO_DENUNCIA" class="form-control"/>
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
import _ from 'lodash'

export default {
  data () {
    return {
      denouncereason: {},
      message: false,
      processing: false
    }
  },
  asyncData ({store}) {
    store.commit('SET_TITLE', 'RazonDenuncia')
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      this.$validator.validateAll().then(async (result) => {
        // Obtiene la lista de todas las razones de denuncia
        let reasons = await (await controller.GETAll(this)).denouncereasons
        // Evalua si la razon de denuncia ya existe. De ser así arroja un mensaje de error.
        reasons.forEach((reason) => {
          _.find(reason, r => {
            if (r === this.denouncereason.NOMB_MOTIVO_DENUNCIA) {
              result = false
              this.message = 'La razón de denuncia ingresada ya existe.'
              return result
            }
          })
        })
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
      title: 'Nueva razón denuncia'
    }
  }
}
</script>
