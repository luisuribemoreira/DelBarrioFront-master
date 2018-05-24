function GETAll (app) {
  return app.$axios.$get('private/resolucion_denuncia')
    .then(response => {
      return {
        resolucion: response.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

// Enviar POST request a la fuente.
// Param.:       context -> Contiene los objetos instanciados en "data".
// Return:       Retorna los datos del POST response por consola js.
// Constraints:  post {
//                      title: string (req | len < 255)
//                      body:  string (req | len < 255)
//                    }
// =======================================================================================

function POST (context) {
  // Generar objeto Dummy
  let dummyEntity = {
    DESC_RESOLUCION: context.denounceresolution.DESC_RESOLUCION,
    FECH_CREACION: new Date().toJSON(),
    IDEN_DENUNCIA: context.denouncedetail.IDEN_DENUNCIA,
    IDEN_RESOLUCION_DENUNCIA: 0,
    IDEN_USUARIO: context.loggedUser.id
  }
  // Vaciar el campo de resolución de denuncia
  context.denounceresolution.DESC_RESOLUCION = ''
  // Agregar objeto dummy donde corresponda para que se refleje de forma instantánea (si el default molesta, cambiar el switch por if's)
  switch (context.type) {
    case 'pub':
      (context.publicaciones.find(pub => { return pub.IDEN_DENUNCIA === dummyEntity.IDEN_DENUNCIA })).resolucion_denuncia = dummyEntity
      break
    case 'com':
      (context.comentarios.find(com => { return com.IDEN_DENUNCIA === dummyEntity.IDEN_DENUNCIA })).resolucion_denuncia = dummyEntity
      break
    case 'cal':
      (context.calificaciones.find(cal => { return cal.IDEN_DENUNCIA === dummyEntity.IDEN_DENUNCIA })).resolucion_denuncia = dummyEntity
      break
    default:
      // Do nothing
      break
  }
  context.$axios.$post(
    'private/resolucion_denuncia',
    {
      IDEN_USUARIO: dummyEntity.IDEN_USUARIO,
      IDEN_DENUNCIA: dummyEntity.IDEN_DENUNCIA,
      DESC_RESOLUCION: dummyEntity.DESC_RESOLUCION
    }
  ).then(response => {
    if (context.isBan) {
      context.id = context.denouncedetail.IDEN_PUBLICACION ? context.denouncedetail.IDEN_PUBLICACION : context.denouncedetail.IDEN_CALIFICACION ? context.denouncedetail.IDEN_CALIFICACION : context.denouncedetail.IDEN_COMENTARIO
      context.model = context.denouncedetail.IDEN_PUBLICACION ? 'publicacion' : context.denouncedetail.IDEN_CALIFICACION ? 'calificacion' : 'comentario'
      this.ban(context)
    } else {
      context.$notify.success('Se ha resuelto denuncia.')
    }
  }).catch(errors => {
    console.log(errors)
    // Limpiar objeto dummy
    switch (context.type) {
      case 'pub':
        (context.publicaciones.find(pub => { return pub.IDEN_DENUNCIA === dummyEntity.IDEN_DENUNCIA })).resolucion_denuncia = {}
        break
      case 'com':
        (context.comentarios.find(com => { return com.IDEN_DENUNCIA === dummyEntity.IDEN_DENUNCIA })).resolucion_denuncia = {}
        break
      case 'cal':
        (context.calificaciones.find(cal => { return cal.IDEN_DENUNCIA === dummyEntity.IDEN_DENUNCIA })).resolucion_denuncia = {}
        break
      default:
        // Do nothing
        break
    }
    context.$notify.danger('Error. Intente más tarde.')
  })
}

function ban (context) {
  console.log('private/' + context.model + '/' + context.id)
  context.$axios.$put(
    'private/' + context.model + '/' + context.id,
    {
      FLAG_BAN: true
    }
  ).then(response => {
    context.$notify.success('Se ha resuelto denuncia.')
  }).catch(errors => {
    context.$notify.danger('Error. Intente más tarde.')
  })
}

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
function PUT (context) {
  context.$axios.$put(
    'private/denuncia/' + context.id,
    {
      NOMB_CATEGORIA: context.category.NOMB_CATEGORIA,
      IDEN_CATEGORIA_PADRE: context.category.IDEN_CATEGORIA_PADRE
    }
  ).then(response => {
    context.$notify.success('Editado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Intenta más tarde.')
  })
}

export default {
  GETAll,
  POST,
  PUT,
  ban
}
