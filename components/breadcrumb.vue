<template>
    <ol class="breadcrumb">
        <li v-for="item in crumbs" :key="item.path" class="breadcrumb-item">
            <nuxt-link :to="item.path.length === 0 ? '/' : item.path" active-class="active">
                {{ item.breadcrumb }}
            </nuxt-link>
        </li>
    </ol>
</template>

<script>
  const breadcrumbs = {
    '': 'Inicio',
    /*
    * MAIN
    */
    '/publicaciones': 'Publicaciones',
    // PREGUNTAS FRECUENTES
    '/preguntas-frecuentes': 'Preguntas Frecuentes',
    // CREAR CUENTA CLIENTE
    '/registro': 'Regístrate',
    // INICIAR SESIÓN
    '/iniciar-sesion': 'Inicia sesión',
    /*
    * ADMINISTRACIÓN
    */
    '/administracion': 'Administración',
    // CATEGORÍAS
    '/administracion/categorias': 'Categorías',
    '/administracion/categorias/nueva': 'Nueva',
    '/administracion/categorias/editar': 'Editar',
    // RUBROS
    '/administracion/rubros': 'Rubros',
    '/administracion/rubros/nuevo': 'Nuevo',
    '/administracion/rubros/editar': 'Editar',
    // CLIENTES
    '/administracion/clientes': 'Clientes',
    // DENUNCIAS
    '/administracion/denuncias': 'Denuncias',
    // EMPRENDEDORES
    '/administracion/emprendedores': 'Emprendedores',
    '/administracion/emprendedores/nuevo': 'Nuevo',
    '/administracion/emprendedores/editar': 'Editar',
    // PREGUNTAS FRECUENTES
    '/administracion/preguntas-frecuentes': 'Preguntas frecuentes',
    '/administracion/preguntas-frecuentes/nueva': 'Nueva',
    '/administracion/preguntas-frecuentes/editar': 'Editar',
    // PUBLICACIONES
    '/administracion/publicaciones': 'Publicaciones',
    '/administracion/publicaciones/nueva': 'Nueva',
    '/administracion/publicaciones/editar': 'Editar',
    // RAZONES DE DENUNCIA
    '/administracion/razon-denuncia': 'Razón de denuncia',
    '/administracion/razon-denuncia/nuevo': 'Nueva',
    '/administracion/razon-denuncia/editar': 'Editar',
    // RAZONES DE DESACTIVACION
    '/administracion/razon-desactivacion': 'Razón de desactivación',
    '/administracion/razon-desactivacion/nuevo': 'Nuevo',
    '/administracion/razon-desactivacion/editar': 'Editar',
    // TERMINOS Y CONDICIONES
    '/administracion/terminos-condiciones': 'Términos y Condiciones',
    // MODERAR CONTENIDO
    '/administracion/moderar-publicaciones': 'Moderar publicaciones'
  }

  export default {
    computed: {
      crumbs () {
        let crumbs = []
        this.$route.matched.forEach((item) => {
          if (breadcrumbs[item.name] || breadcrumbs[item.path]) {
            item.breadcrumb = breadcrumbs[item.name] || breadcrumbs[item.path]
            crumbs.push(item)
          }
        })

        return crumbs
      }
    },
    mounted () {
      // Para depurar los path a definir arriba
      console.log(this.$route.matched)
    }
  }
</script>
