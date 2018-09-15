<template>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  mounted () {
    if (this.isAuthenticated && this.loggedUser.rol === 102) {
      this.$router.push({ path: '/administracion/publicaciones' })
    } else if (this.isAuthenticated && this.loggedUser.rol === 103) {
      this.$router.push({ path: '/administracion/moderar-publicaciones' })
    } else if (this.isAuthenticated && this.loggedUser.rol === 104) {
      this.$router.push({ path: '/administracion/administradores' })
    } else {
      this.$router.push({ path: '/' })
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  head () {
    return {
      title: 'Redirecting...'
    }
  }
}
</script>