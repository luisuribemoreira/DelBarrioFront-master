<template>
  <section id="publicacion" class="container-fluid" align="center">
    <div class="container">
      <div class="row">
        <div class="col-md-10 offset-md-1">
          <center>
          <!-- <h2><nuxt-link to="/busqueda-avanzada">Manual de usuario</nuxt-link></h2> -->
          <h2><nuxt-link to="/busqueda-avanzada">Búsqueda avanzada</nuxt-link></h2>
          </center>
        </div>
      </div>
    </div>
    <div class="footer-light bg-light">
      <div class="container">
        <a target="_blank" :href="terms">Términos y condiciones</a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      terms: process.env.termsUrl
    }
  },
  head () {
    return {
      title: 'Inicio'
    }
  }
}
</script>
