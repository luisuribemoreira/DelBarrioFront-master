<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-3 fondo-beige">
          <h2 class="text-center">Nueva Categoría</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Nombre</label>
              <input v-validate data-vv-rules="required|min:5|max:50|alpha_spaces" data-vv-as="nombre" name="name" type="text" v-model="category.NOMB_CATEGORIA" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="parent">Categoria Padre</label>
              <select v-model="category.IDEN_CATEGORIA_PADRE" class="form-control" name="parent">
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
      category: {},
      message: false
    }
  },
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          controller.POST(this)
        }
      })
    }
  },
  head () {
    return {
      title: 'Nueva categoría',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
