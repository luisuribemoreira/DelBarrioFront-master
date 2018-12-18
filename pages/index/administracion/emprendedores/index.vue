<template>
<section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Emprendedores</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-4 py-2">
          <nuxt-link :to="{ path: '/administracion/emprendedores/nuevo' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-lg-4 offset-md-3 col-md-6 offset-sm-3 py-1">
          <div class="input-group">
            <input class="form-control border border-right-0" name="search" v-model.trim="search" placeholder="Buscar Nombre de Emprendedor..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarEmprendedor()">
            <span class="input-group-append">
            <button class="btn btn-outline-secondary border-left-0" type="submit">
              <i class="fa fa-search"></i>
            </button>
            </span>
          </div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-12 table-responsive">
          <table class="table table-hover table-sm">
            <thead class="text-center">
              <tr>
                <th>Estado</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr :key="entrepreneur.IDEN_CATEGORIA" v-for="entrepreneur in paginatedData[pagination]">
                <td>
                  <icon :name="entrepreneur.usuario.FLAG_BAN ? 'times' : 'check'" :title="entrepreneur.FLAG_BAN ? 'Deshabilitado' : 'Habilitado'"></icon>
                </td>
                <td><nuxt-link :to="{ path: '/emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR }">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</nuxt-link></td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/emprendedores/editar/'+entrepreneur.IDEN_EMPRENDEDOR }">
                    <button class="btn btn-tabla" title="Editar">Editar</button>
                  </nuxt-link>
                  <!--entrepreneur.usuario.FLAG_BAN -->
                  <a @click="setState(entrepreneur)" class="btn">
                    <button class="btn btn-tabla" v-if="entrepreneur.usuario.FLAG_BAN" title="Habilitar">Habilitar</button>
                    <button class="btn btn-tabla" v-if="!entrepreneur.usuario.FLAG_BAN" title="Deshabilitar" :data-toggle="enabled ? 'modal' : ''" :data-target= "isAuthenticated ? '#disableModal' : ''" @click="check(), deshabilitacion.client = entrepreneur ">Deshabilitar</button>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
             <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <!-- Solo permite retroceder si la pagina actual es mayor a 0 -->
                <span aria-label="Previous" v-on:click="pagination > 0 ? pagination-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <!-- Se crea la paginacion al pie de pagina. Se usa page - 1 ya que pagination debe apuntar a los indices del arreglo, por lo que parte de 0 -->
              <li class="page-item" v-bind:key="page" v-for="page in pages">
                <!-- Si la pagina actual es igual a la clickeada, esta se ennegrece -->
                <span class="page-link" v-bind:class="{ 'font-weight-bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <!-- Solo permite avanzar si la pagina actual es inferior a la cantidad de paginas totales - 1 -->
                <span aria-label="Next" v-on:click="pagination < paginatedData.length - 1 ? pagination++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav>
          <div class="modal fade" id="disableModal" v-if="isAuthenticated" role="dialog">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" ref="modalDismiss" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Deshabilitar Emprendedor</h4>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="validateDisable()">
                    <h5>Selecciona el motivo de deshabilitación</h5>
                    <div class="form-group" :key="deactivationreason.IDEN_MOTIVO_DESHABILITACION" v-for="deactivationreason in deactivationreasons" v-if="deactivationreason.FLAG_VIGENTE">
                      <div class="radio">
                        <label>
                          <input v-validate data-vv-rules="required" type="radio" name="deactivation" :value="deactivationreason.IDEN_MOTIVO_DESHABILITACION" v-model.trim="deshabilitacion.IDEN_MOTIVO_DESHABILITACION"> {{deactivationreason.NOMB_MOTIVO_DESHABILITACION}}
                        </label>
                      </div>
                    </div>
                    <small class="text-danger" v-show="errors.has('deactivation')">{{ errors.first('deactivation') }}</small>
                    <div class="form-group py-2">
                      <label for="denounceComment">Más detalles</label>
                      <textarea
                        class="form-control"
                        :rows="5"
                        v-validate data-vv-rules="required|min:5|max:255"
                        name="description"
                        v-model.trim="deshabilitacion.DESC_COMENTARIO">
                      </textarea>
                      <span :class="deshabilitacion.DESC_COMENTARIO.length > 255 || deshabilitacion.DESC_COMENTARIO.length < 5 ? 'text-danger' : ''">{{deshabilitacion.DESC_COMENTARIO.length}} de 255 caracteres</span>
                    </div>
                    <small class="text-danger" v-show="errors.has('description')">{{ errors.first('description') }}</small>
                    <small class="text-danger" v-show="error.length">{{ error }}</small>
                    <div>
                      <button type="submit" class="btn btn-default">Enviar</button>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Volver</button>
                </div>
              </div>
            </div>
          </div> <!-- /disable modal -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/entrepreneurs'
import controllerDeactivations from '~/controllers/admin/deactivationreasons'
import controllerAccountDisable from '~/controllers/admin/accountdisable'
import emailer from '~/controllers/admin/emailer'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app, store }) {
    store.commit('SET_TITLE', 'ModerarEmprendedor')
    return controller.GETAll(app)
      .then(({ entrepreneurs }) => {
        entrepreneurs.sort(function (a, b) {
          return a.DESC_NOMBRE_FANTASIA.localeCompare(b.DESC_NOMBRE_FANTASIA, 'es', { numeric: true })
        })
        return controllerDeactivations.GETAll(app)
          .then(({ deactivationreasons }) => {
            return custompaginator.paginate(entrepreneurs)
              .then(({ paginatedData }) => {
                let pages = paginatedData.length
                return {
                  entrepreneurs,
                  deactivationreasons,
                  paginatedData,
                  pages
                }
              })
          })
      })
  },
  data () {
    return {
      entrepreneurs: [],
      search: '',
      postsAux: [],
      deactivationreasons: [],
      deshabilitacion: { DESC_COMENTARIO: '' },
      error: '',
      pagination: 0,
      pages: 0,
      paginatedData: [[]],
      processing: false,
      enabled: false
    }
  },
  methods: {
    check () {
      if (this.deactivationreasons.length === 0) {
        this.$notify.warning('Aún no se han agregado razones de deshabilitación.')
      } else {
        this.enabled = true
      }
    },
    async setState (entrepreneur) {
      if (entrepreneur.usuario.FLAG_BAN) {
        if (this.processing) return
        this.processing = true
        let data = await controllerAccountDisable.GETByUser(this, entrepreneur)
        if (data) {
          let deshabilitacionUsuario = data.deshabilitacionUsuario
          deshabilitacionUsuario.FLAG_VIGENTE = false // Se habilita nuevamente el usuario, dejando como no vigente su ultima deshabilitacion.
          await controllerAccountDisable.PUT(this, deshabilitacionUsuario)
          let mail = entrepreneur.usuario.EMAIL_USUARIO
          let setState = await controller.setState(this, entrepreneur)
          if (setState.disabled) {
            emailer.sendMail(this, mail, 'Usuario reactivado',
              'Estimado: Le informamos que su cuenta a sido activada nuevamente para entrar en el portal Del Barrio .')
          }
          this.processing = false
        }
      }
    },
    buscarEmprendedor () {
      // Copiar todos los posts, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.paginatedData
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los emprendedores en que el nombre de fantasia del emprendedor o parte de el posea el texto escrito en el buscador
        let entreSearch = this.entrepreneurs.map(entrepreneur => {
          if (entrepreneur.DESC_NOMBRE_FANTASIA.match(new RegExp(this.search, 'gi')) !== null) return entrepreneur
        })

        // Limpia los emprendedores actuales y lo llena con los emprendedores que cumplan el criterio de busqueda
        let entreFound = []
        entreSearch.forEach(entrepreneur => {
          if (entrepreneur) entreFound.push(entrepreneur)
        })

        // Ordena los emprendedores en orden lexicografico.
        entreFound.sort(function (a, b) {
          return a.DESC_NOMBRE_FANTASIA.localeCompare(b.DESC_NOMBRE_FANTASIA)
        })
        // Se llama al paginador con la lista de objetos encontrados
        custompaginator.paginate(entreFound)
          .then(({ paginatedData }) => {
            // Se reemplaza la lista paginada actual por la que contiene solo los objetos de la busqueda
            this.paginatedData = paginatedData
            // La cantidad total de paginas se reemplaza por la cantidad de paginas
            // de la nueva lista de objetos encontrados por la busqueda
            this.pages = paginatedData.length
            this.pagination = 0 // Se envia a la pagina inicial en caso de que la busqueda contenga mas de 10 objetos
          })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.paginatedData = this.postsAux
        this.pagination = 0
        this.pages = this.paginatedData.length
      }
    },
    validateDisable () {
      this.$validator.validateAll().then(async (result) => {
        if (this.processing) return
        this.processing = true
        if (result) {
          let data = await controllerAccountDisable.POST(this)
          if (data.disabled) {
            let mail = this.deshabilitacion.client.usuario.EMAIL_USUARIO
            let razon = this.deshabilitacion.DESC_COMENTARIO
            let dat = await controller.setState(this, this.deshabilitacion.client)
            if (dat.disabled) {
              emailer.sendMail(this, mail, 'Usuario Baneado',
                'Estimado: Le informamos que su cuenta fue baneada por el siguiente motivo: ' + razon + '. Le rogamos ponerse en contacto con el administrador.')
                .then(() => {
                  this.deshabilitacion = { DESC_COMENTARIO: '' }
                  // Esconde el modal.
                  this.$refs.modalDismiss.click()
                  this.processing = false
                })
            } else {
              this.processing = false
            }
          } else {
            this.processing = false
          }
        } else {
          this.processing = false
        }
      })
    }
  },
  computed: mapGetters([
    'loggedUser',
    'isAuthenticated'
  ]),
  middleware: 'authenticated',
  head () {
    return {
      title: 'Moderar Emprendedores'
    }
  }
}
</script>
