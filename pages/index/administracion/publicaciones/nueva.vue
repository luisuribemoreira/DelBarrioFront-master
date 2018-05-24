<template>
  <div>
    <section id="publicacion" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-10 col-md-offset-1 fondo-beige">
            <h2 class="text-center">Nueva Publicación</h2>            
            <form class="margin-top" @submit.prevent="validateBeforeSubmit">
              <div class="row margin-top"> <!-- Corregir estilos -->
                <div class="col-sm-3">
                <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="3.6"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          ></croppa>
                  </no-ssr>
                </div>
                <div class="col-sm-3">
                  <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="3.6"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          ></croppa>
                  </no-ssr>
                </div>
                <div class="col-sm-3">
                  <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="3.6"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          ></croppa>
                  </no-ssr>
                </div>
                <div class="col-sm-3">
                  <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="3.6"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          ></croppa>
                  </no-ssr>
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
  </div>
</template>

  

<script>
import controller from '~/controllers/posts'
import categoriescontroller from '~/controllers/admin/categories'
import customvalidations from '~/controllers/customvalidations'
import Datepicker from 'vuejs-datepicker'

export default {
  data () {
    return {
      format: 'dd MMM, yyyy',
      post: { FLAG_CONTENIDO_ADULTO: false, ETIQUETAS: [] },
      sale: { },
      subcategorias: {},
      message: false,
      selectedIndex: null,
      isSale: false,
      // Mensajes de error para validaciones manuales
      errorMsgs: {}
      // Se elimina modelo images, ya que no se utilizará
    }
  },
  asyncData ({app}) {
    return categoriescontroller.GETAll(app)
  },
  components: {
    Datepicker
  },
  methods: {
    addPost () {
      event.preventDefault()
      controller.POST(this)
    },
    validateBeforeSubmit () {
      this.$validator.validateAll().then(async (result) => {
        // Validar fechas de forma manual [Incompatibilidad con VV]
        if (this.isSale) {
          let errorMessages = {}
          if (customvalidations.isDefined(this.sale.FECH_INICIO)) {
            if (!customvalidations.isDate(this.sale.FECH_INICIO)) {
              errorMessages.start_date = 'Este campo no corresponde a una fecha'
            }
          } else {
            errorMessages.start_date = 'Este campo es obligatorio'
          }

          if (customvalidations.isDefined(this.sale.FECH_TERMINO)) {
            if (!customvalidations.isDate(this.sale.FECH_TERMINO)) {
              errorMessages.end_date = 'Este campo no corresponde a una fecha'
            } else {
              // Si la fecha de inicio existe y es válida, comparar que el término sea posterior al inicio
              if (!errorMessages.start_date) {
                if (!customvalidations.isDateAfter(this.sale.FECH_INICIO, this.sale.FECH_TERMINO)) {
                  errorMessages.end_date = 'La fecha de término debe ser posterior a la de inicio'
                }
              }
            }
          } else {
            errorMessages.end_date = 'Este campo es obligatorio'
          }

          if (errorMessages.start_date || errorMessages.end_date) {
            result = undefined
            this.errorMsgs.start_date = errorMessages.start_date
            this.errorMsgs.end_date = errorMessages.end_date
          }
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
        }
      })
    },
    selected (i) {
      this.subcategorias = i
      console.log(i)
    }
  },
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