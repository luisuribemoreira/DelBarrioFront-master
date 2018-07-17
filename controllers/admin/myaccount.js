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
          TIPO_CONTACTO: 'TELEFONO',
          DESC_CONTACTO: user.emprendedor.contacto.TELEFONO,
          IDEN_PERSONA: persona.data.IDEN_PERSONA
        })
    }
    // Registro del correo
    await context.$axios.$post('/private/contacto',
      {
        TIPO_CONTACTO: 'CORREO',
        DESC_CONTACTO: user.emprendedor.contacto.CORREO,
        IDEN_PERSONA: persona.data.IDEN_PERSONA
      })
    // Registro del celular
    await context.$axios.$post('/private/contacto',
      {
        TIPO_CONTACTO: 'CELULAR',
        DESC_CONTACTO: user.emprendedor.contacto.CELULAR,
        IDEN_PERSONA: persona.data.IDEN_PERSONA
      })
    // Registro de la direccion
    await context.$axios.$post('/private/contacto',
      {
        TIPO_CONTACTO: 'DIRECCION',
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
  return app.$axios.$get('/private/usuario/' + id)
    .then(res => {
      return {
        user: res.data
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

export default {
  POST,
  GET,
  PUT
}
