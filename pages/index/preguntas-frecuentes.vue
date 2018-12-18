<template>
  <section id="faq" class="faq section">
    <div class="container">
      <div class="row">
        <div class="faq--content col-lg-8 offset-lg-2 col-md-10 offset-md-1">
          <h2 class="h2 text-center">Preguntas Frecuentes</h2>
          <div class="accordion mt-4" :key="f.IDEN_FAQ" v-for="f in faqs">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <button class="btn btn-link" type="button">
                    <i data-toggle="collapse" :href="'#collapse'+f.IDEN_FAQ" aria-controls="collapse">{{f.NOMB_FAQ}}</i>
                  </button>
                </h5>
              </div>
              <div :id="'collapse'+ f.IDEN_FAQ" class="panel-collapse collapse in">
                <div class="card-body">{{f.DESC_FAQ}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div><!-- /container -->
  </section>
</template>

<script>
import controller from '~/controllers/admin/faqs'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  data () {
    this.$store.state.title = 'PreguntasFrecuentes'
  },
  head () {
    return {
      title: 'Preguntas Frecuentes'
    }
  }
}
</script>
