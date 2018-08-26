<template>
  <section class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 offset-md-3">
    <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
      <h1 class="text-center">Subir Términos y Condiciones</h1>
      <div id="dropbox" class="text-center">
        <input type="file" @change="filesChange" accept="application/pdf" id="dropbox-file">
          <p v-if="isInitial">
            Haga click aquí o arrastre el archivo PDF para subir
          </p>
          <p v-if="isSaving">
            Recuerde guardar el archivo cargado
              </p>
          <button class="btn btn-default" v-on:click="saveFile">Guardar</button>
          </div>
        </form>
      </div>
      </div>
    </div>
  </section>
</template>

<script>
import controller from '~/controllers/admin/termsconditions'
export default {
  data () {
    return {
      isInitial: true,
      isSaving: false,
      file: {}
    }
  },
  components: {
  },
  methods: {
    filesChange (e) {
      var files = e.target.files || e.dataTransfer.filesChange
      if (!files.length) {
        return
      }
      this.isInitial = false
      this.isSaving = true
      this.file = files[0]
      console.log(files[0])
    },
    saveFile (e) {
      e.preventDefault()
      controller.saveTermsConditions(this)
    }
  },
  head () {
    return {
      title: 'Términos y condiciones'
    }
  }
}
</script>
