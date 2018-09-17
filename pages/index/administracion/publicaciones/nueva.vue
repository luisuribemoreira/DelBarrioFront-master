<template>
  <div>
    <section id="publicacion" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 offset-md-1">
            <h2 class="text-center">Nueva Publicación</h2>            
            <form class="margin-top" @submit.prevent="validateBeforeSubmit">
              <div class="row margin-top"> <!-- Corregir estilos -->
                <div class="col-md-3">
                <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="2.7"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          ></croppa>
                  </no-ssr>
                </div>
                <div class="col-md-3">
                  <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="2.7"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          ></croppa>
                  </no-ssr>
                </div>
                <div class="col-md-3">
                  <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="2.7"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          ></croppa>
                  </no-ssr>
                </div>
                <div class="col-md-3">
                  <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="2.7"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          ></croppa>
                  </no-ssr>
                </div>
              </div>
              <div>
              <input type="checkbox" id="status" name="status" v-model.trim="statusAutoria"> Las imagenes adjuntadas son de mi autoría.
              </div>
              <div>
                <small class="text-danger" v-if="messageAutoria">{{ messageAutoria }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="tipo">Tipo</label>
                <select v-model.trim="post.CODI_TIPO_PUBLICACION" v-validate data-vv-rules="required" data-vv-as="tipo de publicación" name="type" class="form-control">
                  <option value="undefined">Seleccionar</option>
                  <option value="P">Producto</option>
                  <option value="S">Servicio</option>
                </select>
                <small class="text-danger" v-if="message">{{ message }}</small>
              </div>
              <div class="form-group">
                <label for="name">Título</label>
                <input type="text" class="form-control" v-validate data-vv-rules="required|min:5|max:100" data-vv-as="título" name="name" v-model.trim="post.NOMB_PUBLICACION">
                <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
              </div>              
              <div class="form-group">
                <label for="price">Precio</label>
                <input type="text" class="form-control" v-model.trim="post.NUMR_PRECIO" v-validate data-vv-rules="required|numeric|max:7" data-vv-as="precio" name="price">
                <small class="text-danger" v-show="errors.has('price')">{{ errors.first('price') }}</small>
              </div>              
              <div class="form-group">
                <label for="descripcion">Descripcion</label>
                  <textarea v-model.trim="post.DESC_PUBLICACION" v-validate data-vv-rules="required|max:10000" data-vv-as="descripción" name="description" class="form-control" rows="3"></textarea>
                <small class="text-danger" v-show="errors.has('description')">{{ errors.first('description') }}</small>
              </div>
              <div class="row">
                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="category">Categoría</label>
                      <select v-model.trim="post.IDEN_CATEGORIA" v-validate data-vv-rules="required" data-vv-as="categoría" name="category" class="form-control" size=5>
                      <option @click="selected(c.subcategorias)" :key="c.IDEN_CATEGORIA" v-for="(c, i) in categories" :value="c.IDEN_CATEGORIA" v-if="c.FLAG_VIGENTE">{{c.NOMB_CATEGORIA}}</option>
                    </select>
                    <small class="text-danger" v-show="errors.has('category')">{{ errors.first('category') }}</small>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="category">Sub categoría</label>
                    <select v-model.trim="post.IDEN_SUBCATEGORIA" name="subcategory" class="form-control" size=5>
                      <option :key="sc.IDEN_CATEGORIA" v-for="sc in subcategorias" :value="sc.IDEN_CATEGORIA" v-if="sc.FLAG_VIGENTE">{{sc.NOMB_CATEGORIA}}</option>
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
                  <input type="checkbox" v-model.trim="post.FLAG_CONTENIDO_ADULTO"> Producto para mayores de 18
                </label>
              </div>
              <div>
              <input type="checkbox" id="status" name="status" v-model.trim="statusTerminos"> He leído y acepto los <a target="_blank" :href="terms">Términos y condiciones</a>
              </div>
              <div>
                <label>
                <small class="text-danger" v-if="messageTerminos">{{ messageTerminos }}</small>
                </label>
              </div>
              <button type="submit" class="btn btn-default">Publicar</button>
            </form>
          </div>
        </div>
      </div><!-- /container -->
    </section>
  </div>
</template>

  

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/posts'
import categoriescontroller from '~/controllers/admin/categories'

export default {
  data () {
    return {
      format: 'dd MMM, yyyy',
      post: { FLAG_CONTENIDO_ADULTO: false, ETIQUETAS: [] },
      sale: { },
      subcategorias: {},
      message: false,
      statusAutoria: false,
      statusTerminos: false,
      messageTerminos: false,
      messageAutoria: false,
      selectedIndex: null,
      isSale: false,
      // Mensajes de error para validaciones manuales
      errorMsgs: {},
      // Se elimina modelo images, ya que no se utilizará
      terms: process.env.termsUrl,
      processing: false
    }
  },
  asyncData ({app}) {
    return categoriescontroller.GETAll(app)
  },
  methods: {
    addPost () {
      event.preventDefault()
      controller.POST(this)
    },
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      if (this.post.CODI_TIPO_PUBLICACION === 'undefined') this.post.CODI_TIPO_PUBLICACION = undefined
      this.$validator.validateAll().then(async (result) => {
        this.message = false
        if (this.post.CODI_TIPO_PUBLICACION === undefined) {
          result = false
          this.message = 'El campo tipo es obligatorio.'
        }
        //  Revisar si la casilla de imagenes esta marcada, si no lo está obliga a marcarla.
        if (!this.statusAutoria) {
          result = false
          this.messageAutoria = 'Solo se permiten imagenes de su autoría.'
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
            // Validar que efectivamente contiene los atributos que corresponden a un componente vue-croppa
            if (this.$children[key] && this.$children[key].$children && this.$children[key].$children[0] && this.$children[key].$children[0].imageSet) {
              let blob = await this.$children[key].$children[0].promisedBlob()
              blobs.push(blob)
            }
          }
          if (blobs.length > 0) {
            console.log('POST with blobs!')
            controller.POST(this, blobs)
          } else {
            console.log('POST without blobs :(')
            controller.POST(this)
          }
        } else {
          this.processing = false
        }
      })
    },
    selected (i) {
      this.subcategorias = i
    }
  },
  computed: mapGetters([
    'loggedUser'
  ]),
  middleware: 'authenticated',
  head () {
    return {
      title: 'Nueva publicación'
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