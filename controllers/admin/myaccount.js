import _ from 'lodash'

// Metodo POST para el registro de los emprendedores
// Registra datos en persona, usuario, emprendedor y contactos.
async function POST (context, user) {
  try {
    // Registro de los datos de persona
    let persona = await context.$axios.$post('/private/persona',
      {
        IDEN_USUARIO: user.IDEN_USUARIO,
        NOMBRES: user.persona.NOMBRES,
        APELLIDO_PATERNO: user.persona.APELLIDO_PATERNO,
        APELLIDO_MATERNO: user.persona.APELLIDO_MATERNO,
        FECH_FECHA_NACIMIENTO: user.persona.FECH_FECHA_NACIMIENTO
      })
    // Registro del cambio de contraseña del usuario
    await context.$axios.$put('/private/usuario/' + user.IDEN_USUARIO,
      {
        DESC_PASSWORD: user.pass,
        FECH_CREACION: new Date()
      })
    // Registro de los datos del emprendedor
    await context.$axios.$put('/private/emprendedor/' + user.emprendedor.IDEN_EMPRENDEDOR,
      {
        DESC_EMPRENDEDOR: user.emprendedor.DESC_EMPRENDEDOR,
        DESC_NOMBRE_FANTASIA: user.emprendedor.DESC_NOMBRE_FANTASIA
      })

    // Registro de la imagen del emprendedor
    const formData = new FormData()
    formData.append('IDEN_EMPRENDEDOR', user.emprendedor.IDEN_EMPRENDEDOR)
    for (let i = 0; i < user.blobs.length; i++) {
      formData.append('avatar', user.blobs[i], 'image' + i + '.png')
    }
    await context.$axios.$post('/private/imagen', formData)

    // Registro de los contactos de la persona
    // Se verifica si se ingresó un teléfono, y de ser así, se registra
    if (user.emprendedor.contacto.TELEFONO && user.emprendedor.contacto.TELEFONO.length > 0) {
      await context.$axios.$post('/private/contacto',
        {
          TIPO_CONTACTO: 'Telefono',
          DESC_CONTACTO: user.emprendedor.contacto.TELEFONO,
          IDEN_PERSONA: persona.data.IDEN_PERSONA
        })
    }
    // Registro del correo
    await context.$axios.$post('/private/contacto',
      {
        TIPO_CONTACTO: 'Correo',
        DESC_CONTACTO: user.emprendedor.contacto.CORREO,
        IDEN_PERSONA: persona.data.IDEN_PERSONA
      })
    // Registro del celular
    await context.$axios.$post('/private/contacto',
      {
        TIPO_CONTACTO: 'Celular',
        DESC_CONTACTO: user.emprendedor.contacto.CELULAR,
        IDEN_PERSONA: persona.data.IDEN_PERSONA
      })
    // Registro de la direccion
    await context.$axios.$post('/private/contacto',
      {
        TIPO_CONTACTO: 'Direccion',
        DESC_CONTACTO: user.emprendedor.contacto.DIRECCION,
        IDEN_PERSONA: persona.data.IDEN_PERSONA
      })

    context.$router.push({ path: '/' })
    context.$notify.success('Se han modificado tus datos exitosamente.')
  } catch (error) {
    console.log(error)
    context.$notify.warning('Ha ocurrido un error inesperado.')
  }
}

function GET (app, id) {
// console.log(sessionStorage)
// let token = sessionStorage.getItem('id_token')
  let user
  return app.$axios.$get('/private/usuario/' + id)
    .then(res => {
      user = res.data
      if (user.persona && user.persona.IDEN_PERSONA) {
        return app.$axios.$get('/private/contacto/' + user.persona.IDEN_PERSONA)
          .then(response => {
            user.persona.contacto = response.data
            console.log(response.data)
            return {
              user
            }
          })
      } else {
        return {
          user
        }
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function PUT (context, user) {
  return context.$axios.$put('/private/persona/' + user.persona.IDEN_PERSONA,
    {
      NOMBRES: user.persona.NOMBRES,
      APELLIDO_PATERNO: user.persona.APELLIDO_PATERNO,
      APELLIDO_MATERNO: user.persona.APELLIDO_MATERNO,
      FECH_FECHA_NACIMIENTO: user.persona.FECH_FECHA_NACIMIENTO
    })
    .then(response => {
      if (user.pass) {
        return context.$axios.$put('/private/usuario/' + user.IDEN_USUARIO,
          {
            DESC_PASSWORD: user.pass
          })
          .then(res => {
            context.$router.push({ path: '/' })
            context.$notify.success('Se han modificado tus datos exitosamente.')
          }).catch(err => {
            if (err) context.$notify.warning('Ha ocurrido un error inesperado.')
          })
      }
      context.$router.push({ path: '/' })
      context.$notify.success('Se han modificado tus datos exitosamente.')
    }).catch(error => {
      if (error) context.$notify.warning('Ha ocurrido un error inesperado.')
    })
}

// Metodo para editar datos del emprendedor.
async function PUTEmprendedor (context) {
  try {
    await context.$axios.$put('/private/persona/' + context.user.persona.IDEN_PERSONA,
      {
        NOMBRES: context.user.persona.NOMBRES,
        APELLIDO_PATERNO: context.user.persona.APELLIDO_PATERNO,
        APELLIDO_MATERNO: context.user.persona.APELLIDO_MATERNO,
        FECH_FECHA_NACIMIENTO: context.user.persona.FECH_FECHA_NACIMIENTO
      })

    if (context.user.pass) {
      await context.$axios.$put('/pivate/usuario/' + context.user.IDEN_USUARIO,
        {
          DESC_PASSWORD: context.user.pass
        })
    }

    await context.$axios.$put('/private/emprendedor/' + context.user.emprendedor.IDEN_EMPRENDEDOR,
      {
        DESC_EMPRENDEDOR: context.user.emprendedor.DESC_EMPRENDEDOR,
        DESC_NOMBRE_FANTASIA: context.user.emprendedor.DESC_NOMBRE_FANTASIA
      })

    // _ -> Libreria externa llamada lodash.
    // Proporciona metodo forEach para recorrer objetos.
    _.forEach(context.contacto, async (contacto, key) => {
      if (contacto.IDEN_CONTACTO && contacto.DESC_CONTACTO.length > 0) {
        await context.$axios.$put('/private/contacto/' + contacto.IDEN_CONTACTO,
          {
            DESC_CONTACTO: contacto.DESC_CONTACTO
          })
      } else if (!contacto.IDEN_CONTACTO && contacto.DESC_CONTACTO.length > 0) {
        await context.$axios.$post('/private/contacto/',
          {
            IDEN_PERSONA: context.user.persona.IDEN_PERSONA,
            TIPO_CONTACTO: key,
            DESC_CONTACTO: contacto.DESC_CONTACTO
          })
      } else if (key === 'Telefono' && contacto.DESC_CONTACTO.length === 0) {
        await context.$axios.$delete('/private/contacto/' + contacto.IDEN_CONTACTO)
      }
    })

    // Actualizacion de la imagen del emprendedor
    const formData = new FormData()
    formData.append('IDEN_EMPRENDEDOR', context.user.emprendedor.IDEN_EMPRENDEDOR)
    for (let i = 0; i < context.user.blobs.length; i++) {
      formData.append('avatar', context.user.blobs[i], 'image' + i + '.png')
    }
    await context.$axios.$put('/private/imagen/' + context.imagen.IDEN_IMAGEN, formData)

    context.$router.push({ path: '/' })
    context.$notify.success('Se han modificado tus datos exitosamente.')
  } catch (error) {
    console.log(error)
    context.$notify.warning('Ha ocurrido un error inesperado.')
  }
}

export default {
  POST,
  GET,
  PUT,
  PUTEmprendedor
}
