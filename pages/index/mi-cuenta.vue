<template>
  <section id="admin" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Mi cuenta</h2>
        </div>
      </div>
      <div class="row">
        <!-- EMPRENDEDOR - PREGUNTAS -->
        <div class="col-12" v-if="isAuthenticated && loggedUser.rol === 102">
          <h3><icon name="comments-o" :aria-hidden="true" :scale="2"></icon><span style="vertical-align: super"> Preguntas</span></h3>
          <hr>
          <p><span class="label label-default">{{ preguntas }}</span> <span style="vertical-align: sub"> Que aún no respondiste</span></p>
        </div>
        <!-- CLIENTE - RESPUESTAS -->
        <div class="col-12" v-if="isAuthenticated && loggedUser.rol === 101">
          <h3><icon name="comments-o" :aria-hidden="true" :scale="2"></icon><span style="vertical-align: super"> Respuestas</span></h3>
          <hr>
          <p><span class="label label-default">{{ respuestas }}</span> <span style="vertical-align: sub"> Te han respondido</span></p>
        </div>
      </div>
      <hr>
      <div v-if="isAuthenticated && loggedUser.rol === 102">
        <h2>Listado De Reportes</h2>
        <br/>
        <div class="row">
          <div class="col-md-4">
              <button type="submit" class="btn btn-default" @click="ProductosPorVisitas(), type = 'visitas', reportTitle = 'Publicaciones Por Visitas'">Publicaciones por Visitas</button>
          </div>
          <div class="col-md-4">
              <button type="submit" class="btn btn-default" @click="ProductosPorValoracion(), type = 'valoracion', reportTitle = 'Publicaciones Por Valoración'">Publicaciones por Valoración</button>
          </div>
          <div class="col-md-4">
              <button type="submit" class="btn btn-default" @click="ComentariosPorPublicacion(), type = 'comentarios', reportTitle = 'Comentarios Por Publicación'">Comentarios Por Publicación</button>
          </div>
        </div>
        <br/><br/>
        <div class="row margin-top" v-if="reportData.length > 0"> <!-- Datos de reporte -->
          <button type="submit" class="btn btn-default" style="margin-left: 0.9rem !important" @click="enviarPorCorreo()">Enviar Reporte por Correo</button>
          <div class="col-12 table-responsive">
            <h4 class="text-center">{{reportTitle}}</h4> <br/>
            <p v-if="reportTitle == 'Comentarios Por Publicación'"><i>* Lista compilada con los comentarios del último mes</i></p>
            <table class="table table-hover table-sm">
              <thead class="text-center">
                <tr>
                  <th :key="header" v-for="header in headers">{{ header }}</th>
                </tr>
              </thead>
              <tbody class="text-center" :key="data.publicacion" v-for="data in paginatedData[pagination]">
                <tr data-toggle="collapse" @click="data[6] && data[6].length > 0 ? selected = data[1] : '', data[6] && data[6].length > 0 ? open = !open : ''">
                  <nuxt-link v-if="data[1]" :to="{ path: '/publicaciones/' + data[1]}">
                    <td>Ir a la publicación</td>
                  </nuxt-link>
                  <td>{{data[1]}}</td>
                  <td v-bind:class="[data[6] && data[6].length > 0 ? textWeight : '']"><icon v-if="data[6] && data[6].length > 0" name="angle-down"></icon>{{data[2]}}</td>
                  <td>{{data[3]}}</td>
                  <td>{{data[4]}}</td>
                  <td>{{data[5]}}</td>
                </tr>
                <tr :id="data[1]" v-if="data[6] && data[6].length > 0 && data[1] == selected && open" v-for="comentario in data[6]" :key="comentario[2]" style="font-size: 90%">
                    <td>{{comentario[1]}}</td> <!-- Linea para alinear datos con los headers -->
                    <td>{{comentario[1]}}</td>
                    <td>{{comentario[2]}}</td>
                    <td>{{comentario[3]}}</td>
                    <td>{{comentario[4]}}</td>
                    <td>{{comentario[5]}}</td>
                </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-center">
                <li class="page-item">
                  <span aria-label="Previous" v-on:click="pagination > 0 ? pagination-- : ''">
                    <span class="page-link" :aria-hidden="true">&laquo;</span>
                  </span>
                </li>
                <li class="page-item" v-bind:key="page" v-for="page in pages">
                  <span class="page-link" v-bind:class="{ 'font-weight-bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
                </li>
                <li class="page-item">
                  <span aria-label="Next" v-on:click="pagination < paginatedData.length - 1 ? pagination++ : ''">
                    <span class="page-link" :aria-hidden="true">&raquo;</span>
                  </span>
                </li>
              </ul>
            </nav> <!-- navegacion -->
          </div>
        </div> <!-- Datos de reporte -->
        <small class="text-danger" v-if="message">{{ message }}</small>
        <section class="mis-destacados">
        <div class="row margin-top">
          <div class="col-12">
            <h3>Tus destacados</h3>
            <small class="text-muted"><nuxt-link to="/administracion/publicaciones">Ver todos</nuxt-link></small>
          </div>
        </div>
        <div class="row">
          <no-ssr>
            <carousel
                    :navigationEnabled="true"
                    :loop="true"
                    paginationActiveColor="#89dbee"
                    paginationColor="#b2ebd1"
                    :paginationSize="5"
                    easing="linear"
                    :speed="300"
                    :perPageCustom="[[768, 1], [1024, 6]]"
                    :autoplay ="true"
                    :autoplayTimeout="5000"
                    :autoplayHoverPause = "true"
                    style="width: 100%;">
              <slide class="px-2" v-for="p in posts" :key="p.IDEN_PUBLICACION"  v-if="p.FLAG_VIGENTE && !p.FLAG_BAN">
                <div class="card border">
                <nuxt-link class="card-img-link" :to="'/publicaciones/'+p.IDEN_PUBLICACION">
                  <img v-if="p.imagenes.length === 0" v-lazy="'/img/no-image.svg'" class="card-img-top" alt="">
                  <img v-else v-lazy="imageUrl + p.imagenes[0].URL_IMAGEN" class="card-img-top" alt="">
                </nuxt-link>
                <div class="card-body">
                <h4 class="card-title">{{ p.NOMB_PUBLICACION }}</h4>
                <p class="card-text">{{ p.DESC_PUBLICACION.substring(0,20) }}...</p>
                <h5 class="card-price">$ {{ p.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
                <p class="card-text"><icon name="eye"></icon> ({{p.NUMR_CONTADOR}})  |  <icon name="comments-o"></icon>({{ p.PREG_SIN_RESPONDER }})</p>
              </div>
              </div>
              </slide>
            </carousel>
          </no-ssr>
        </div>
        <hr class="margin-top">
        </section>
      </div>
      <div class="pb-3">
      <!-- Boton de Configuracion de cuenta Emprendedor -->
      <a class="btn btn-secondary" v-if="loggedUser.rol === 102" @click="selected = !selected">
        <icon name="wrench" :aria-hidden="true"></icon>
        <span> Configuración Cuenta</span>
      </a>
      <!-- Boton de Configuracion de cuenta Cliente -->
      <a class="btn btn-secondary" v-if="loggedUser.rol === 101" @click="selectedClient = !selectedClient">
        <icon name="wrench" :aria-hidden="true"></icon>
        <span> Configuración Cuenta </span>
      </a>
      <!-- Boton de Configuracion de cuenta Contraseña de ambos -->
      <a class="btn btn-secondary mx-1" @click="selectedPass = !selectedPass">
        <icon name="wrench" :aria-hidden="true"></icon>
        <span> Configuración de contraseña</span>
      </a>
      </div>

      <!-- CONFIGURACION DE CUENTA -->
      <div v-if="selected" class="margin-top">
        <div>
          <h2 class="text-center pt-4"><span>Datos de emprendedor</span></h2>
          <hr>
        </div>
        <div class="row justify-content-center">
        <div class="col-lg-6 pt-5 ">
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Nombres</label><span style="color: grey"> (Formato ej: Manuel Antonio)</span>
              <input v-validate data-vv-rules="required" data-vv-as="nombre" name="name" type="text" v-model.trim="user.persona.NOMBRES" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname">Apellido Paterno</label><span style="color: grey"> (Formato ej: Fernández)</span>
              <input v-validate data-vv-rules="required" data-vv-as="apellido paterno" name="lastname" type="text" v-model.trim="user.persona.APELLIDO_PATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname')">{{ errors.first('lastname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname2">Apellido Materno</label><span style="color: grey"> (Formato ej: Gallardo)</span>
              <input v-validate data-vv-rules="required" data-vv-as="apellido materno" name="lastname2" type="text" v-model.trim="user.persona.APELLIDO_MATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname2')">{{ errors.first('lastname2') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="date">Fecha de Nacimiento</label>
              <no-ssr>
                <datepicker
                  language="es"
                  :format='format'
                  v-model="user.persona.FECH_FECHA_NACIMIENTO"
                  :bootstrapStyling = "true"
                  name="date"
                ></datepicker>
              </no-ssr>
            </div>
            <div v-if="dataErrorMsg.error_edad">
              <small class="text-danger">{{ dataErrorMsg.error_edad }}</small>
            </div>
            <div v-if="loggedUser.rol === 102">
              <div>
                <h2 class="text-center"><span>Datos de Empresa</span></h2>
                <hr>
              </div>
              <div class="row justify-content-center mr-auto">
                <div class="margin-left col-md-5 border">
                  <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="2"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          v-bind:initial-image="user.emprendedor.imagen.URL_IMAGEN ? imageUrl + user.emprendedor.imagen.URL_IMAGEN : ''"
                          ></croppa>
                  </no-ssr>
                </div>
              </div>
              <div v-if="dataErrorMsg.error_foto">
                <small class="text-danger">{{ dataErrorMsg.error_foto }}</small>
              </div>
              <div class="form-group margin-top pt-3">
                <label for="name">Nombre de Fantasía</label><span style="color: grey"> (Formato ej: Artesanías Doña Anita)</span>
                <input v-validate data-vv-rules="required" data-vv-as="nombre fantasia" name="nombre fantasia" type="text" v-model.trim="user.emprendedor.DESC_NOMBRE_FANTASIA" class="form-control"/>
                <small class="text-danger" v-show="errors.has('nombre fantasia')">{{ errors.first('nombre fantasia') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Descripción</label><span style="color: grey"> (*Breve resumen sobre el servicio o producto ofrecido)</span>
                <textarea v-validate data-vv-rules="required|min:30|max:255" data-vv-as="descripcion" name="descripcion" type="text" v-model.trim="user.emprendedor.DESC_EMPRENDEDOR" class="form-control" rows="3"></textarea>
                <small class="text-danger" v-show="errors.has('descripcion')">{{ errors.first('descripcion') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Dirección Comercial</label><span style="color: grey"> (*Domicilio usado para ser contactado por sus clientes)</span>
                <input v-validate data-vv-rules="required" data-vv-as="direccion" name="direccion" type="text" v-model.trim="user.persona.contacto.Direccion[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('direccion')">{{ errors.first('direccion') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Teléfono (Optativo)</label><span style="color: grey"> (Formato ej: 221342146)</span>
                <input v-validate data-vv-rules="min:9|numeric|max:9" data-vv-as="telefono" name="telefono" type="number" v-model.trim="user.persona.contacto.Telefono[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('telefono')">{{ errors.first('telefono') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Celular</label><span style="color: grey"> (Formato ej: 982275364)</span>
                <input v-validate data-vv-rules="required|numeric|min:9|max:9" data-vv-as="celular" name="celular" type="number" v-model.trim="user.persona.contacto.Celular[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('celular')">{{ errors.first('celular') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Correo de Contácto</label><span style="color: grey"> (Formato ej: contacto@emprendimiento.cl)</span>
                <input v-validate data-vv-rules="required|email" data-vv-as="correo" name="correo" type="text" v-model.trim="user.persona.contacto.Correo[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('correo')">{{ errors.first('correo') }}</small>
              </div>
              <div>
                <h2 class="text-center"><span>Redes Sociales (Optativas)</span></h2>
                <hr>
              </div>
              <div class="form-group margin-top">
                <label for="name">Twitter</label><span style="color: grey"> (Formato ej: twitter.com/muni_provi)</span>
                <input v-validate data-vv-rules="url|min:11" data-vv-as="Twitter" name="Twitter" type="text" v-model.trim="user.persona.contacto.Twitter[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('Twitter')">{{ errors.first('Twitter') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Instagram</label><span style="color: grey"> (Formato ej: instagram.com/providencia_activa)</span>
                <input v-validate data-vv-rules="url|min:13" data-vv-as="Instagram" name="Instagram" type="text" v-model.trim="user.persona.contacto.Instagram[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('Instagram')">{{ errors.first('Instagram') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Facebook</label><span style="color: grey"> (Formato ej: facebook.com/MunicipalidadDeProvidencia)</span>
                <input v-validate data-vv-rules="url|min:12" data-vv-as="Facebook" name="Facebook" type="text" v-model.trim="user.persona.contacto.Facebook[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('Facebook')">{{ errors.first('Facebook') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Página Web</label><span style="color: grey"> (Formato ej: providencia.cl)</span>
                <input v-validate data-vv-rules="url|min:3" data-vv-as="Web" name="Web" type="text" v-model.trim="user.persona.contacto.Web[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('Web')">{{ errors.first('Web') }}</small>
              </div>
              <div class="form-group margin-top">
                <h2 class="text-center">Al guardar cambios, por favor reinicie sesión para ver los efectos</h2>
              </div>
              <div class="row justify-content-center pb-3">
                <button type="submit" class="btn btn-default" >Guardar</button>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
            <!-- CONFIGURACION DE CONTRASEÑA -->
      <div v-if="selectedPass" class="margin-top">
        <div>
          <h2 class="text-center"><span>Configuracion de Contraseña</span></h2>
          <hr>
        </div>
        <div class="col-lg-6 mx-auto">
        <div class="row justify-content-center">
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="pass">Contraseña</label><span style="color: grey"> (*No utilice palabras o números de conocimiento público)</span>
              <input v-validate data-vv-rules="min:6" data-vv-as="contraseña" name="pass" type="password" v-model.trim="user.pass" class="form-control"/>
              <small class="text-danger" v-show="errors.has('pass')">{{ errors.first('pass') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass2">Confirmar Contraseña</label>
              <input type="password" data-vv-as="contraseña" name="pass2" v-model.trim="user.pass2" class="form-control"/>
              <small class="text-danger" v-if="dataErrorMsg.error_pw">{{ dataErrorMsg.error_pw }}</small>
            </div>
            <div class="row justify-content-center pb-3">
              <button type="submit" class="btn btn-default" >Guardar</button>
            </div>
              </form>
              </div>
            </div>
        </div>
              <!-- CONFIGURACION DE CLIENTE -->
        <div v-if="selectedClient" class="margin-top">
        <div>
          <h2 class="text-center"><span>Datos de cliente</span></h2>
          <hr>
        </div>
        <div class="col-lg-6 mx-auto">
        <div class="row justify-content-center">
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Correo Electrónico</label><span style="color: grey"> (Formato ej: cliente@correo.com)</span>
              <input v-validate data-vv-rules="required|email" data-vv-as="correo" name="correo" type="text" v-model.trim="user.EMAIL_USUARIO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('correo')">{{ errors.first('correo') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="name">Nombres</label><span style="color: grey"> (Formato ej: Manuel Antonio)</span>
              <input v-validate data-vv-rules="required" data-vv-as="nombre" name="name" type="text" v-model.trim="user.persona.NOMBRES" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname">Apellido Paterno</label><span style="color: grey"> (Formato ej: Fernández)</span>
              <input v-validate data-vv-rules="required" data-vv-as="apellido paterno" name="lastname" type="text" v-model.trim="user.persona.APELLIDO_PATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname')">{{ errors.first('lastname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname2">Apellido Materno</label><span style="color: grey"> (Formato ej: Gallardo)</span>
              <input v-validate data-vv-rules="required" data-vv-as="apellido materno" name="lastname2" type="text" v-model.trim="user.persona.APELLIDO_MATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname2')">{{ errors.first('lastname2') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="date">Fecha de Nacimiento</label>
              <no-ssr>
                <datepicker
                  language="es"
                  :format='format'
                  v-model="user.persona.FECH_FECHA_NACIMIENTO"
                  :bootstrapStyling = "true"
                  name="date"
                ></datepicker>
              </no-ssr>
            </div>
            <div v-if="dataErrorMsg.error_edad">
              <small class="text-danger">{{ dataErrorMsg.error_edad }}</small> <br />
            </div>
            <div v-if="dataErrorMsg.error_correo">
              <small class="text-danger">{{ dataErrorMsg.error_correo }}</small> <br />
            </div>
            <div class="form-group margin-top">
                <h2 class="text-center">Al guardar cambios, por favor reinicie sesión para ver los efectos</h2>
              </div>
            <div class="row justify-content-center pb-3">
              <button type="submit" class="btn btn-default" >Guardar</button>
            </div>
              </form>
              </div>
            </div>
        </div>
    </div> <!-- /container -->
  </section>

</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/myaccount'
import controllerPosts from '~/controllers/posts'
import customValidations from '~/controllers/customvalidations'
import commentsController from '~/controllers/comments'
import Datepicker from 'vuejs-datepicker'
import controllerReporteria from '~/controllers/admin/reporteria'
import customPaginator from '~/controllers/custompaginator'
import emailer from '~/controllers/admin/emailer'

export default {
  asyncData ({ app, store }) {
    store.commit('SET_TITLE', 'MiCuenta')
    return controller.GET(app, store._vm.loggedUser.id)
      .then(({ user }) => {
        if (store._vm.loggedUser.rol === 102) {
          return controllerPosts.GETPostEmprendedor(app, user.emprendedor.IDEN_EMPRENDEDOR)
            .then(({ posts }) => {
              let preguntas = 0
              let PREG_SIN_RESPONDER
              let postsAux = []
              posts.forEach(post => {
                if (post.FLAG_VIGENTE && !post.FLAG_BAN && post.FLAG_VALIDADO) {
                  postsAux.push(post)
                  PREG_SIN_RESPONDER = 0
                  if (post.comentarios.length > 0) {
                    post.comentarios.forEach(comentario => {
                      if (!comentario.respuesta.IDEN_RESPUESTA) {
                        preguntas++
                        PREG_SIN_RESPONDER++
                      }
                    })
                  }
                  post.PREG_SIN_RESPONDER = PREG_SIN_RESPONDER
                }
              })
              // Ordena los posts por fecha de creacion. El más reciente aparece primero en la lista (izquierda a derecha en la vista)
              postsAux.sort(function (a, b) {
                if (a.FECH_CREACION > b.FECH_CREACION) return -1
                if (a.FECH_CREACION < b.FECH_CREACION) return 1
              })
              // Se inicializa el Telefono como objeto vacio en caso de que el usuario no tenga un telefono definido.
              // Se inicializan todos los campos para evitar errores.
              if (!user.persona.contacto) user.persona.contacto = {}
              user.persona.contacto = {
                Direccion: user.persona.contacto.Direccion && user.persona.contacto.Direccion.length > 0 ? user.persona.contacto.Direccion : [{}],
                Correo: user.persona.contacto.Correo && user.persona.contacto.Correo.length > 0 ? user.persona.contacto.Correo : [{}],
                Telefono: user.persona.contacto.Telefono && user.persona.contacto.Telefono.length > 0 ? user.persona.contacto.Telefono : [{}],
                Celular: user.persona.contacto.Celular && user.persona.contacto.Celular.length > 0 ? user.persona.contacto.Celular : [{}],
                Twitter: user.persona.contacto.Twitter && user.persona.contacto.Twitter.length > 0 ? user.persona.contacto.Twitter : [{}],
                Instagram: user.persona.contacto.Instagram && user.persona.contacto.Instagram.length > 0 ? user.persona.contacto.Instagram : [{}],
                Facebook: user.persona.contacto.Facebook && user.persona.contacto.Facebook.length > 0 ? user.persona.contacto.Facebook : [{}],
                Web: user.persona.contacto.Web && user.persona.contacto.Web.length > 0 ? user.persona.contacto.Web : [{}]
              }
              return {
                user: user,
                posts: postsAux,
                preguntas: preguntas
              }
            })
        } else {
          return commentsController.GETByUser(app, store._vm.loggedUser.id)
            .then(({ comentarios }) => {
              let respuestas = 0
              if (comentarios.length > 0) {
                comentarios.forEach(comentario => {
                  if (comentario && comentario.respuesta.IDEN_RESPUESTA) respuestas++
                })
              }
              return {
                user: user,
                respuestas
              }
            })
        }
      })
  },
  data () {
    return {
      selected: false,
      selectedPass: false,
      selectedClient: false,
      format: 'dd MMM, yyyy',
      posts: [],
      dataErrorMsg: { error_edad: undefined, error_pw: undefined, error_foto: undefined, error_correo: undefined },
      imageUrl: process.env.imagesUrl,
      entrepreneur: {},
      preguntas: 0,
      user: {},
      open: false,
      selectedItem: false,
      headers: [],
      reportData: [],
      textWeight: 'font-weight-bold',
      type: '',
      reportTitle: false,
      pagination: 0,
      pages: 0,
      paginatedData: [[]],
      message: false,
      processing: false
    }
  },
  components: {
    Datepicker
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      if (this.selected) {
        this.$validator.validateAll().then(async (result) => {
          // Se limpian los mensajes
          this.dataErrorMsg = { error_edad: undefined, error_pw: undefined, error_foto: undefined, error_correo: undefined }
          // Se valida si la fecha ingresada coincide para poseer 18 años de edad o mas
          if (customValidations.isUnderAge(this.user.persona.FECH_FECHA_NACIMIENTO)) {
            this.dataErrorMsg.error_edad = 'Debe ser mayor de edad'
          }

          // Se valida que las contraseñas coincidan
          if (this.user.pass && (!this.user.pass2 || this.user.pass !== this.user.pass2)) {
            this.dataErrorMsg.error_pw = 'Las contraseñas deben coincidir'
          }

          let blobs = []
          // Recorrer directamente los componentes, en vez de los modelos
          for (var key in this.$children) {
            // Validar que efectivamente contiene los atributos que corresponden a un componente vue-croppa
            if (this.$children[key] && this.$children[key].$children && this.$children[key].$children[0] && this.$children[key].$children[0].imageSet) {
              let blob = await this.$children[key].$children[0].promisedBlob()
              blobs.push(blob)
            }
          }

          if (blobs.length === 0) {
            this.dataErrorMsg.error_foto = 'Debe seleccionar una foto'
          }

          if (this.dataErrorMsg.error_edad || this.dataErrorMsg.error_pw || this.dataErrorMsg.error_foto) {
            result = undefined
          }
          if (result) {
            if (this.loggedUser.rol === 102) {
              this.user.blobs = blobs
              await controller.PUTEmprendedor(this)
            }
          }
        })
      } else if (this.selectedPass) {
        this.$validator.validateAll().then(async (result) => {
          this.dataErrorMsg = {error_pw: undefined}
          // Se valida que las contraseñas coincidan
          if (this.user.pass && (!this.user.pass2 || this.user.pass !== this.user.pass2)) {
            this.dataErrorMsg.error_pw = 'Las contraseñas deben coincidir'
          }
          if (this.dataErrorMsg.error_pw) {
            result = undefined
          }
          if (result) {
            let mail = this.user.EMAIL_USUARIO
            let password = this.user.pass
            let err = await controller.PUT(this, this.user)
            if (!err) {
              emailer.sendMail(this, mail, 'Cambio de contraseña',
                'Su nueva contraseña para entrar a DelBarrio es: ' + password + '.')
            }
          }
        })
      } else if (this.selectedClient) {
        this.$validator.validateAll().then(async (result) => {
          // Se limpian los mensajes
          this.dataErrorMsg = { error_edad: undefined, error_correo: undefined }
          // Se valida si la fecha ingresada coincide para poseer 18 años de edad o mas
          if (customValidations.isUnderAge(this.user.persona.FECH_FECHA_NACIMIENTO)) {
            this.dataErrorMsg.error_edad = 'Debe ser mayor de edad'
          }
          if (this.dataErrorMsg.error_edad) {
            result = undefined
          }
          if (result) {
            let err = await controller.PUT(this, this.user)
            if (typeof err === 'string') {
              this.dataErrorMsg.error_correo = err
            }
          }
        })
      }
      this.processing = false
    },
    async ProductosPorVisitas () {
      let data = await controllerReporteria.productosPorVisitas(this)

      if (data !== -1) {
        this.reportData = data.reportData
        this.headers = data.headers
        this.paginatedData = (await customPaginator.paginate(this.reportData, 5)).paginatedData
        this.pages = this.paginatedData.length
        this.pagination = 0
      }

      if (this.reportData.length === 0) {
        this.message = 'No se encontró ninguna publicación.'
      } else {
        this.message = false
      }
    },
    async ProductosPorValoracion () {
      let data = await controllerReporteria.productosPorValoracion(this)

      if (data !== -1) {
        this.reportData = data.reportData
        this.headers = data.headers
        this.paginatedData = (await customPaginator.paginate(this.reportData, 5)).paginatedData
        this.pages = this.paginatedData.length
        this.pagination = 0
      }

      if (this.reportData.length === 0) {
        this.message = 'No se encontró ninguna publicación.'
      } else {
        this.message = false
      }
    },
    async ComentariosPorPublicacion () {
      let data = await controllerReporteria.comentariosPorProducto(this)
      if (data !== -1) {
        this.reportData = data.reportData
        this.headers = data.headers
        this.paginatedData = (await customPaginator.paginate(this.reportData, 5)).paginatedData
        this.pages = this.paginatedData.length
        this.pagination = 0
      }

      if (this.reportData.length === 0) {
        this.message = 'No se encontro ninguna publicación.'
      } else {
        this.message = false
      }
    },
    async enviarPorCorreo () {
      if (this.processing) return
      this.processing = true

      await controllerReporteria.sendPDF(this, this.reportData, this.headers, this.type)
      this.processing = false
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  middleware: 'authenticated',
  head () {
    return {
      title: 'Mi Cuenta'
    }
  }
}
</script>
