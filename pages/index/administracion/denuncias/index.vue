<template>
  <section id="admin-denuncias" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center py-1">Denuncias</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 offset-md-4 col-md-6 offset-sm-3 py-1">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model.trim="search" placeholder="Buscar por Motivo de Denuncia..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscador()">
            <div class="input-group-btn">
              <icon name="search"></icon>
            </div>
          </div>
        </div>
      </div>        
      <div class="row margin-top">
        <div class="col-12 table-responsive">
          <div>
            <!-- Nav tabs -->
            <ul class="nav nav-tabs" role="tablist">
              <li role="presentation" class="nav-item"><a href="#item1" class="nav-link active show"  aria-controls="item1" aria-selected="true" role="tab" data-toggle="tab">Publicaciones</a></li>
              <li role="presentation" class="nav-item"><a href="#item2" class="nav-link" aria-controls="item2" role="tab" data-toggle="tab">Comentarios</a></li>
              <li role="presentation" class="nav-item"><a href="#item3" class="nav-link" aria-controls="item3" role="tab" data-toggle="tab">Calificaciones</a></li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
              <!-- PUBLICACIONES -->
              <div role="tabpanel" class="tab-pane active" id="item1">
                <table class="table table-hover">
                  <thead>
                    <tr class="text-center">
                      <th>Publicación</th>
                      <th>Fecha</th>
                      <th>Denunciante</th>
                      <th>Motivo</th>
                      <th>Resolución</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="denounce in paginatedPosts[paginationPosts]" :key="denounce.IDEN_DENUNCIA">
                      <td>
                        <nuxt-link :to="'/publicaciones/'+ denounce.publicacion.IDEN_PUBLICACION">{{denounce.publicacion.NOMB_PUBLICACION.substring(0,10)}}</nuxt-link>
                      </td>
                      <td>{{denounce.FECH_CREACION | dateFormat}}</td>
                      <td>{{denounce.usuario.EMAIL_USUARIO}}</td>
                      <td>{{denounce.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.substring(0,10) + "..."}}</td>
                      <td>
                        <p class="label label-success" v-if="Object.keys(denounce.resolucion_denuncia).length !== 0">Resuelto</p>
                        <p class="label label-warning" v-else>Pendiente</p>
                      </td>
                      <td>
                          <a href="#" class="btn btn-tabla" data-toggle="modal" data-target= "#modal" @click="denouncedetail = denounce, open = false, type='pub'">Ver detalle</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                   <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <!-- Solo permite retroceder si la pagina actual es mayor a 0 -->
                <span aria-label="Previous" v-on:click="paginationPosts > 0 ? paginationPosts-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <!-- Se crea la paginacion al pie de pagina. Se usa page - 1 ya que pagination debe apuntar a los indices del arreglo, por lo que parte de 0 -->
              <li class="page-item" v-bind:key="page" v-for="page in paginatedPosts.length">
                <!-- Si la pagina actual es igual a la clickeada, esta se ennegrece -->
                <span class="page-link" v-bind:class="{ 'font-weight-bold' : paginationPosts === page - 1 }" v-on:click="paginationPosts = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <!-- Solo permite avanzar si la pagina actual es inferior a la cantidad de paginas totales - 1 -->
                <span aria-label="Next" v-on:click="paginationPosts < paginatedPosts.length - 1 ? paginationPosts++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav>
              </div>
              <!-- COMENTARIOS-->
              <div role="tabpanel" class="tab-pane" id="item2">
                <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Denunciante</th>
                        <th>Motivo</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="denounce in paginatedComments[paginationComments]" :key="denounce.IDEN_DENUNCIA">
                        <td>{{denounce.FECH_CREACION | dateFormat}}</td>
                        <td>{{denounce.usuario.EMAIL_USUARIO}}</td>
                        <td>{{denounce.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.substring(0,10) + "..."}}</td>
                        <td>{{denounce.DESC_DENUNCIA.substring(0,10) + "..."}}</td>
                        <td>
                          <p class="label label-success" v-if="Object.keys(denounce.resolucion_denuncia).length !== 0">Resuelto</p>
                          <p class="label label-warning" v-else>Pendiente</p>
                        </td>
                        <td>
                            <a href="#" class="btn btn-tabla" data-toggle="modal" data-target= "#modal" @click="denouncedetail = denounce, open = false, type='com'">Ver detalle</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                     <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <!-- Solo permite retroceder si la pagina actual es mayor a 0 -->
                <span aria-label="Previous" v-on:click="paginationComments > 0 ? paginationComments-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <!-- Se crea la paginacion al pie de pagina. Se usa page - 1 ya que pagination debe apuntar a los indices del arreglo, por lo que parte de 0 -->
              <li class="page-item" v-bind:key="page" v-for="page in paginatedComments.length">
                <!-- Si la pagina actual es igual a la clickeada, esta se ennegrece -->
                <span class="page-link" v-bind:class="{ 'font-weight-bold' : paginationComments === page - 1 }" v-on:click="paginationComments = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <!-- Solo permite avanzar si la pagina actual es inferior a la cantidad de paginas totales - 1 -->
                <span aria-label="Next" v-on:click="paginationComments < paginatedComments.length - 1 ? paginationComments++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav>
              </div>
              <!-- CALIFICACIONES -->
              <div role="tabpanel" class="tab-pane" id="item3">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Denunciante</th>
                      <th>Motivo</th>
                      <th>Descripción</th>
                      <th>Resolución</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="denounce in paginatedRatings[paginationRatings]" :key="denounce.IDEN_DENUNCIA">
                      <td>{{denounce.FECH_CREACION | dateFormat}}</td>
                      <td>{{denounce.usuario.EMAIL_USUARIO}}</td>
                      <td>{{denounce.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.substring(0,10) + "..."}}</td>
                      <td>{{denounce.DESC_DENUNCIA.substring(0,10) + "..."}}</td>
                      <td>
                        <p class="label label-success" v-if="Object.keys(denounce.resolucion_denuncia).length !== 0">Resuelto</p>
                        <p class="label label-warning" v-else>Pendiente</p>
                      </td>
                      <td>
                        <a href="#" class="btn btn-tabla" data-toggle="modal" data-target= "#modal" @click="denouncedetail = denounce, open = false, type='cal'"> Ver detalle</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                   <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <!-- Solo permite retroceder si la pagina actual es mayor a 0 -->
                <span aria-label="Previous" v-on:click="paginationRatings > 0 ? paginationRatings-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <!-- Se crea la paginacion al pie de pagina. Se usa page - 1 ya que pagination debe apuntar a los indices del arreglo, por lo que parte de 0 -->
              <li class="page-item" v-bind:key="page" v-for="page in paginatedRatings.length">
                <!-- Si la pagina actual es igual a la clickeada, esta se ennegrece -->
                <span class="page-link" v-bind:class="{ 'font-weight-bold' : paginationRatings === page - 1 }" v-on:click="paginationRatings = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <!-- Solo permite avanzar si la pagina actual es inferior a la cantidad de paginas totales - 1 -->
                <span aria-label="Next" v-on:click="paginationRatings < paginatedRatings.length - 1 ? paginationRatings++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav>
              </div>
          </div>
          </div>
        </div>
      </div>
    </div><!-- /container -->

    <!--MODAL-->
    <!-- DETALLE DENUNCIA -->
    <div class="modal fade" id="modal" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button ref="dismissModal" type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Detalle de denuncia</h4>
          </div>
          <div class="modal-body">
            <!-- DATOS DEL DENUNCIANTE -->
            <label><b>Email de denunciante</b></label>
            <p>{{denouncedetail.usuario.EMAIL_USUARIO}}</p>
            <label><b>Nombre de denunciante</b></label>
            <p>{{Object.keys(denouncedetail.usuario.persona && denouncedetail.usuario.persona).length !== 0? denouncedetail.usuario.persona.NOMBRES + ' ' + denouncedetail.usuario.persona.APELLIDO_PATERNO : denouncedetail.usuario.emprendedor.DESC_NOMBRE_EMPRESA}}</p>
            <!-- DATOS DE LA PUBLICACIÓN, COMENTARIO O CALIFICACIÓN DENUNCIADOS -->
            <div v-if="denouncedetail.publicacion && Object.keys(denouncedetail.publicacion).length !== 0">
              <label><b>Publicación</b></label>
              <p>{{denouncedetail.publicacion.NOMB_PUBLICACION}}</p>
            </div>
            <div v-if="denouncedetail.comentario && Object.keys(denouncedetail.comentario).length !== 0">
              <label><b>Comentario</b></label>
              <p>{{denouncedetail.comentario.DESC_COMENTARIO}}</p>
            </div>
            <div v-if="denouncedetail.calificacion && Object.keys(denouncedetail.calificacion).length !== 0">
              <label><b>Texto de calificación</b></label>
              <p v-if="denouncedetail.calificacion.DESC_CALIFICACION">{{denouncedetail.calificacion.DESC_CALIFICACION}}</p>
              <p v-else><i>No posee</i></p>
            </div>
            <label><b>Fecha de creación</b></label>
            <p>{{denouncedetail.FECH_CREACION | dateFormat}}</p>
            <label><b>Motivo de denuncia</b></label>
            <p>{{denouncedetail.motivo_denuncia.NOMB_MOTIVO_DENUNCIA}}</p>
            <label><b>Descripción de la denuncia</b></label>
            <p>{{denouncedetail.DESC_DENUNCIA}}</p>
            <hr class="margin-top">
            <!-- RESOLUCIÓN DE LA DENUNCIA (SI EXISTE) -->
            <div v-if="denouncedetail.resolucion_denuncia && denouncedetail.resolucion_denuncia.usuario">
              <h4>Resolución de denuncia</h4>
              <label><b>Fecha de resolución</b></label>
              <p>{{denouncedetail.resolucion_denuncia.FECH_CREACION | dateFormat}}</p>
              <label><b>Administrador a cargo</b></label>
              <p>{{denouncedetail.resolucion_denuncia.usuario.persona.NOMBRES +' '+ denouncedetail.resolucion_denuncia.usuario.persona.APELLIDO_PATERNO}} ({{denouncedetail.resolucion_denuncia.usuario.EMAIL_USUARIO}})</p>
              <label><b>Descripción</b></label>
              <p>{{denouncedetail.resolucion_denuncia.DESC_RESOLUCION}}</p>
            </div>
            <!-- SI NO EXISTE DENUNCIA, FORMULARIO DE RESOLUCIÓN -->
            <div v-else>
              <h4 class="margin-top">Resolver denuncia</h4>
              <form @submit.prevent="validate">
                <div class="form-group">
                  <div class="checkbox">
                    <label class="px-1"><input type="radio" name="resolucion" required v-on:click="isBan=true" />Banear {{ type == 'pub' ? 'publicación' : type == 'com' ? 'comentario' : 'calificación' }} </label>
                    <label><input type="radio" name="resolucion" v-on:click="isBan=false" required/> Descartar {{ type == 'pub' ? 'publicación' : type == 'com' ? 'comentario' : 'calificación' }}</label>

                  </div>
                </div>
                <div class="form-group">
                  <label for="description">Descripción</label>
                  <textarea v-validate data-vv-rules="required|min:5|max:250" data-vv-as="descripción" name="description" v-model.trim="denounceresolution.DESC_RESOLUCION" class="form-control"></textarea>
                  <small :class="denounceresolution.DESC_RESOLUCION.length > 250 ? 'text-danger' : ''">{{ denounceresolution.DESC_RESOLUCION.length }} de 250</small>
                  <small class="text-danger" v-show="errors.has('description')"><p>{{ errors.first('description') }}</p></small>
                </div>
                <button class="btn btn-default" type="submit">Subir</button>
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Volver</button>
          </div>
        </div>
      </div>
    </div>
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import controller from '~/controllers/admin/denounces'
import resolutioncontroller from '~/controllers/admin/denounceresolutions'
import moment from 'moment'
import emailer from '~/controllers/admin/emailer'
import customPaginator from '~/controllers/custompaginator'
import { mapGetters } from 'vuex'

export default {
  async asyncData ({ app }) {
    let denounces = await controller.GETAll(app)
    let paginatedPosts = (await customPaginator.paginate(denounces.publicaciones)).paginatedData
    let paginatedComments = (await customPaginator.paginate(denounces.comentarios)).paginatedData
    let paginatedRatings = (await customPaginator.paginate(denounces.calificaciones)).paginatedData

    return {
      publicaciones: denounces.publicaciones,
      comentarios: denounces.comentarios,
      calificaciones: denounces.calificaciones,
      paginatedPosts,
      paginatedComments,
      paginatedRatings
    }
  },
  data () {
    return {
      denouncedetail: { usuario: { emprendedor: {}, persona: {} }, publicacion: {}, motivo_denuncia: {}, calificacion: {}, resolucion_denuncia: {} },
      open: false,
      denounceresolution: {DESC_RESOLUCION: ''},
      type: '',
      isBan: false,
      publicaciones: [],
      comentarios: [],
      calificaciones: [],
      paginatedPosts: [],
      paginatedComments: [],
      paginatedRatings: [],
      search: '',
      postsAux1: [],
      postsAux2: [],
      postsAux3: [],
      paginationPosts: 0,
      paginationComments: 0,
      paginationRatings: 0,
      processing: false
    }
  },
  computed: mapGetters([
    'loggedUser'
  ]),
  methods: {
    setState: client => {
      controller.setState(this, client)
    },
    buscador () {
      // Filtra por cada tabpanel activo
      this.buscarPublicacion()
      this.buscarComentario()
      this.buscarCalificacion()
    },
    async buscarPublicacion () {
      // Copiar todas las denuncias de publicaciones, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux1.length === 0) {
        this.postsAux1 = this.paginatedPosts
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todas las denuncias de publicaciones en que el Motivo de denuncia o parte de ellos posea el texto escrito en el buscador
        let postAux = this.publicaciones.map(denounce => {
          if (denounce.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.match(new RegExp(this.search, 'gi')) !== null) return denounce
        })

        // Limpia el listado actual y lo llena con otro que cumplan el criterio de busqueda
        let postsFound = []
        postAux.forEach(denounce => {
          if (denounce) postsFound.push(denounce)
        })

        // Ordena el listado obtenido en orden lexicografico.
        postsFound.sort(function (a, b) {
          return a.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.localeCompare(b.motivo_denuncia.NOMB_MOTIVO_DENUNCIA)
        })

        let data = (await customPaginator.paginate(postsFound)).paginatedData
        if (data) {
          this.paginatedPosts = data
          this.paginationPosts = 0
        }
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.paginatedPosts = this.postsAux1
        this.paginationPosts = 0
      }
    },
    async buscarComentario () {
      // Copiar todas las denuncias de comentarios, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux2.length === 0) {
        this.postsAux2 = this.paginatedComments
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todas las denuncias de comentarios en que el Motivo de denuncia o parte de ellos posea el texto escrito en el buscador
        let postAux = this.comentarios.map(denounce => {
          if (denounce.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.match(new RegExp(this.search, 'gi')) !== null) return denounce
        })

        // Limpia el listado actual y lo llena con otro que cumplan el criterio de busqueda
        let commentsFound = []
        postAux.forEach(denounce => {
          if (denounce) commentsFound.push(denounce)
        })

        // Ordena el listado obtenido en orden lexicografico.
        commentsFound.sort(function (a, b) {
          return a.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.localeCompare(b.motivo_denuncia.NOMB_MOTIVO_DENUNCIA)
        })

        let data = (await customPaginator.paginate(commentsFound)).paginatedData
        if (data) {
          this.paginatedComments = data
          this.paginationComments = 0
        }
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.paginatedComments = this.postsAux2
        this.paginationComments = 0
      }
    },
    async buscarCalificacion () {
      // Copiar todas las denuncias de calificacion, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux3.length === 0) {
        this.postsAux3 = this.paginatedRatings
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todas las denuncias de calificacion en que el Motivo de denuncia o parte de ellos posea el texto escrito en el buscador
        let postAux = this.calificaciones.map(denounce => {
          if (denounce.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.match(new RegExp(this.search, 'gi')) !== null) return denounce
        })

        // Limpia el listado actual y lo llena con otro que cumplan el criterio de busqueda
        let ratingsFound = []
        postAux.forEach(denounce => {
          if (denounce) ratingsFound.push(denounce)
        })

        // Ordena el listado obtenido en orden lexicografico.
        ratingsFound.sort(function (a, b) {
          return a.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.localeCompare(b.motivo_denuncia.NOMB_MOTIVO_DENUNCIA)
        })

        let data = (await customPaginator.paginate(ratingsFound)).paginatedData
        if (data) {
          this.paginatedComments = data
          this.paginationComments = 0
        }
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.paginatedRatings = this.postsAux3
        this.paginationRatings = 0
      }
    },
    validate () {
      if (this.processing) return
      this.processing = true
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          let err = await resolutioncontroller.POST(this)
          if (!err) {
            switch (this.type) {
              case 'pub':
                let mailDenunciado = this.denouncedetail.publicacion.emprendedor.usuario.EMAIL_USUARIO
                let mailDenunciante = this.denouncedetail.usuario.EMAIL_USUARIO
                let nombrePublicacion = this.denouncedetail.publicacion.NOMB_PUBLICACION
                if (this.isBan) {
                  emailer.sendMail(this, mailDenunciado, 'Publicación Denunciada',
                    'Hemos recibido una denuncia de su publicación llamada: "' + nombrePublicacion + '" la cual fue baneada porque infringe nuestro Términos y condiciones de uso de nuestra aplicación web')
                  emailer.sendMail(this, mailDenunciante, 'Resolucion Denuncia',
                    'Hemos recibido su denuncia hacia la publicación: "' + nombrePublicacion + '" con éxito y le informamos que a sido revisada y eliminada del sitio. Muchas Gracias!')
                } else {
                  emailer.sendMail(this, mailDenunciante, 'Resolucion Denuncia',
                    'Hemos recibido su denuncia hacia la publicacion: "' + nombrePublicacion + '" con éxito, pero lamentamos infórmale que la publicación no infringe nuestro Términos y condiciones de uso de nuestra aplicación web')
                }
                break
              case 'com':
                mailDenunciado = this.denouncedetail.comentario.publicacion.emprendedor.usuario.EMAIL_USUARIO
                mailDenunciante = this.denouncedetail.usuario.EMAIL_USUARIO
                nombrePublicacion = this.denouncedetail.comentario.publicacion.denounceresolution
                if (this.isBan) {
                  emailer.sendMail(this, mailDenunciado, 'Comentario Denunciado',
                    'Hemos recibido una denuncia de su comentario en una publicacion llamada: "' + nombrePublicacion + '" el cual fue baneado porque infringe nuestro Términos y condiciones de uso de nuestra aplicación web')
                  emailer.sendMail(this, mailDenunciante, 'Resolucion Denuncia',
                    'Hemos recibido su denuncia hacia un comentario en la publicacion: "' + nombrePublicacion + '" con éxito y le informamos que a sido revisada y eliminada del sitio. Muchas Gracias!')
                } else {
                  emailer.sendMail(this, mailDenunciante, 'Resolucion Denuncia',
                    'Hemos recibido su denuncia hacia un comentario en la publicacion: "' + nombrePublicacion + '" con éxito y le informamos que a sido revisada y eliminada del sitio. Muchas Gracias!')
                }
                break
              case 'cal':
                mailDenunciado = this.denouncedetail.calificacion.publicacion.emprendedor.usuario.EMAIL_USUARIO
                mailDenunciante = this.denouncedetail.usuario.EMAIL_USUARIO
                nombrePublicacion = this.denouncedetail.calificacion.publicacion.DESC_PUBLICACION
                if (this.isBan) {
                  emailer.sendMail(this, mailDenunciado, 'Calificación Denunciada',
                    'Hemos recibido una denuncia de su calificacion en una publicacion llamada: "' + nombrePublicacion + '" el cual fue baneado porque infringe nuestro Términos y condiciones de uso de nuestra aplicación web')
                  emailer.sendMail(this, mailDenunciante, 'Resolucion Denuncia',
                    'Hemos recibido su denuncia hacia una calificación en la publicacion: "' + nombrePublicacion + '" con éxito y le informamos que a sido revisada y eliminada del sitio. Muchas Gracias!')
                } else {
                  emailer.sendMail(this, mailDenunciante, 'Resolucion Denuncia',
                    'Hemos recibido su denuncia hacia una calificación en la publicacion: "' + nombrePublicacion + '" con éxito, pero lamentamos infórmale que la calificación no infringe nuestro Términos y condiciones de uso de nuestra aplicación web')
                }
                break
            }
            setTimeout(() => {
              location.reload()
            }, 1000)
          }
          this.denounceresolution = {DESC_RESOLUCION: ''}
          this.$refs.dismissModal.click()
        }
        this.processing = false
      })
    }
  },
  filters: {
    dateFormat: function (date) {
      if (date) {
        return moment(String(date)).format('DD/MM/YYYY HH:mm')
      }
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Moderar Denuncias',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
