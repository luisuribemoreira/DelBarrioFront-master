<template>
  <section id="admin-denuncias" class="container-fluid">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Denuncias</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-md-offset-8 col-sm-6 col-sm-offset-3">
          <form class="input-group text-truncate">
            <input class="form-control" name="search" placeholder="Buscar" autocomplete="off" autofocus="autofocus" type="text">
            <div class="input-group-btn">
              <button class="btn btn-outline-success" type="submit"><icon name="search" :aria-hidden="true"></icon></button>
            </div>
          </form>
        </div>
      </div>        
      <div class="row margin-top">
        <div class="col-xs-12 table-responsive">
          <div>
            <!-- Nav tabs -->
            <ul class="nav nav-tabs" role="tablist">
              <li role="presentation" class="active"><a href="#item1" aria-controls="item1" role="tab" data-toggle="tab">Publicaciones</a></li>
              <li role="presentation"><a href="#item2" aria-controls="item2" role="tab" data-toggle="tab">Comentarios</a></li>
              <li role="presentation"><a href="#item3" aria-controls="item3" role="tab" data-toggle="tab">Calificaciones</a></li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
              <!-- PUBLICACIONES -->
              <div role="tabpanel" class="tab-pane active" id="item1">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Publicación</th>
                      <th>Fecha</th>
                      <th>Denunciante</th>
                      <th>Motivo</th>
                      <th>Resolución</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="denounce in publicaciones" :key="denounce.IDEN_DENUNCIA">
                      <td>
                        <nuxt-link :to="'/publicaciones/'+ denounce.publicacion.IDEN_PUBLICACION">{{denounce.publicacion.NOMB_PUBLICACION.substring(0,10)}}</nuxt-link>
                      </td>
                      <td>{{denounce.FECH_CREACION | dateFormat}}</td>
                      <td>{{denounce.usuario.EMAIL_USUARIO}}</td>
                      <td>{{denounce.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.substring(0,10)}}</td>
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
                      <tr v-for="denounce in comentarios" :key="denounce.IDEN_DENUNCIA">
                        <td>{{denounce.FECH_CREACION | dateFormat}}</td>
                        <td>{{denounce.usuario.EMAIL_USUARIO}}</td>
                        <td>{{denounce.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.substring(0,10)}}</td>
                        <td>{{denounce.DESC_DENUNCIA.substring(0,10)}}</td>
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
                    <tr v-for="denounce in calificaciones" :key="denounce.IDEN_DENUNCIA">
                      <td>{{denounce.FECH_CREACION | dateFormat}}</td>
                      <td>{{denounce.usuario.EMAIL_USUARIO}}</td>
                      <td>{{denounce.motivo_denuncia.NOMB_MOTIVO_DENUNCIA.substring(0,10)}}</td>
                      <td>{{denounce.DESC_DENUNCIA.substring(0,10)}}</td>
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
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Detalle de denuncia</h4>
          </div>
          <div class="modal-body">
            <!-- DATOS DEL DENUNCIANTE -->
            <label>Email de denunciante</label>
            <p>{{denouncedetail.usuario.EMAIL_USUARIO}}</p>
            <label>Nombre de denunciante</label>
            <p>{{Object.keys(denouncedetail.usuario.persona && denouncedetail.usuario.persona).length !== 0? denouncedetail.usuario.persona.NOMBRES + ' ' + denouncedetail.usuario.persona.APELLIDO_PATERNO : denouncedetail.usuario.emprendedor.DESC_NOMBRE_EMPRESA}}</p>
            <!-- DATOS DE LA PUBLICACIÓN, COMENTARIO O CALIFICACIÓN DENUNCIADOS -->
            <div v-if="denouncedetail.publicacion && Object.keys(denouncedetail.publicacion).length !== 0">
              <label>Publicación</label>
              <p>{{denouncedetail.publicacion.NOMB_PUBLICACION}}</p>
            </div>
            <div v-if="denouncedetail.comentario && Object.keys(denouncedetail.comentario).length !== 0">
              <label>Comentario</label>
              <p>{{denouncedetail.comentario.DESC_COMENTARIO}}</p>
            </div>
            <div v-if="denouncedetail.calificacion && Object.keys(denouncedetail.calificacion).length !== 0">
              <label>Texto de calificación</label>
              <p v-if="denouncedetail.calificacion.DESC_CALIFICACION">{{denouncedetail.calificacion.DESC_CALIFICACION}}</p>
              <p v-else><i>No posee</i></p>
            </div>
            <label>Fecha de creación</label>
            <p>{{denouncedetail.FECH_CREACION | dateFormat}}</p>
            <label>Motivo de denuncia</label>
            <p>{{denouncedetail.motivo_denuncia.NOMB_MOTIVO_DENUNCIA}}</p>
            <label>Descripción de la denuncia</label>
            <p>{{denouncedetail.DESC_DENUNCIA}}</p>
            <hr class="margin-top">
            <!-- RESOLUCIÓN DE LA DENUNCIA (SI EXISTE) -->
            <div v-if="denouncedetail.resolucion_denuncia && Object.keys(denouncedetail.resolucion_denuncia).length !== 0">
              <h4>Resolución de denuncia</h4>
              <label>Fecha de resolución</label>
              <p>{{denouncedetail.resolucion_denuncia.FECH_CREACION | dateFormat}}</p>
              <label>Administrador a cargo</label>
              <p>{{denouncedetail.resolucion_denuncia.usuario.persona.NOMBRES +' '+ denouncedetail.resolucion_denuncia.usuario.persona.APELLIDO_PATERNO}} ({{denouncedetail.resolucion_denuncia.usuario.EMAIL_USUARIO}})</p>
              <label>Descripción</label>
              <p>{{denouncedetail.resolucion_denuncia.DESC_RESOLUCION}}</p>
            </div>
            <!-- SI NO EXISTE DENUNCIA, FORMULARIO DE RESOLUCIÓN -->
            <div v-else>
              <h4 class="margin-top">Resolver denuncia</h4>
              <form @submit.prevent="validate">
                <div class="form-group">
                  <div class="checkbox">
                    <label><input type="checkbox" v-model="isBan" />Banear {{ type == 'pub' ? 'publicación' : type == 'com' ? 'comentario' : 'calificación' }}</label>
                  </div>
                </div>
                <div class="form-group">
                  <label for="description">Descripción</label>
                  <textarea v-validate data-vv-rules="required|min:5|max:250" data-vv-as="descripción" name="description" v-model="denounceresolution.DESC_RESOLUCION" class="form-control"></textarea>
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
import { mapGetters } from 'vuex'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  data () {
    return {
      denouncedetail: { usuario: { emprendedor: {}, persona: {} }, publicacion: {}, motivo_denuncia: {}, calificacion: {}, resolucion_denuncia: {} },
      open: false,
      denounceresolution: {DESC_RESOLUCION: ''},
      type: '',
      isBan: false
    }
  },
  computed: mapGetters([
    'loggedUser'
  ]),
  methods: {
    setState: client => {
      controller.setState(this, client)
    },
    validate () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          resolutioncontroller.POST(this)
        }
      })
    }
  },
  filters: {
    dateFormat: function (date) {
      return moment(String(date)).format('DD/MM/YYYY HH:mm')
    }
  },
  head () {
    return {
      title: 'Denuncias',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
