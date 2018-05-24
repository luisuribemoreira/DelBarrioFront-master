function GETAll (app) {
  return app.$axios.$get('private/denuncia')
    .then(response => {
      return {
        publicaciones: response.data.filter(data => { return data.IDEN_PUBLICACION != null }),
        comentarios: response.data.filter(data => { return data.IDEN_COMENTARIO != null }),
        calificaciones: response.data.filter(data => { return data.IDEN_CALIFICACION != null })
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function ratingDenounce (context) {
  context.$axios.$post(
    'private/denuncia',
    {
      IDEN_CALIFICACION: context.iden,
      IDEN_MOTIVO_DENUNCIA: context.denounce.IDEN_MOTIVO_DENUNCIA,
      DESC_DENUNCIA: context.denounce.DESC_DENUNCIA
    }
  ).then(response => {
    context.$notify.success('Se ha enviado tu denuncia.')
  }).catch(errors => {
    context.message = errors.response.data.data.message ? errors.response.data.data.message : 'Error inesperado'
  })
}

function postDenounce (context) {
  context.$axios.$post(
    'private/denuncia',
    {
      IDEN_PUBLICACION: context.post.IDEN_PUBLICACION,
      IDEN_MOTIVO_DENUNCIA: context.denounce.IDEN_MOTIVO_DENUNCIA,
      DESC_DENUNCIA: context.denounce.DESC_DENUNCIA
    }
  ).then(response => {
    context.$notify.success('Se ha enviado tu denuncia.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error. Vuelve a intentarlo más tarde.')
  })
}

function commentDenounce (context) {
  context.$axios.$post(
    'private/denuncia',
    {
      IDEN_COMENTARIO: context.iden,
      IDEN_MOTIVO_DENUNCIA: context.denounce.IDEN_MOTIVO_DENUNCIA,
      DESC_DENUNCIA: context.denounce.DESC_DENUNCIA
    }
  ).then(response => {
    context.$notify.success('Se ha enviado tu denuncia.')
  }).catch(errors => {
    context.message = errors.response.data.data.message ? errors.response.data.data.message : 'Error inesperado'
  })
}

function POST (context) {
  parseInt(context.iden)
  if (context.denounce.IDEN_MOTIVO_DENUNCIA == null) {
    context.error = 'Seleccione motivo de denuncia'
  } else {
    parseInt(context.denounce.IDEN_MOTIVO_DENUNCIA)
    if (context.type === 'pub') {
      this.postDenounce(context)
    } else {
      if (context.type === 'com') {
        this.commentDenounce(context)
      } else {
        this.ratingDenounce(context)
      }
    }
  }
}

export default {
  GETAll,
  POST,
  commentDenounce,
  postDenounce,
  ratingDenounce
}
