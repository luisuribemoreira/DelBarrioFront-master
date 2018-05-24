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
          <form class="input-group text-truncate">
            <input class="form-control" name="search" placeholder="Buscar" autocomplete="off" autofocus="autofocus" type="text">
            <div class="input-group-btn">
              <button class="btn btn-outline-success" type="submit"><icon name="search" :aria-hidden="true"></icon></button>
            </div>
          </form>
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
      selected: 'caret-down'
    }
  },
  methods: {
    setState (category) {
      controller.setState(this, category)
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
