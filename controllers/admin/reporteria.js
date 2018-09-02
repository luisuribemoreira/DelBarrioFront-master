import controllerDenounces from '~/controllers/admin/denounces'
import controllerPosts from '~/controllers/posts'
import _ from 'lodash'
import moment from 'moment'

async function denunciasPublicaciones (app) {
  let reportData = []
  let headers = ['#', 'ID Publicación', 'Publicacion', 'Cantidad Denuncias / Descripcion', 'Dueño Publicacion / Denunciante']
  let publicaciones = (await controllerDenounces.GETAll(app)).publicaciones

  publicaciones.forEach((publicacion) => {
    // Se comprueba si el item ya esta en el arreglo
    let hasItem = _.find(reportData, ['1', publicacion.publicacion.IDEN_PUBLICACION])
    if (hasItem) {
      // Si el item si esta, se busca su indice
      let index = reportData.findIndex(item => item[1] === publicacion.publicacion.IDEN_PUBLICACION)
      // Se le suma 1 a la cantidad de denuncias, puesto que al haber sido ingresado ya poseia al menos 1.
      reportData[index][3] = hasItem[3] + 1

      // Objeto para ingresar las denuncias con sus respectivas descripciones y el nombre del usuario que la realizó.
      let denuncia = {
        1: '-',
        2: '-',
        3: '-',
        4: publicacion.DESC_DENUNCIA,
        5: publicacion.usuario.persona.IDEN_PERSONA
          ? publicacion.usuario.persona.NOMBRES + ' ' + publicacion.usuario.persona.APELLIDO_MATERNO + ' ' + publicacion.usuario.persona.APELLIDO_PATERNO
          : publicacion.usuario.emprendedor.DESC_NOMBRE_FANTASIA
      }
      // Se inserta al arreglo de denuncias la nueva denuncia.
      reportData[index][5].push(denuncia)
    } else {
      // Devuelve los milisegundos desde el 1 de Enero de 1970 hasta la fecha ingresada.
      // 31 dias en milisegundos -> 2678400000
      let fechaEnMS = moment(publicacion.FECH_CREACION).valueOf()
      let actualEnMS = moment().valueOf()
      // Verifica que la fecha de creación esté dentro de un rango de 31 días
      if (actualEnMS - fechaEnMS <= 2678400000) {
        let denuncias = []
        let denuncia = {
          1: '-',
          2: '-',
          3: '-',
          4: publicacion.DESC_DENUNCIA,
          5: publicacion.usuario.persona.IDEN_PERSONA
            ? publicacion.usuario.persona.NOMBRES + ' ' + publicacion.usuario.persona.APELLIDO_MATERNO + ' ' + publicacion.usuario.persona.APELLIDO_PATERNO
            : publicacion.usuario.emprendedor.DESC_NOMBRE_FANTASIA
        }
        denuncias.push(denuncia)
        reportData.push({
          1: publicacion.publicacion.IDEN_PUBLICACION,
          2: publicacion.publicacion.NOMB_PUBLICACION,
          3: 1,
          4: publicacion.publicacion.emprendedor.DESC_NOMBRE_FANTASIA,
          5: denuncias
        })
      }
    }
  })

  // Se verifica si el nuevo arreglo es identico al que ya existe, para evitar duplicidad de datos
  if (app.reportData.length > 0 && _.isEqual(reportData, app.reportData)) return -1
  return {
    reportData,
    headers
  }
}

async function publicacionesAprobadas (app) {
  let reportData = []
  let headers = ['#', 'ID Publicación', 'Título Publicación', 'Fecha de Aprobación']
  let posts = (await controllerPosts.GETAll(app)).posts
  posts.forEach(post => {
    if (post.FECH_APROBACION) {
      // Devuelve los milisegundos desde el 1 de Enero de 1970 hasta la fecha ingresada.
      // 31 dias en milisegundos -> 2678400000
      let fechaEnMS = moment(post.FECH_APROBACION).valueOf()
      let actualEnMS = moment().valueOf()
      // Verifica que la fecha de aprobación esté dentro de un rango de 31 días
      if (actualEnMS - fechaEnMS <= 2678400000) {
        let obj = {
          1: post.IDEN_PUBLICACION,
          2: post.NOMB_PUBLICACION,
          3: moment(post.FECH_APROBACION).format('DD-MM-YYYY')
        }
        reportData.push(obj)
      }
    }
  })

  // Se verifica si el nuevo arreglo es identico al que ya existe, para evitar duplicidad de datos
  if (app.reportData.length > 0 && _.isEqual(reportData, app.reportData)) return -1
  return {
    reportData,
    headers
  }
}

async function publicacionesRechazadas (app) {
  let reportData = []
  let headers = ['#', 'ID Publicación', 'Título Publicación', 'Fecha de Rechazo']
  let posts = (await controllerPosts.GETAll(app)).posts
  posts.forEach(post => {
    if (post.FECH_RECHAZO) {
      // Devuelve los milisegundos desde el 1 de Enero de 1970 hasta la fecha ingresada.
      // 31 dias en milisegundos -> 2678400000
      let fechaEnMS = moment(post.FECH_RECHAZO).valueOf()
      let actualEnMS = moment().valueOf()
      // Verifica que la fecha de aprobación esté dentro de un rango de 31 días
      if (actualEnMS - fechaEnMS <= 2678400000) {
        let obj = {
          1: post.IDEN_PUBLICACION,
          2: post.NOMB_PUBLICACION,
          3: moment(post.FECH_RECHAZO).format('DD-MM-YYYY')
        }
        reportData.push(obj)
      }
    }
  })

  // Se verifica si el nuevo arreglo es identico al que ya existe, para evitar duplicidad de datos
  if (app.reportData.length > 0 && _.isEqual(reportData, app.reportData)) return -1
  return {
    reportData,
    headers
  }
}

export default {
  denunciasPublicaciones,
  publicacionesAprobadas,
  publicacionesRechazadas
}
