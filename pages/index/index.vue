<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-10 col-md-offset-1 fondo-beige">
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <input class="form-control input-lg" placeholder="¿Qué buscas?"/>
            </div>
          </form>
          <center>
          <img class="margin-top" style="text-align: center" :src="'https://i.ytimg.com/vi/vUQUDS-TL6Q/hqdefault.jpg'"></img>
          <h2><nuxt-link to="/busqueda-avanzada">Manual de usuario</nuxt-link></h2>
          <h2><nuxt-link to="/busqueda-avanzada">Búsqueda avanzada</nuxt-link></h2>
          </center>
          
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  head () {
    return {
      title: 'Inicio'
    }
  }
}
</script>
