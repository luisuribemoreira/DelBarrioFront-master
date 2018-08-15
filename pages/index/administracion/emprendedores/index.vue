<template>
<section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Emprendedores</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link :to="{ path: '/administracion/emprendedores/nuevo' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar Nombre de Emprendedor..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarEmprendedor()">
            <div class="input-group-btn">
              <icon name="search" :aria-hidden="true"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="row margin-top">
        <div class="col-xs-12 table-responsive">
          <table class="table table-hover table-condensed">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="entrepreneur.IDEN_CATEGORIA" v-for="entrepreneur in entrepreneurs">
                <td>
                  <icon :name="entrepreneur.usuario.FLAG_BAN ? 'times' : 'check'" :title="entrepreneur.FLAG_BAN ? 'Deshabilitado' : 'Habilitado'"></icon>
                </td>
                <td><nuxt-link :to="{ path: '/emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR }">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</nuxt-link></td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/emprendedores/editar/'+entrepreneur.IDEN_EMPRENDEDOR }" class="btn btn-secondary">
                    <button class="btn btn-tabla" title="Editar">Editar</button>
                  </nuxt-link>
                  <!--entrepreneur.usuario.FLAG_BAN -->
                  <a @click="setState(entrepreneur)">
                    <button class="btn" v-if="entrepreneur.usuario.FLAG_BAN" title="Habilitar">Habilitar</button>
                    <button class="btn" v-if="!entrepreneur.usuario.FLAG_BAN" title="Deshabilitar" data-toggle="modal" :data-target= "isAuthenticated ? '#disableModal' : ''" @click="deshabilitacion.client = entrepreneur ">Deshabilitar</button>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li>
                <a href="#" aria-label="Previous">
                  <span :aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
              <li>
                <a href="#" aria-label="Next">
                  <span :aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>

          <div class="modal fade" id="disableModal" v-if="isAuthenticated" role="dialog">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Deshabilitar Emprendedor</h4>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="validateDisable()">
                    <h5>Selecciona el motivo de deshabilitación</h5>
                    <div class="form-group" :key="deactivationreason.IDEN_MOTIVO_DESHABILITACION" v-for="deactivationreason in deactivationreasons">
                      <div class="radio">
                        <label>
                          <input v-validate data-vv-rules="required" type="radio" name="deactivation" :value="deactivationreason.IDEN_MOTIVO_DESHABILITACION" v-model="deshabilitacion.IDEN_MOTIVO_DESHABILITACION"> {{deactivationreason.NOMB_MOTIVO_DESHABILITACION}}
                        </label>
                      </div>
                    </div>
                    <small class="text-danger" v-show="errors.has('deactivation')">{{ errors.first('deactivation') }}</small>
                    <div class="form-group margin-top">
                      <label for="denounceComment">Más detalles</label>
                      <textarea 
                        class="form-control"
                        :rows="5"
                        v-validate data-vv-rules="required|min:5|max:255"
                        name="description"
                        v-model="deshabilitacion.DESC_COMENTARIO">
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

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ entrepreneurs }) => {
        return controllerDeactivations.GETAll(app)
          .then(({ deactivationreasons }) => {
            return {
              entrepreneurs,
              deactivationreasons
            }
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
      error: ''
    }
  },
  methods: {
    setState (entrepreneur) {
      if (entrepreneur.usuario.FLAG_BAN) {
        controllerAccountDisable.GETByUser(this, entrepreneur)
          .then(({ deshabilitacionUsuario }) => {
            deshabilitacionUsuario.FLAG_VIGENTE = false // Se habilita nuevamente el usuario, dejando como no vigente su ultima deshabilitacion.
            controllerAccountDisable.PUT(this, deshabilitacionUsuario)
              .then(() => {
                controller.setState(this, entrepreneur)
              })
          })
      }
    },
    buscarEmprendedor () {
      // Copiar todos los posts, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.entrepreneurs
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los emprendedores en que el nombre de fantasia del emprendedor o parte de el posea el texto escrito en el buscador
        let postAux = this.postsAux.map(entrepreneur => {
          if (entrepreneur.DESC_NOMBRE_FANTASIA.match(new RegExp(this.search, 'gi')) !== null) return entrepreneur
        })

        // Limpia los emprendedores actuales y lo llena con los emprendedores que cumplan el criterio de busqueda
        this.entrepreneurs = []
        postAux.forEach(entrepreneur => {
          if (entrepreneur) this.entrepreneurs.push(entrepreneur)
        })

        // Ordena los emprendedores en orden lexicografico.
        this.entrepreneurs.sort(function (a, b) {
          return a.DESC_NOMBRE_FANTASIA.localeCompare(b.DESC_NOMBRE_FANTASIA)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.entrepreneurs = this.postsAux
      }
    },
    validateDisable () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          controllerAccountDisable.POST(this)
            .then(() => {
              controller.setState(this, this.deshabilitacion.client)
              this.deshabilitacion = { DESC_COMENTARIO: '' }
            })
        }
      })
    }
  },
  computed: mapGetters([
    'loggedUser',
    'isAuthenticated'
  ]),
  head () {
    return {
      title: 'Moderar Emprendedores'
    }
  }
}
</script>
