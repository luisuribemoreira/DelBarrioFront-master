// Retorna las imagenes correspondientes a la ID de un emprendedor en especifico.
function GETByEmprendedor (context, id) {
  return context.$axios.$get('imagen')
    .then(response => {
      let image
      response.data.forEach(images => {
        if (images.IDEN_EMPRENDEDOR === id) image = images
      })
      return {
        image
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function GETAll (context) {
  return context.$axios.get(
    'imagen'
  ).then(response => {
    return {
      imagen: response.data
    }
  })
}

function POST (context, id, blobs) {
  context.error = false
  const formData = new FormData()
  formData.append('IDEN_PUBLICACION', id)
  for (let i = 0; i < blobs.length; i++) {
    formData.append('gallery', blobs[i], 'image' + i + '.png')
  }
  context.$axios.$post(
    'private/imagen',
    formData
  ).then(response => {
    context.post = { FLAG_CONTENIDO_ADULTO: false } // Limpiar campos
    context.images = {
      image1: {},
      image2: {},
      image3: {},
      image4: {}
    }
    context.error = response.error
  }).catch(errors => {
    context.error = true
  })
}

function DELETE (context, id) {
  context.error = false

  context.$axios.$delete(
    'private/imagen/' + id + '/'
  ).then(response => {
    context.error = response.error
  }).catch(errors => {
    context.error = true
  })
}

export default {
  POST,
  DELETE,
  GETAll,
  GETByEmprendedor
}
