<template>

  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-3 fondo-beige">
          <h2 class="text-center">Modificar Categoría</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Nombre</label>
              <input v-validate data-vv-rules="required|min:5|max:50|alpha_spaces" data-vv-as="nombre" name="name" type="text" v-model="category.NOMB_CATEGORIA" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top" v-if="category.subcategorias.length > 0">
              <label>Categoria Padre</label>
              <select v-model="category.IDEN_CATEGORIA_PADRE">
                <option v-bind:key="c.IDEN_CATEGORIA" v-for="c in categories" v-bind:value="c.IDEN_CATEGORIA">{{c.NOMB_CATEGORIA}}</option>
              </select>
            </div>
            <div v-if='message'>
              <span>{{message}}</span>
            </div>
            <button type="submit" class="btn btn-default">Guardar</button>
          </form>
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import controller from '~/controllers/admin/categories'

export default {
  data () {
    return {
      message: false
    }
  },
  asyncData ({ app, params }) {
    return controller.GET(app, params.id)
      .then(category => {
        return controller.GETAll(app)
          .then(categories => {
            return {
              id: category.id,
              category: category.category,
              categories: categories.categories
            }
          })
      })
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) controller.PUT(this)
      })
    }
  },
  head () {
    return {
      title: 'Editar categoría',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
