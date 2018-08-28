<template>
  <section id="publicacion" class="container-fluid" align="center">
    <div class="container">
      <div class="row">
        <div class="col-md-10 offset-md-1">
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group py-2">
              <input class="form-control input-lg" placeholder="¿Qué buscas?"/>
            </div>
          </form>
          <center>
          <img class="margin-top" style="text-align: center" :src="'https://i.ytimg.com/vi/vUQUDS-TL6Q/hqdefault.jpg'">
          <h2><nuxt-link to="/busqueda-avanzada">Manual de usuario</nuxt-link></h2>
          <h2><nuxt-link to="/busqueda-avanzada">Búsqueda avanzada</nuxt-link></h2>
          </center>
        </div>
      </div>
    </div>
    <div class="footer-dark bg-dark">
      <div class="container">
        <a :href="terms">Términos y condiciones</a>
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
