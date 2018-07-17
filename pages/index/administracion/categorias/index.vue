<template>
  <section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Categorías</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link to="/administracion/categorias/nueva" class="btn btn-tabla"><icon class="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar Nombre de Categoría..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarCategoria()">
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
                <th>Estado</th>
                <th></th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody :key="category.IDEN_CATEGORIA" v-for="category in categories">
              <!-- CATEGORÍAS -->
              <tr data-toggle="collapse" @click="selected = category.IDEN_CATEGORIA, open = !open">
                <td>
                  <icon class="fa-2x" :name="category.FLAG_VIGENTE ? 'check' : 'times'" v-bind:title="category.FLAG_VIGENTE ? 'Habilitado' : 'Deshabilitado'"></icon>
                </td>
                <td><icon v-if="category.subcategorias.length > 0" name="angle-down"></icon> <b> {{category.NOMB_CATEGORIA}}</b></td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/categorias/editar/'+category.IDEN_CATEGORIA }" class="btn btn-secondary">
                    <icon name="pencil-square-o" title="Editar"></icon>
                  </nuxt-link>
                  <a class="btn" v-bind:class="category.FLAG_VIGENTE ? 'btn-danger' : 'btn-success'" @click="setState(category)" v-bind:title="category.FLAG_VIGENTE ? 'Deshabilitar' : 'Habilitar'">
                    <icon :name="category.FLAG_VIGENTE ? 'times' : 'check'"></icon>
                  </a>
                </td>
              </tr>
              <!-- SUBCATEGORÍAS -->
              <tr :id="category.IDEN_CATEGORIA" v-if="category.IDEN_CATEGORIA == selected && open" v-for="subcategory in category.subcategorias" :key="subcategory.IDEN_CATEGORIA">
                <td>
                  <icon :name="subcategory.FLAG_VIGENTE ? 'check' : 'times'" :title="subcategory.FLAG_VIGENTE ? 'Habilitado' : 'Deshabilitado'"></icon>
                </td>
                <td>{{subcategory.NOMB_CATEGORIA}}</td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/categorias/editar/'+subcategory.IDEN_CATEGORIA }" class="btn btn-default">
                    <icon name="pencil-square-o" title="Editar"></icon>
                  </nuxt-link>
                  <a class="btn" :class="subcategory.FLAG_VIGENTE ? 'btn-danger' : 'btn-success'" v-on:click="setState(subcategory)" v-bind:title="subcategory.FLAG_VIGENTE ? 'Deshabilitar' : 'Habilitar'">
                    <icon class="fa" :name="subcategory.FLAG_VIGENTE ? 'times' : 'check'"></icon>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import controller from '~/controllers/admin/categories'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  data () {
    return {
      open: false,
      selected: 'caret-down',
      categories: [],
      search: '',
      postsAux: []
    }
  },
  methods: {
    setState (category) {
      controller.setState(this, category)
    },
    buscarCategoria () {
      // Copiar todas las catagorias, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.categories
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los nombres de categoria o parte de ellos posea el texto escrito en el buscador
        let postAux = this.postsAux.map(category => {
          if (category.NOMB_CATEGORIA.match(new RegExp(this.search, 'gi')) !== null) return category
        })

        // Limpia el listado actual y lo llena con otro que cumplan el criterio de busqueda
        this.categories = []
        postAux.forEach(category => {
          if (category) this.categories.push(category)
        })

        // Ordena el listado obtenido en orden lexicografico.
        this.categories.sort(function (a, b) {
          return a.NOMB_CATEGORIA.localeCompare(b.NOMB_CATEGORIA)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.categories = this.postsAux
      }
    }
  },
  head () {
    return {
      title: 'Categorías',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
