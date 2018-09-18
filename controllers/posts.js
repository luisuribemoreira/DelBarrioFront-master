import moment from 'moment'
import imagecontroller from '~/controllers/images'
import entrepeneurController from '~/controllers/admin/entrepreneurs'
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
      return app.$axios.$get('/contacto/' + postAux.emprendedor.usuario.persona.IDEN_PERSONA)
        .then(res => {
          postAux.emprendedor.usuario.persona.contacto = res.data
          return {
            post: postAux,
            isSale: saleAux
          }
        })
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

// Obtener todas las categorías de la api.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: lista todas las publicaciones de un emprendedor.
// =======================================================================================
function GETPostEmprendedor (app, idEmprendedor) {
  return app.$axios.$get(
    'publicacion'
  ).then(response => {
    let postAux = []
    response.data.forEach(ent => {
      if (ent.IDEN_EMPRENDEDOR === idEmprendedor) postAux.push(ent)
    })
    return {
      posts: postAux
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
  entrepeneurController.GETUser(
    context,
    context.loggedUser.id
  ).then(entrepeneur => {
    context.$axios.$post(
      'private/publicacion',
      {
        CODI_TIPO_PUBLICACION: context.post.CODI_TIPO_PUBLICACION,
        IDEN_CATEGORIA: context.post.IDEN_SUBCATEGORIA == null ? context.post.IDEN_CATEGORIA : context.post.IDEN_SUBCATEGORIA,
        NOMB_PUBLICACION: context.post.NOMB_PUBLICACION,
        DESC_PUBLICACION: context.post.DESC_PUBLICACION,
        NUMR_PRECIO: parseInt(context.post.NUMR_PRECIO),
        FLAG_CONTENIDO_ADULTO: context.post.FLAG_CONTENIDO_ADULTO,
        IDEN_EMPRENDEDOR: entrepeneur.entrepeneur.IDEN_EMPRENDEDOR,
        ETIQUETAS: context.post.ETIQUETAS
      }).then(response => {
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
      context.$router.push({ path: '/administracion/publicaciones' })
      context.$notify.success('Se ha agregado exitosamente.')
    })
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
      CODI_TIPO_PUBLICACION: context.post.CODI_TIPO_PUBLICACION,
      IDEN_CATEGORIA: context.post.IDEN_CATEGORIA,
      NOMB_PUBLICACION: context.post.NOMB_PUBLICACION,
      DESC_PUBLICACION: context.post.DESC_PUBLICACION,
      NUMR_PRECIO: parseInt(context.post.NUMR_PRECIO),
      FLAG_CONTENIDO_ADULTO: context.post.FLAG_CONTENIDO_ADULTO,
      ETIQUETAS: context.post.ETIQUETAS
    }
  ).then(async response => {
    if (context.deletedImages.length > 0) {
      for (let i = 0; i < context.deletedImages.length; i++) {
        await imagecontroller.DELETE(context, context.post.imagenes[context.deletedImages[i]].IDEN_IMAGEN)
      }
    }
    if (blobs !== undefined) {
      imagecontroller.POST(context, context.post.IDEN_PUBLICACION, blobs)
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
      context.$notify.success('Oferta agregada con éxito.')
    })
    .catch(errors => {
      context.$notify.danger('Ha ocurrido un error inesperado.')
    })
}

function updateSale (context, id) {
  context.$axios.$put(
    'private/oferta/' + id,
    {
      IDEN_PUBLICACION: context.sale.IDEN_PUBLICACION,
      FECH_INICIO: moment(new Date(context.sale.FECH_INICIO)).toJSON(),
      FECH_TERMINO: new Date(context.sale.FECH_TERMINO).toJSON(),
      NUMR_PRECIO: parseInt(context.sale.NUMR_PRECIO),
      FLAG_VALIDADO: false
    })
    .then(response => {
      console.log(response)
      context.$notify.success('Oferta modificada con éxito.')
    })
    .catch(errors => {
      context.$notify.danger('Ha ocurrido un error inesperado.')
    })
}

function removeSale (context, id) {
  context.$axios.$delete(
    'private/oferta/' + id
  ).then(response => {
    console.log(response)
    context.$notify.success('Se ha eliminado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado.')
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
  GETPostEmprendedor,
  GETAll,
  POST,
  PUT,
  addSale,
  updateSale,
  removeSale,
  setState
}
