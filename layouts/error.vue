<template>
  <div class="container mt-5 text-center">
        <h1 v-if="error.statusCode === 404">Error 404</h1>
        <h1 v-if="error.statusCode === 404">Página no encontrada.</h1>
        <h1 v-else>Ha ocurrido un error.</h1>
        <h5>Serás redireccionado automáticamente al inicio dentro de 10 segundos.</h5>
        <h5><nuxt-link to="/">Has click aquí para volver enseguida.</nuxt-link></h5>
  </div>
</template>

<script>
export default {
  props: ['error'],
  mounted () {
    setTimeout(() => {
      this.$router.push({ path: '/' })
    }, 10000)
  },
  head () {
    return {
      title: '404'
    }
  }
}
</script>