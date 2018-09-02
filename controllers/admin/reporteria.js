import controllerDenounces from '~/controllers/admin/denounces'
import controllerPosts from '~/controllers/posts'
import _ from 'lodash'
import moment from 'moment'

/**
 * Compila un listado de las denuncias a publicaciones del ultimo mes
 * @param {*} app - Contexto de la aplicación
 * @returns Encabezados para la tabla de datos y listado de todas las publicaciones denunciadas con sus respectivas denuncias.
 */
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
        5: publicacion.usuario.emprendedor.IDEN_EMPRENDEDOR
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
          5: publicacion.usuario.emprendedor.IDEN_EMPRENDEDOR
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

/**
 * Metodo para compilar todas las publicaciones aprobadas dentro del ultimo mes
 * @param {*} app - Contexto de la aplicación
 * @returns Encabezados para tabla de datos y listado de las publicaciones aprobadas dentro del ultimo mes
 */
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

/**
 * Metodo para compilar todas las publicaciones rechazadas dentro del ultimo mes
 * @param {*} app - Contexto de la aplicación
 * @returns Encabezados para tabla de datos y listado de las publicaciones rechazadas dentro del ultimo mes
 */
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

/**
 * Compila un listado de publicaciones pertenecientes a un emprendedor ordenadas de forma descendiente por la cantidad de visitas
 * @param {*} app -  Contexto de la aplicación
 * @returns Encabezados para la tabla de datos y listado de productos del emprendedor ordenados por visitas
 */
async function productosPorVisitas (app) {
  let reportData = []
  let headers = ['#', 'ID Publicación', 'Título Publicación', 'Visitas', 'Fecha De Creación', 'Estado']
  let posts = (await controllerPosts.GETPostEmprendedor(app, app.user.emprendedor.IDEN_EMPRENDEDOR)).posts
  posts.forEach(post => {
    let obj = {
      1: post.IDEN_PUBLICACION,
      2: post.NOMB_PUBLICACION,
      3: post.NUMR_CONTADOR,
      4: moment(post.FECH_CREACION).format('DD-MM-YYYY'),
      5: post.FLAG_BAN ? 'Baneada' : 'Activa'
    }
    reportData.push(obj)
  })

  // Ordenar por cantidad de visitas, descendiente.
  reportData.sort(function (a, b) {
    if (a[3] > b[3]) return -1
    if (a[3] < b[3]) return 1
    if (a[3] === b[3]) return 0
  })

  // Se verifica si el nuevo arreglo es identico al que ya existe, para evitar duplicidad de datos
  if (app.reportData.length > 0 && _.isEqual(reportData, app.reportData)) return -1
  return {
    reportData,
    headers
  }
}

/**
 * Compila un listado de publicaciones pertenecientes a un emprendedor ordenadas de forma descendiente por la valoracion
 * @param {*} app - Contexto de la aplicación
 * @returns Encabezados para la tabla de datos y listado de publicaciones del emprendedor ordenados por valoracion
 */
async function productosPorValoracion (app) {
  let reportData = []
  let headers = ['#', 'ID Publicación', 'Título Publicación', 'Valoración', 'Fecha De Creación', 'Estado']
  let posts = (await controllerPosts.GETPostEmprendedor(app, app.user.emprendedor.IDEN_EMPRENDEDOR)).posts
  posts.forEach(post => {
    let obj = {
      1: post.IDEN_PUBLICACION,
      2: post.NOMB_PUBLICACION,
      3: post.NUMR_CALIFICACION,
      4: moment(post.FECH_CREACION).format('DD-MM-YYYY'),
      5: post.FLAG_BAN ? 'Baneada' : 'Activa'
    }
    reportData.push(obj)
  })

  // Ordenar por valoración, descendiente.
  reportData.sort(function (a, b) {
    if (a[3] > b[3]) return -1
    if (a[3] < b[3]) return 1
    if (a[3] === b[3]) return 0
  })

  // Se verifica si el nuevo arreglo es identico al que ya existe, para evitar duplicidad de datos
  if (app.reportData.length > 0 && _.isEqual(reportData, app.reportData)) return -1
  return {
    reportData,
    headers
  }
}

/**
 * Compila un listado de publicaciones pertenecientes a un emprendedor ordenadas de forma descendiente por la cantidad de comentarios
 * con sus comentarios respectivos.
 * @param {*} app - Contexto de la aplicación
 * @returns Encabezados de la tabla de datos y listado de productos por cantidad de comentarios y sus comentarios respectivos.
 */
async function comentariosPorProducto (app) {
  let reportData = []
  let headers = ['#', 'ID Publicación', 'Título Publicación / Usuario', 'Cantidad Comentarios / Descripción', 'Fecha De Creación', 'Estado']
  let posts = (await controllerPosts.GETPostEmprendedor(app, app.user.emprendedor.IDEN_EMPRENDEDOR)).posts
  posts.forEach(post => {
    if (post.comentarios.length > 0) {
      let comentarios = []
      post.comentarios.forEach(comentario => {
        // Devuelve los milisegundos desde el 1 de Enero de 1970 hasta la fecha ingresada.
        // 31 dias en milisegundos -> 2678400000
        let fechaEnMS = moment(comentario.FECH_CREACION).valueOf()
        let actualEnMS = moment().valueOf()
        // Verifica que la fecha de aprobación esté dentro de un rango de 31 días
        if (actualEnMS - fechaEnMS <= 2678400000) {
          let obj = {
            1: '-',
            2: comentario.usuario.emprendedor.IDEN_EMPRENDEDOR
              ? comentario.usuario.emprendedor.DESC_NOMBRE_FANTASIA
              : comentario.usuario.persona.NOMBRES + ' ' + comentario.usuario.persona.APELLIDO_MATERNO + ' ' + comentario.usuario.persona.APELLIDO_PATERNO,
            3: comentario.DESC_COMENTARIO.length > 50 ? comentario.DESC_COMENTARIO.substring(0, 50) + '...' : comentario.DESC_COMENTARIO,
            4: moment(comentario.FECH_CREACION).format('DD-MM-YYYY'),
            5: comentario.FLAG_BAN ? 'Baneado' : 'Activo'
          }
          comentarios.push(obj)
        }
      })

      let obj = {
        1: post.IDEN_PUBLICACION,
        2: post.NOMB_PUBLICACION,
        3: comentarios.length,
        4: moment(post.FECH_CREACION).format('DD-MM-YYYY'),
        5: post.FLAG_BAN ? 'Baneada' : 'Activa',
        6: comentarios
      }
      reportData.push(obj)
    }
  })

  // Ordenar por valoración, descendiente.
  reportData.sort(function (a, b) {
    if (a[3] > b[3]) return -1
    if (a[3] < b[3]) return 1
    if (a[3] === b[3]) return 0
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
  publicacionesRechazadas,
  productosPorVisitas,
  productosPorValoracion,
  comentariosPorProducto
}
