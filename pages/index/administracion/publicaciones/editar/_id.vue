<template>
    <section id="publicacion" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 offset-md-1">
            <h2 class="text-center">Editar Publicación</h2>
            <form class="margin-top" @submit.prevent="validateBeforeSubmit">
              <div class="row margin-top"> <!-- Corregir estilos -->
                <div class="col-md-3">
                <no-ssr>
                  <croppa v-model="images.image1"
                          :width="200"
                          :height="200"
                          :quality="2.7"
                          placeholder="Subir imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          v-bind:initial-image="post.imagenes && post.imagenes.length > 0 ? imageUrl+post.imagenes[0].URL_IMAGEN : ''"
                          @image-remove="imageRemoveCheck(0)"
                          @file-choose="imageChangeCheck(0)"
                          ></croppa>
                </no-ssr>
                </div>
                <div class="col-md-3">
                  <no-ssr>
                  <croppa v-model="images.image2"
                          :width="200"
                          :height="200"
                          :quality="2.7"
                          placeholder="Subir imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          :initial-image="post.imagenes && post.imagenes.length > 1 ? imageUrl+post.imagenes[1].URL_IMAGEN : ''"
                          @image-remove="imageRemoveCheck(1)"
                          @file-choose="imageChangeCheck(1)"
                          ></croppa>
                  </no-ssr>
                </div>
                <div class="col-md-3">
                  <no-ssr>
                  <croppa v-model="images.image3"
                          :width="200"
                          :height="200"
                          :quality="2.7"
                          placeholder="Subir imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          :initial-image="post.imagenes && post.imagenes.length > 2 ? imageUrl+post.imagenes[2].URL_IMAGEN : ''"
                          @image-remove="imageRemoveCheck(2)"
                          @file-choose="imageChangeCheck(2)"
                          ></croppa>
                  </no-ssr>
                </div>
                <div class="col-md-3">
                  <no-ssr>
                  <croppa v-model="images.image4"
                          :width="200"
                          :height="200"
                          :quality="2.7"
                          placeholder="Subir imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          :initial-image="post.imagenes && post.imagenes.length > 3 ? imageUrl+post.imagenes[3].URL_IMAGEN : ''"
                          @image-remove="imageRemoveCheck(3)"
                          @file-choose="imageChangeCheck(3)"
                          ></croppa>
                  </no-ssr>
                </div>
              </div>
              <div>
              <strong>
              <p>Primera a la izquierda es la imagen principal y debiese ser la más descriptiva del producto o servicio.</p>
              <p>Tamaño de imagen recomendado igual o mayor a 500x500</p>
              </strong>
              </div>
              <div>
              <input type="checkbox" id="status" name="status" v-model.trim="statusAutoria"> Las imagenes adjuntadas son de mi autoría.
              </div>
              <div class="form-group margin-top">
                <label for="tipo">Tipo</label>
                <select v-model.trim="post.CODI_TIPO_PUBLICACION" v-validate data-vv-rules="required" data-vv-as="tipo de publicación" name="type" class="form-control">
                  <option value="undefined">Seleccionar</option>
                  <option value="P">Producto</option>
                  <option value="S">Servicio</option>
                </select>
                <small class="text-danger" v-show="errors.has('type')">{{ errors.first('type') }}</small>
              </div>
              <div class="form-group">
                <label for="name">Título</label>
                <input type="text" class="form-control" v-validate data-vv-rules="required|min:5|max:100" pattern="[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ ,.'-]{5,100}" title="Sólo letras y numeros, mínimo 5 máximo 100" data-vv-as="título" name="name" v-model="post.NOMB_PUBLICACION">
                <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
              </div>
              <div class="form-group">
                <label for="price">Precio</label>
                <input type="number" class="form-control" v-model="post.NUMR_PRECIO" v-validate data-vv-rules="required|numeric" data-vv-as="precio" name="price">
                <small class="text-danger" v-show="errors.has('price')">{{ errors.first('price') }}</small>
              </div>
              <div class="form-group">
                <label for="descripcion">Descripcion</label>
                  <textarea v-model="post.DESC_PUBLICACION" v-validate data-vv-rules="required|max:10000" data-vv-as="descripción" name="description" class="form-control" rows="3"></textarea>
                <small class="text-danger" v-show="errors.has('description')">{{ errors.first('description') }}</small>
              </div>
              <div class="row">
                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="category">Categoría</label>
                      <select v-model="post.IDEN_CATEGORIA" v-validate data-vv-rules="required" data-vv-as="categoría" name="category" class="form-control" size=5>
                      <option @click="selected(c.subcategorias)" :key="c.IDEN_CATEGORIA" v-for="(c, i) in categories" v-if="c.FLAG_VIGENTE" :value="c.IDEN_CATEGORIA">{{c.NOMB_CATEGORIA}}</option>
                    </select>
                    <small class="text-danger" v-show="errors.has('category')">{{ errors.first('category') }}</small>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="category">Sub categoría</label>
                    <select v-model="post.IDEN_SUBCATEGORIA" name="subcategory" class="form-control" size=5>
                      <option :key="sc.IDEN_CATEGORIA" v-for="sc in subcategorias" :value="sc.IDEN_CATEGORIA" v-if="sc.FLAG_VIGENTE">{{sc.NOMB_CATEGORIA}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <!--<div class="checkbox">
                <label>
                  <input type="checkbox" v-model="post.FLAG_CONTENIDO_ADULTO">Producto para mayores de 18
                </label>
              </div> -->
              <div>
              <input type="checkbox" id="status" name="status" v-model.trim="statusTerminos"> He leído y acepto los <a target="_blank" :href="terms">Términos y condiciones</a>
              </div>
              <div>
                <label>
                <small class="text-danger" v-if="messageTerminos">{{ messageTerminos }}</small>
                </label>
              </div>
              <div v-if='message'>
                <span>{{message}}</span>
              </div>
              <div>
              <label>
                <small class="text-danger" v-if="messageAutoria">{{ messageAutoria }}</small>
              </label>
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
      imageUrl: process.env.imagesUrl,
      statusAutoria: false,
      statusTerminos: false,
      messageTerminos: false,
      messageAutoria: false,
      processing: false
    }
  },
  asyncData ({ app, params, redirect, store }) {
    store.commit('SET_TITLE', 'MisPublicaciones')
    return categoriescontroller.GETAll(app)
      .then(categories => {
        categories.categories.sort(function (a, b) {
          return a.NOMB_CATEGORIA.localeCompare(b.NOMB_CATEGORIA, 'es', { numeric: true })
        })
        return controller.GET(app, params.id)
          .then(post => {
            if (!post) redirect('/')
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
      if (this.processing) return
      this.processing = true
      if (this.post.CODI_TIPO_PUBLICACION === 'undefined') this.post.CODI_TIPO_PUBLICACION = undefined
      this.$validator.validateAll().then(async (result) => {
        //  Revisar si la casilla de imagenes esta marcada, si no lo está obliga a marcarla.
        if (!this.statusAutoria) {
          result = false
          this.messageAutoria = 'Solo se permiten imágenes de su autoría, confirme en el cuadro de arriba que efectivamente pertenecen a usted.'
        }
        //  Revisar si la casilla de Terminos y condiciones esta marcada, si no lo está obliga a marcarla.
        if (!this.statusTerminos) {
          result = false
          this.messageTerminos = 'Debe aceptar los términos y condiciones.'
        }
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
            await controller.PUT(this, blobs)
          } else {
            await controller.PUT(this)
          }
        }
        this.processing = false
      })
    },
    selected (i) {
      this.subcategorias = i.sort(function (a, b) {
        return a.NOMB_CATEGORIA.localeCompare(b.NOMB_CATEGORIA, 'es', { numeric: true })
      })
    },
    imageRemoveCheck (index) {
      // Si se encuentran imágenes con cambios pendientes, eliminar, sino
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
  middleware: 'authenticated',
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
