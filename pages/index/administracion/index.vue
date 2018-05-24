<template>
  <div class="container">
    <div class="col-md-12 col-md-offset-3">
        <h2>Desactivación de cuentas de clientes</h2>
        <img v-bind:src="'/img/des-cliente.jpg'" class="img-responsive" alt="Logo Del Barrio">
    </div>
    <div class="col-md-12 col-md-offset-3">
        <h2>Desactivación de cuentas de emprendedores</h2>
        <img v-bind:src="'/img/des-emprendedores.jpg'" class="img-responsive" alt="Logo Del Barrio">
        <br><br><br><br>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: 'Reportes',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
