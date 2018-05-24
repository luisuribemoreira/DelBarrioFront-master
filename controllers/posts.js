import moment from 'moment'
import imagecontroller from '~/controllers/images'
// Obtener categoria especifica según id.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: Obtiene objeto de la categoría específica seleccionada en la vista "ListPosts"
// =======================================================================================
function GET (app, id) {
  return app.$axios.$get('publicacion/' + id)
    .then(response => {
      let postAux = response.data
      postAux.ETIQUETAS = response.data.etiquetas.map(pair => pair.NOMB_ETIQUETA)
      let saleAux = false
      if (postAux.oferta.IDEN_OFERTA !== undefined) {
        saleAux = true
      }
      return {
        post: postAux,
        isSale: saleAux
      }
    }).catch(errors => {
      console.log(errors)
    })
}

// Obtener todas las categorías de la api.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: lista todas las publicaciones.
// =======================================================================================
function GETAll (app, pageNumber = 1) {
  return app.$axios.$get(
    'publicacion',
    {
      params: {
        page: pageNumber
      }
    }
  ).then(response => {
    return {
      posts: response.data,
      pagination: response.pagination
    }
  }).catch(errors => {
    console.log(errors)
  })
}

// Enviar POST request a la fuente.
// Param.:       context -> Contiene los objetos instanciados en "data".
// Return:       Retorna los datos del POST response por consola js.
// Constraints:  post {
//                      IDEN_TIPO_PUBLICACION: id (req)
//                      IDEN_CATEGORIA:  id (req)
//                      NOMB_PUBLICACION: string (req | len < 255)
//                      DESC_PUBLICACION: string (req | len < 10.000)
//                      NUMB_PRECIO: int (req | > 0)
//                      FLAG_CONTENIDO_ADULTO: bool
//                    }
// =======================================================================================
function POST (context, blobs = undefined) {
  context.$axios.$post(
    'private/publicacion',
    {
      CODI_TIPO_PUBLICACION: context.post.CODI_TIPO_PUBLICACION,
      IDEN_CATEGORIA: context.post.IDEN_SUBCATEGORIA == null ? context.post.IDEN_CATEGORIA : context.post.IDEN_SUBCATEGORIA,
      NOMB_PUBLICACION: context.post.NOMB_PUBLICACION,
      DESC_PUBLICACION: context.post.DESC_PUBLICACION,
      NUMR_PRECIO: parseInt(context.post.NUMR_PRECIO),
      FLAG_CONTENIDO_ADULTO: context.post.FLAG_CONTENIDO_ADULTO,
      IDEN_EMPRENDEDOR: 1,
      ETIQUETAS: context.post.ETIQUETAS
    }).then(response => {
    console.log(blobs)
    if (blobs !== undefined) {
      imagecontroller.POST(context, response.data.IDEN_PUBLICACION, blobs)
    }
    if (context.isSale) {
      this.addSale(context, response.data.IDEN_PUBLICACION)
        .then(response => {
          context.post = { FLAG_CONTENIDO_ADULTO: false, ETIQUETAS: [] }
        }).catch(errors => {
          context.error = 'Error inesperado al ingresar oferta'
        })
    }
    context.post = { FLAG_CONTENIDO_ADULTO: false }
    context.images = {
      image1: {},
      image2: {},
      image3: {},
      image4: {}
    }
    context.$router.push({ path: '/administracion/publicaciones' })
    context.$notify.success('Se ha agregado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado.')
  })
}

// =======================================================================================
// Enviar PUT request a la fuente. Se utilizó placeholder.
// Param.:       context -> Contexto de la vista .vue, contiene los objetos instanciados en
//               "data".
// Return:       Retorna los datos del PUT response por consola js.
// Constraints:  post {
//                      title:  string (req | len < 255)
//                      body:   string (req | len < 255)
//                      userId: int (req | user-exists)
//                      id:     int (req | post-exists)
//                    }
// =======================================================================================
function PUT (context, blobs = undefined) {
  context.$axios.$put(
    'private/publicacion/' + context.post.IDEN_PUBLICACION,
    {
      IDEN_TIPO_PUBLICACION: context.post.IDEN_TIPO_PUBLICACION,
      IDEN_CATEGORIA: context.post.IDEN_CATEGORIA,
      NOMB_PUBLICACION: context.post.NOMB_PUBLICACION,
      DESC_PUBLICACION: context.post.DESC_PUBLICACION,
      NUMR_PRECIO: context.post.NUMR_PRECIO,
      FLAG_CONTENIDO_ADULTO: context.post.FLAG_CONTENIDO_ADULTO,
      ETIQUETAS: context.post.ETIQUETAS
    }
  ).then(async response => {
    if (context.deletedImages.length > 0) {
      for (let i = 0; i < context.deletedImages.length; i++) {
        await imagecontroller.DELETE(context, response.data.imagenes[i].IDEN_IMAGEN)
      }
    }
    if (blobs !== undefined) {
      imagecontroller.POST(context, response.data.IDEN_PUBLICACION, blobs)
    }
    context.$router.push({ path: '/administracion/publicaciones' })
    context.$notify.success('Se ha editado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado.')
  })
}

function addSale (context, id) {
  context.$axios.$post(
    'private/oferta',
    {
      IDEN_PUBLICACION: parseInt(id),
      FECH_INICIO: moment(new Date(context.sale.FECH_INICIO)).toJSON(),
      FECH_TERMINO: new Date(context.sale.FECH_TERMINO).toJSON(),
      NUMR_PRECIO: parseInt(context.sale.NUMR_PRECIO)
    })
    .then(response => {
      console.log(response)
      context.messageOferta = 'Oferta agregada con éxito'
    })
    .catch(errors => {
      context.error = 'Error al agregar oferta'
    })
}

function updateSale (context, id) {
  context.$axios.$put(
    'private/oferta/' + id,
    {
      IDEN_PUBLICACION: context.sale.IDEN_PUBLICACION,
      FECH_INICIO: moment(new Date(context.sale.FECH_INICIO)).toJSON(),
      FECH_TERMINO: new Date(context.sale.FECH_TERMINO).toJSON(),
      NUMR_PRECIO: parseInt(context.sale.NUMR_PRECIO)
    })
    .then(response => {
      console.log(response)
      context.messageOferta = 'Oferta modificada con éxito'
    })
    .catch(errors => {
      context.error = 'Error al agregar oferta'
    })
}
// comentarios
function setState (context, post) {
  if (!post.FLAG_BAN) {
    context.$axios.$put(
      'private/publicacion/' + post.IDEN_PUBLICACION,
      {
        FLAG_VIGENTE: !post.FLAG_VIGENTE
      }
    ).then(response => {
      post.FLAG_VIGENTE = !post.FLAG_VIGENTE
    }).catch(errors => {
      console.log(errors)
    })
  }
}

export default {
  GET,
  GETAll,
  POST,
  PUT,
  addSale,
  updateSale,
  setState
}
