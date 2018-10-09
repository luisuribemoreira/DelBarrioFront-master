<template>
  <section id="admin-agregar-faq" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 offset-md-2">
          <h2 class="text-center">Modificar FAQ</h2>
            <form @submit.prevent="validateBeforeSubmit">
              <div class="form-group margin-top">
                <label for="question">Pregunta</label>
                <input v-validate data-vv-rules="required|min:5|max:255" pattern="[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ ,.'-¿?]{5,255}" title="Sólo letras y numeros, mínimo 5 máximo 255" data-vv-as="pregunta" name="question" type="text" v-model.trim="faq.NOMB_FAQ" class="form-control">
                <small class="text-danger" v-show="errors.has('question')">{{ errors.first('question') }}</small>
              </div>        
              <div class="form-group margin-top">
                <label for="respuesta">Respuesta</label>
                <textarea class="form-control" 
                          rows="5"
                          v-validate data-vv-rules="required|min:5|max:1000"
                          data-vv-as="respuesta"
                          name="answer"
                          v-model.trim="faq.DESC_FAQ">
                </textarea>
                <small class="text-danger" v-show="errors.has('answer')">{{ errors.first('answer') }}</small>
              </div>
              <button type="submit" class="btn btn-default">Guardar</button>
            </form>
          </div>
          <div v-if='message'>
          <span class="text-danger">{{message}}</span>
        </div>
        </div>
      </div><!-- /container -->
    </section><!-- FAQ -->
</template>

<script>
import controller from '~/controllers/admin/faqs'

export default {
  data () {
    return {
      message: false,
      processing: false,
      faq: {}
    }
  },
  async asyncData ({ app, params, redirect }) {
    let faq = await controller.GET(app, params.id)
    if (!faq) redirect('/')
    return {
      faq: faq.f
    }
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          await controller.PUT(this)
        }
        this.processing = false
      })
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Editar Preguntas Frecuentes'
    }
  }
}
</script>
