<template>
  <section id="faq" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-10 col-md-offset-1 fondo-beige">
          <h2 class="text-center">Preguntas Frecuentes</h2>
          <br> <!--cambiar-->
          <div class="panel-group" :key="f.IDEN_FAQ" v-for="f in faqs">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a data-toggle="collapse" :href="'#collapse'+f.IDEN_FAQ">{{f.NOMB_FAQ}}<i class="pull-right fa fa-angle-down" :aria-hidden="true"></i></a>
                </h4>
              </div>
              <div :id="'collapse'+ f.IDEN_FAQ" class="panel-collapse collapse">
                <div class="panel-body">{{f.DESC_FAQ}}</div>
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
  head () {
    return {
      title: 'Preguntas Frecuentes'
    }
  }
}
</script>
