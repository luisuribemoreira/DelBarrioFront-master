<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div v-if="isAuthenticated && loggedUser.rol === 104">
        <div class="row">
          <div class="col-md-6 col-md-offset-3 fondo-beige">
            <h2 class="text-center">Nuevo Administrador</h2>
            <form @submit.prevent="validateBeforeSubmit">
              <div class="form-group margin-top">
                <label for="name">Nombres</label>
                <input v-validate data-vv-rules="required" pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,64}" title="Sólo letras" data-vv-as="nombre" name="name" type="text" v-model.trim="user.NOMBRES" class="form-control"/>
                <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Apellido Paterno</label>
                <input v-validate data-vv-rules="required" pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,64}" title="Sólo letras" data-vv-as="apellido paterno" name="lastname" type="text" v-model.trim="user.APELLIDO_PATERNO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('lastname')">{{ errors.first('lastname') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="name">Apellido Materno</label>
                <input v-validate data-vv-rules="required" pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,64}" title="Sólo letras" data-vv-as="apellido materno" name="lastname2" type="text" v-model.trim="user.APELLIDO_MATERNO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('lastname2')">{{ errors.first('lastname2') }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="date">Fecha de Nacimiento</label>
                <no-ssr>
                  <datepicker
                    language="es"
                    :format='format'
                    v-model="user.FECH_FECHA_NACIMIENTO"
                    :bootstrapStyling = "true"
                    name="date"
                  ></datepicker>
                </no-ssr>
                <small class="text-danger" v-if="dataErrorMsg.error_edad">{{ dataErrorMsg.error_edad }}</small>
              </div>
              <div class="form-group margin-top">
                <label for="email">Correo electrónico</label>
                <input v-validate data-vv-rules="required|email" data-vv-as="correo electrónico" name="email" type="text" v-model.trim="user.EMAIL_USUARIO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</small>
              </div>
              <button type="submit" class="btn btn-default">Ingresar</button>
            </form>
            <div v-if='message'>
              <span class="text-danger">{{message}}</span>
            </div>
          </div>
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/admins'
import Datepicker from 'vuejs-datepicker'
import customValidations from '~/controllers/customvalidations'
import emailer from '~/controllers/admin/emailer'

export default {
  asyncData ({ app }) {
    return controller.GET(app, this)
  },
  data () {
    this.$store.state.title = 'ModerarAdministrador'
    return {
      format: 'dd MMM, yyyy',
      user: { DESC_PASSWORD: Math.random().toString(36).slice(-8) }, // Clave autogenerada de 8 caracteres
      dataErrorMsg: { error_edad: undefined },
      message: undefined,
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
        this.dataErrorMsg = { error_edad: undefined }

        if (customValidations.isUnderAge(this.user.FECH_FECHA_NACIMIENTO)) {
          this.dataErrorMsg.error_edad = 'Debe ser mayor de edad'
        }

        if (this.dataErrorMsg.error_edad) {
          result = undefined
        }

        if (result) {
          this.user.EMAIL_USUARIO = this.user.EMAIL_USUARIO.toLowerCase()
          let mail = this.user.EMAIL_USUARIO
          let pass = this.user.DESC_PASSWORD
          let err = await controller.POST(this)
          if (!err) {
            emailer.sendMail(this, mail, 'Registro completado',
              'Bienvenido a Del Barrio!, su contraseña para entrar al portal es: ' + pass + '.')
          }
        }
        this.processing = false
      })
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  middleware: 'authenticated',
  head () {
    return {
      title: 'Nuevo Administrador'
    }
  }
}
</script>
