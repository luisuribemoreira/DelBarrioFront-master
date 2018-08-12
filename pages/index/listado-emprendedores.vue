<template>
<section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Emprendedores</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar Nombre de Emprendedor..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarEmprendedor()">
            <div class="input-group-btn">
              <icon name="search" :aria-hidden="true"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="row margin-top">
        <div class="col-xs-12 table-responsive">
          <table class="table table-hover table-condensed">
            <thead>
              <tr>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="entrepreneur.IDEN_CATEGORIA" v-for="entrepreneur in entrepreneurs" v-if="entrepreneur.usuario.FECH_CREACION && !entrepreneur.FLAG_BAN" >
                <td><nuxt-link :to="{ path: '/emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR }">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</nuxt-link></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import controller from '~/controllers/admin/entrepreneurs'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  data () {
    return {
      entrepreneurs: [],
      search: '',
      postsAux: []
    }
  },
  methods: {
    setState (entrepreneur) {
      controller.setState(this, entrepreneur)
    },
    buscarEmprendedor () {
      // Copiar todos los posts, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.entrepreneurs
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los emprendedores en que el nombre de fantasia del emprendedor o parte de el posea el texto escrito en el buscador
        let postAux = this.postsAux.map(entrepreneur => {
          if (entrepreneur.DESC_NOMBRE_FANTASIA.match(new RegExp(this.search, 'gi')) !== null) return entrepreneur
        })

        // Limpia los emprendedores actuales y lo llena con los emprendedores que cumplan el criterio de busqueda
        this.entrepreneurs = []
        postAux.forEach(entrepreneur => {
          if (entrepreneur) this.entrepreneurs.push(entrepreneur)
        })

        // Ordena los emprendedores en orden lexicografico.
        this.entrepreneurs.sort(function (a, b) {
          return a.DESC_NOMBRE_FANTASIA.localeCompare(b.DESC_NOMBRE_FANTASIA)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.entrepreneurs = this.postsAux
      }
    }
  },
  head () {
    return {
      title: 'Emprendedores'
    }
  }
}
</script>
