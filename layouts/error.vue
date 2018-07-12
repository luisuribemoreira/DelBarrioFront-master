<template>
</template>

<script>

export default {
  beforeMount () {
    // Redirecciona cualquier error a la página de inicio
    this.$notify.danger('Ha ocurrido un error inesperado')
    this.$router.push({ path: '/' })
  }
}
</script>