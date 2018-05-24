<template>
</template>

<script>
import controller from '~/controllers/auth'

export default {
  middleware: 'authenticated',
  mounted () {
    controller.unsetToken(this)
    this.$router.push({ path: '/' })
  }
}
</script>
