// Enviar GET request a la fuente
// Param.: context -> Contiene todos los objetos instanciados en "data".
// Return: Retorna los datos del GET response
function GET (context) {
  return context.$axios.$get('private/calificacion')
    .then(response => {
      return {
        calificaciones: response.data
      }
    }).catch(errors => {
      context.$notify.danger('Ha ocurrido un error inesperado')
    })
}

// Enviar POST request a la fuente.
// Param.:       context -> Contiene los objetos instanciados en "data".
// Return:       Retorna los datos del POST response por consola js.
// Constraints:  post {
//                    }
// =======================================================================================
function POST (context) {
  // Creación de objeto dummy para simular respuesta instantánea del server
  let dummyEntity = {
    IDEN_PUBLICACION: context.post.IDEN_PUBLICACION,
    DESC_CALIFICACION: context.rating.DESC_CALIFICACION,
    NUMR_VALOR: parseInt(context.rating.NUMR_VALOR),
    FECH_CREACION: new Date()
  }
  // Agregar objeto dummy al comienzo del array de comentarios
  context.post.calificaciones.unshift(dummyEntity)
  context.$scrollTo('#rating')
  context.$axios.$post(
    'private/calificacion',
    {
      IDEN_PUBLICACION: context.post.IDEN_PUBLICACION,
      DESC_CALIFICACION: context.rating.DESC_CALIFICACION,
      NUMR_VALOR: context.rating.NUMR_VALOR
    }).then(response => {
    context.rating = {
      FECH_CREACION: dummyEntity.FECH_CREACION,
      IDEN_CALIFICACION: response.data.IDEN_CALIFICACION,
      NUMR_VALOR: dummyEntity.NUMR_VALOR,
      DESC_CALIFICACION: dummyEntity.DESC_CALIFICACION
    }
    context.$notify.success('Calificación enviada.')
  }).catch(errors => {
    // Eliminar el objeto dummy del arreglo en caso de errores server-side
    context.post.calificaciones.shift()
    // Volver a poner valor en el campo de calificación
    context.rating = {
      NUMR_VALOR: dummyEntity.NUMR_VALOR
    }
    context.$scrollTo('#calificaciones')
    // Notificación
    context.$notify.danger('Lo sentimos, ha ocurrido un error. Inténtalo más tarde')
  })
}

function PUT (context, id) {
  let dummyEntity = {
    IDEN_PUBLICACION: context.post.IDEN_PUBLICACION,
    DESC_CALIFICACION: context.rating.DESC_CALIFICACION,
    NUMR_VALOR: parseInt(context.rating.NUMR_VALOR),
    FECH_CREACION: context.rating.FECH_CREACION,
    IDEN_CALIFICACION: context.rating.IDEN_CALIFICACION
  }
  context.$axios.$put(
    'private/calificacion/' + id,
    {
      DESC_CALIFICACION: context.rating.DESC_CALIFICACION,
      NUMR_VALOR: context.rating.NUMR_VALOR
    }).then(() => {
    let calificacionAux = context.post.calificaciones.find(calificacion => calificacion.IDEN_CALIFICACION === id)
    let index = context.post.calificaciones.indexOf(calificacionAux)
    context.post.calificaciones.splice(index, 1)
    context.post.calificaciones.push(dummyEntity)
    context.rating = {
      FECH_CREACION: dummyEntity.FECH_CREACION,
      IDEN_CALIFICACION: dummyEntity.IDEN_CALIFICACION,
      NUMR_VALOR: dummyEntity.NUMR_VALOR,
      DESC_CALIFICACION: dummyEntity.DESC_CALIFICACION
    }
    context.$scrollTo('#rating')
    context.$notify.success('Calificación enviada.')
  }).catch(errors => {
    context.$scrollTo('#calificaciones')
    context.rating = dummyEntity
    // Notificación
    context.$notify.danger('Lo sentimos, ha ocurrido un error. Inténtalo más tarde')
  })
}

export default {
  GET,
  POST,
  PUT
}
