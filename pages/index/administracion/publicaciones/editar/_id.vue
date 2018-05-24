<template>
    <section id="publicacion" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-10 col-md-offset-1 fondo-beige">
            <h2 class="text-center">Editar Publicación</h2>            
            <form class="margin-top" @submit.prevent="validateBeforeSubmit">
              <div class="row margin-top"> <!-- Corregir estilos -->
                <div class="col-sm-3">
                <no-ssr>
                  <croppa v-model="images.image1"
                          :width="200"
                          :height="200"
                          placeholder="Subir imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          v-bind:initial-image="post.imagenes.length > 0 ? imageUrl+post.imagenes[0].URL_IMAGEN : ''"
                          @image-remove="imageRemoveCheck(0)"
                          @file-choose="imageChangeCheck(0)"
                          ></croppa>
                </no-ssr>
                </div>
                <div class="col-sm-3">
                  <croppa v-model="images.image2"
                          :width="200"
                          :height="200"
                          placeholder="Subir imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          :initial-image="post.imagenes.length > 1 ? imageUrl+post.imagenes[1].URL_IMAGEN : ''"
                          @image-remove="imageRemoveCheck(1)"
                          @file-choose="imageChangeCheck(1)"
                          ></croppa>
                </div>
                <div class="col-sm-3">
                  <croppa v-model="images.image3"
                          :width="200"
                          :height="200"
                          placeholder="Subir imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          :initial-image="post.imagenes.length > 2 ? imageUrl+post.imagenes[2].URL_IMAGEN : ''"
                          @image-remove="imageRemoveCheck(2)"
                          @file-choose="imageChangeCheck(2)"
                          ></croppa>
                </div>
                <div class="col-sm-3">
                  <croppa v-model="images.image4"
                          :width="200"
                          :height="200"
                          placeholder="Subir imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          :initial-image="post.imagenes.length > 3 ? imageUrl+post.imagenes[3].URL_IMAGEN : ''"
                          @image-remove="imageRemoveCheck(3)"
                          @file-choose="imageChangeCheck(3)"
                          ></croppa>
                </div>
              </div>
              <div class="form-group margin-top">
                <label for="tipo">Tipo</label>
                <select v-model="post.CODI_TIPO_PUBLICACION" v-validate data-vv-rules="required" data-vv-as="tipo de publicación" name="type" class="form-control">
                  <option value="undefined">Seleccionar</option>
                  <option value="P">Producto</option>
                  <option value="S">Servicio</option>
                </select>
                <small class="text-danger" v-show="errors.has('type')">{{ errors.first('type') }}</small>
              </div>
              <div class="form-group">
                <label for="name">Título</label>
                <input type="text" class="form-control" v-validate data-vv-rules="required|min:5|max:100" data-vv-as="título" name="name" v-model="post.NOMB_PUBLICACION">
                <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
              </div>              
              <div class="form-group">
                <label for="price">Precio</label>
                <input type="text" class="form-control" v-model="post.NUMR_PRECIO" v-validate data-vv-rules="required|numeric" data-vv-as="precio" name="price">
                <small class="text-danger" v-show="errors.has('price')">{{ errors.first('price') }}</small>
              </div>              
              <div class="form-group">
                <label for="descripcion">Descripcion</label>
                  <textarea v-model="post.DESC_PUBLICACION" v-validate data-vv-rules="required|max:5000" data-vv-as="descripción" name="description" class="form-control" rows="3"></textarea>
                <small class="text-danger" v-show="errors.has('description')">{{ errors.first('description') }}</small>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="category">Categoría</label>
                      <select v-model="post.IDEN_CATEGORIA" v-validate data-vv-rules="required" data-vv-as="categoría" name="category" class="form-control" size=5>
                      <option @click="selected(c.subcategorias)" :key="c.IDEN_CATEGORIA" v-for="(c, i) in categories" :value="c.IDEN_CATEGORIA">{{c.NOMB_CATEGORIA}}</option>
                    </select>
                    <small class="text-danger" v-show="errors.has('category')">{{ errors.first('category') }}</small>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="category">Sub categoría</label>
                    <select v-model="post.IDEN_SUBCATEGORIA" name="subcategory" class="form-control" size=5>
                      <option :key="sc.IDEN_CATEGORIA" v-for="sc in subcategorias" :value="sc.IDEN_CATEGORIA">{{sc.NOMB_CATEGORIA}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="tags">Tags (separar por coma)</label>
                <input-tag id="tags" :tags="post.ETIQUETAS" class="form-control"></input-tag>
              </div>
              <div class="checkbox">
                <label>
                  <input type="checkbox" v-model="post.FLAG_CONTENIDO_ADULTO">Producto para mayores de 18
                </label>
              </div>
              <div v-if='message'>
                <span>{{message}}</span>
              </div>
              <button type="submit" class="btn btn-default">Publicar</button>
            </form>
          </div>
        </div>
      </div><!-- /container -->
    </section>
</template>

<script>
import controller from '~/controllers/posts'
import categoriescontroller from '~/controllers/admin/categories'

export default {
  name: 'EditPost',
  data () {
    return {
      message: false,
      images: {},
      subcategorias: {},
      deletedImages: [],
      changedImages: [],
      imageUrl: process.env.imagesUrl
    }
  },
  asyncData ({ app, params }) {
    return categoriescontroller.GETAll(app)
      .then(categories => {
        return controller.GET(app, params.id)
          .then(post => {
            return {
              id: post.id,
              post: post.post,
              categories: categories.categories,
              subcategories: categories.subcategorias
            }
          })
      })
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          let blobs = []
          // Recorrer directamente los componentes, en vez de los modelos
          for (var key in this.$children) {
            // Validar que efectivamente contiene los atributos que corresponden a un componente vue-croppa y que la imagen no sea inicial
            if (this.$children[key] && this.$children[key].$children && this.$children[key].$children[0] && this.$children[key].$children[0].imageSet && !this.$children[key].$children[0].currentIsInitial) {
              let blob = await this.$children[key].$children[0].promisedBlob()
              blobs.push(blob)
            }
          }
          if (blobs.length > 0) {
            controller.PUT(this, blobs)
          } else {
            controller.PUT(this)
          }
        }
      })
    },
    selected (i) {
      this.subcategorias = i
    },
    imageRemoveCheck (index) {
      // Si se encuentra en miágenes con cambios pendientes, eliminar, sino
      // verificar que se encuentre en la cola para eliminar
      if (this.changedImages.indexOf(index) !== -1) {
        this.changedImages.splice(this.changedImages.indexOf(index), 1)
      } else {
        this.deletedImages.push(index)
      }
    },
    imageChangeCheck (index) {
      this.changedImages.push(index)
    },
    confirmImages () {
      console.log('placeholder')
    }
  },
  head () {
    return {
      title: 'Editar Publicación'
    }
  }
}
</script>

<style>
.croppa-container canvas {
  cursor: pointer !important;
  border-style: groove;
  background-color: #fff !important;
  border-width: 1px;
  border-color: #fcfcfc !important;
}
</style>
