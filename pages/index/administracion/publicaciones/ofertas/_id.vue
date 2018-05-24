<template>
    <section id="publicacion" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-10 col-md-offset-1 fondo-beige">
            <h2 class="text-center">Editar Oferta</h2>            
            <form class="margin-top" @submit.prevent="validateBeforeSubmit">
              <h3>Publicación</h3>
              <div class="row margin-top" v-if="post.imagenes.length > 0" style="text-align:center"> <!-- Corregir estilos -->
                <div class="col-sm-3" v-for="img in post.imagenes">
                  <img :src="imageUrl+img.URL_IMAGEN" style="width: 200px" />
                </div>
              </div>
              <div class="row margin-top">
                <div class="col-sm-6">
                  <label for="tipo">Tipo</label>
                  <span class="data" id="tipo" v-if="post.CODI_TIPO_PUBLICACION === 'P'">Producto</span>
                  <span class="data" id="tipo" v-if="post.CODI_TIPO_PUBLICACION === 'S'">Servicio</span>
                </div>
                <div class="col-sm-6">
                  <label for="name">Título</label>
                  <span class="data" id="name">{{ post.NOMB_PUBLICACION }}</span>
                </div> 
              </div>
              <div class="row margin-top">             
                <div class="col-sm-6">
                  <label for="price">Precio</label>
                  <span class="data" id="precio">{{ post.NUMR_PRECIO }}</span>
                </div>              
                <div class="col-sm-6">
                  <label for="descripcion">Descripcion</label>
                  <span class="data" id="descripcion">{{ post.DESC_PUBLICACION }}</span>
                </div>
              </div>
              <div class="row margin-top">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label for="category">Categoría</label>
                    <span class="data" id="category">{{ post.categoria.NOMB_CATEGORIA }}</span>
                  </div>
                </div>
              </div>
              <div class="row" v-if="post.FLAG_CONTENIDO_ADULTO">
                <span class="text-danger">Publicación para mayores de 18</span>
              </div>
              <div class="row" v-if="post.etiquetas.length > 0">
                <div class="col-sm-12">
                  <label for="tags">Tags</label>
                  <div id="tags">|<span v-for="eti in post.etiquetas"> {{ eti.NOMB_ETIQUETA }} |</span></div>
                </div>
              </div>
              <hr/>
              <h3>Oferta</h3>
              <div class="checkbox">
                <label>
                  <input type="checkbox" v-model="isSale"> Oferta habilitada
                </label>
              </div>
              <div v-if="isSale">
                <h3>Datos de la Oferta</h3>
                <div class="form-group">
                  <label for="precio-oferta">Precio Oferta</label>
                  <input type="text" v-model="sale.NUMR_PRECIO" name="price" class="form-control" v-validate :data-vv-rules="isSale ? 'required|numeric|between:0,1000000000': ''" />
                  <small class="text-danger" v-show="errors.has('price')">{{ errors.first('price') }}</small>
                </div>
                <div class="form-group">
                  <label for="fecha-inicio">Fecha Inicio</label>
                  <datepicker 
                    language="es"
                    :format='format'
                    v-model="sale.FECH_INICIO"
                    :bootstrapStyling = "true"
                  ></datepicker>
                  <small class="text-danger" v-if="errorMsgs.start_date != undefined">{{ errorMsgs.start_date }}</small>
                </div>
                <div class="form-group">
                  <label for="fecha-termino">Fecha Término</label>
                  <datepicker 
                    language="es"
                    :format='format'
                    v-model="sale.FECH_TERMINO"
                    :bootstrapStyling="true"
                  ></datepicker>
                  <small class="text-danger" v-if="errorMsgs.end_date != undefined">{{ errorMsgs.end_date }}</small>
                </div>
              </div>
              <div v-if="messageOferta">
                <span>{{messageOferta}}</span>
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
import customvalidations from '~/controllers/customvalidations'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'EditPost',
  data () {
    return {
      messageOferta: false,
      isSale: false,
      sale: {},
      errorMsgs: {},
      format: 'dd MMM, yyyy',
      error: {},
      imageUrl: process.env.imagesUrl
    }
  },
  asyncData ({ app, params }) {
    return controller.GET(app, params.id)
      .then(post => {
        return {
          id: post.id,
          post: post.post,
          isSale: post.isSale,
          sale: post.post.oferta
        }
      })
  },
  components: {
    Datepicker
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        // Validar fechas de forma manual [Incompatibilidad con VV]
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
            // Si la fecha de inicio existe y es válida, comparar que el inicio sea posterior a ayer y término sea posterior al inicio
            if (!errorMessages.start_date) {
              if (!customvalidations.isDateAfter((new Date()).getDate() - 1, this.sale.FECH_INICIO)) {
                errorMessages.start_date = 'La fecha de inicio debe ser igual o posterior a la de hoy'
              } else if (!customvalidations.isDateAfter(this.sale.FECH_INICIO, this.sale.FECH_TERMINO)) {
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

        if (result) {
          if (this.post.oferta.IDEN_OFERTA !== undefined) {
            controller.updateSale(this, this.post.oferta.IDEN_OFERTA)
          } else {
            controller.addSale(this, this.post.IDEN_PUBLICACION)
          }
        }
      })
    }
  },
  head () {
    return {
      title: 'Editar Oferta'
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
.data {
  display:block;
  font-size: 1.25em;
}
</style>
