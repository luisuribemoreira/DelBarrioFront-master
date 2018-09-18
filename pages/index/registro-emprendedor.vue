<template>
  <section id="registro-empresa" class="container-fluid">
    <div class="container">
      <div v-if="isAuthenticated && loggedUser.rol === 102">
        <div class="margin-top">
          <form @submit.prevent="validateBeforeSubmit">
            <div class="col-md-6 fondo-beige">
              <div style="text-align: center">
                <h2><span style="vertical-align: super" >Datos de emprendedor</span></h2>
                <hr>
              </div>
              <div class="row">
                <div class="margin-left col-sm-6">
                  <no-ssr>
                  <croppa :width="200"
                          :height="200"
                          :quality="2"
                          placeholder="Subir Imagen"
                          :placeholder-font-size="18"
                          :prevent-white-space="true"
                          v-bind:initial-image="user.emprendedor.imagen.IDEN_IMAGEN ? imageUrl + user.emprendedor.imagen.URL_IMAGEN : ''"
                          ></croppa>
                  </no-ssr>
                </div>
              </div>
              <div v-if="dataErrorMsg.error_foto">
                <small class="text-danger">{{ dataErrorMsg.error_foto }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Nombres</label>
                <input v-validate data-vv-rules="required" data-vv-as="nombre" name="nombre" type="text" v-model.trim="user.persona.NOMBRES" class="form-control"/>
                <small class="text-danger" v-show="errors.has('nombre')">{{ errors.first('nombre') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="lastname">Apellido Paterno</label>
                <input v-validate data-vv-rules="required" data-vv-as="apellido paterno" name="apellido paterno" type="text" v-model.trim="user.persona.APELLIDO_PATERNO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('apellido paterno')">{{ errors.first('apellido paterno') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="lastname2">Apellido Materno</label>
                <input v-validate data-vv-rules="required" data-vv-as="apellido materno" name="apellido materno" type="text" v-model.trim="user.persona.APELLIDO_MATERNO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('apellido materno')">{{ errors.first('apellido materno') }}</small>
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
              <div class="form-group margin-top">
                <label for="contrasena">Contraseña</label>
                <input v-validate data-vv-rules="required|min:6" data-vv-as="contrasena" name="contrasena" type="password" v-model.trim="user.pass" class="form-control"/>
                <small class="text-danger" v-show="errors.has('contrasena')">{{ errors.first('contrasena') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="confirmar contrasena">Confirmar Contraseña</label>
                <input v-validate data-vv-rules="required|min:6" data-vv-as="confirmar contrasena" name="confirmar contrasena" type="password" v-model.trim="user.pass2" class="form-control"/>
                <small class="text-danger" v-if="dataErrorMsg.error_pw">{{ dataErrorMsg.error_pw }}</small>
                <small class="text-danger" v-show="errors.has('confirmar contrasena')">{{ errors.first('confirmar contrasena') }}</small>
              </div>
              <div style="text-align: center">
                <h2><span style="vertical-align: super">Datos de Empresa</span></h2>
                <hr>
              </div>
              <div class="form-group margin-top">
                <label for="name">Nombre de Fantasía</label>
                <input v-validate data-vv-rules="required" data-vv-as="nombre fantasia" name="nombre fantasia" type="text" v-model.trim="user.emprendedor.DESC_NOMBRE_FANTASIA" class="form-control"/>
                <small class="text-danger" v-show="errors.has('nombre fantasia')">{{ errors.first('nombre fantasia') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Descripción</label>
                <textarea v-validate data-vv-rules="required|min:30|max:255" data-vv-as="descripcion" name="descripcion" type="text" v-model.trim="user.emprendedor.DESC_EMPRENDEDOR" class="form-control" rows="3"></textarea>
                <small class="text-danger" v-show="errors.has('descripcion')">{{ errors.first('descripcion') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Dirección Comercial</label>
                <input v-validate data-vv-rules="required" data-vv-as="direccion" name="direccion" type="text" v-model.trim="user.persona.contacto.Direccion[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('direccion')">{{ errors.first('direccion') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Teléfono (Optativo)</label>
                <input v-validate data-vv-rules="min:9|numeric|max:9" data-vv-as="telefono" name="telefono" type="text" v-model.trim="user.persona.contacto.Telefono[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('telefono')">{{ errors.first('telefono') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Celular</label>
                <input v-validate data-vv-rules="required|numeric|min:9|max:9" data-vv-as="celular" name="celular" type="text" v-model.trim="user.persona.contacto.Celular[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('celular')">{{ errors.first('celular') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Correo de Contácto</label>
                <input v-validate data-vv-rules="required|email" data-vv-as="correo" name="correo" type="text" v-model.trim="user.persona.contacto.Correo[0].DESC_CONTACTO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('correo')">{{ errors.first('correo') }}</small>
              </div>
              <div>
              <input type="checkbox" id="status" name="status" v-model.trim="statusTerminos"> He leído y acepto los <a target="_blank" :href="terms">Términos y condiciones</a>
              </div>
              <div>
                <label>
                <small class="text-danger" v-if="messageTerminos">{{ messageTerminos }}</small>
                </label>
              </div>
              <button type="submit" class="btn btn-default">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div> <!-- /container -->
  </section>

</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/myaccount'
import customValidations from '~/controllers/customvalidations'
import Datepicker from 'vuejs-datepicker'
import emailer from '~/controllers/admin/emailer'

export default {
  asyncData ({ app, store, redirect }) {
    if (store._vm.isAuthenticated) {
      return controller.GET(app, store._vm.loggedUser.id)
        .then(({ user }) => {
          if (user.FECH_CREACION) redirect('/')
          if (!user.persona.IDEN_PERSONA) {
            user.persona.contacto = { Direccion: [{}], Correo: [{}], Telefono: [{}], Celular: [{}] }
          }

          return {
            user
          }
        })
    }
  },
  data () {
    return {
      format: 'dd MMM, yyyy',
      dataErrorMsg: { error_edad: undefined, error_pw: undefined, error_foto: undefined },
      user: {},
      submitted: { valid: false, errors: false },
      imageUrl: process.env.imagesUrl,
      statusTerminos: false,
      messageTerminos: false,
      terms: process.env.termsUrl,
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
      this.$validator.validateAll().then(async (result) => {
        // Se limpian los mensajes
        this.dataErrorMsg = { error_edad: undefined, error_pw: undefined, error_foto: undefined }
        // Se valida si la fecha ingresada coincide para poseer 18 años de edad o mas
        if (customValidations.isUnderAge(this.user.persona.FECH_FECHA_NACIMIENTO)) {
          this.dataErrorMsg.error_edad = 'Debe ser mayor de edad'
        }
        //  Revisar si la casilla de Terminos y condiciones esta marcada, si no lo está obliga a marcarla.
        if (!this.statusTerminos) {
          result = false
          this.messageTerminos = 'Debe aceptar los términos y condiciones.'
        }
        // Se valida que las contraseñas coincidan
        if (this.user.pass !== this.user.pass2) {
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
          this.user.blobs = blobs
          let mail = this.user.EMAIL_USUARIO
          let password = this.user.pass
          emailer.sendMail(this, mail, 'Cambio de contraseña',
            'Su nueva contraseña para entrar a DelBarrio es: ' + password + '.')
          controller.POST(this, this.user).then(() => {
            this.submitted.valid = true
            this.submitted.errors = false
            this.processing = false
            this.$router.replace('/sign-out')
          }).catch(() => {
            this.processing = false
            this.submitted.valid = false
            this.submitted.errors = true
          })
        }
        this.processing = false
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    // Metodo que previene que el usuario navege sin haberse registrado.
    // Permite la navegacion hacia la ruta /sign-out solo si el usuario la clickea o al finalizar el ingreso de datos.
    if ((this.submitted.valid && !this.submitted.errors) || (to.path === '/sign-out' && !this.submitted.errors && !this.submitted.valid)) {
      next()
    } else {
      next(false)
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  head () {
    return {
      title: 'Registro Emprendedor'
    }
  }
}
</script>