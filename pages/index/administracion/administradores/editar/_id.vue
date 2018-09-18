<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-3 fondo-beige">
          <h2 class="text-center">Editar Administrador</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Nombres</label>
              <input v-validate data-vv-rules="required" data-vv-as="nombre" name="name" type="text" v-model.trim="user.NOMBRES" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="name">Apellido Paterno</label>
              <input v-validate data-vv-rules="required" data-vv-as="apellido paterno" name="lastname" type="text" v-model.trim="user.APELLIDO_PATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname')">{{ errors.first('lastname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="name">Apellido Materno</label>
              <input v-validate data-vv-rules="required" data-vv-as="apellido materno" name="lastname2" type="text" v-model.trim="user.APELLIDO_MATERNO" class="form-control"/>
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
                <input v-validate data-vv-rules="required|email" data-vv-as="correo electrónico" name="email" type="text" v-model.trim="user.usuario.EMAIL_USUARIO" class="form-control"/>
                <small class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</small>
            </div>
            <button type="submit" class="btn btn-default">Guardar</button>
          </form>
          <div v-if='message'>
            <span class="text-danger">{{message}}</span>
          </div>
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import controller from '~/controllers/admin/admins'
import Datepicker from 'vuejs-datepicker'
import customValidations from '~/controllers/customvalidations'
import emailer from '~/controllers/admin/emailer'

export default {
  async asyncData ({ app, params, redirect }) {
    let user = await controller.GET(app, params.id)
    if (!user || user.user.usuario.IDEN_ROL !== 3) redirect('/')
    return {
      user: user.user
    }
  },
  data () {
    return {
      format: 'dd MMM, yyyy',
      user: {},
      dataErrorMsg: { error_edad: undefined },
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
      this.$validator.validateAll().then(async (result) => {
        this.dataErrorMsg = { error_edad: undefined }

        if (customValidations.isUnderAge(this.user.FECH_FECHA_NACIMIENTO)) {
          this.dataErrorMsg.error_edad = 'Debe ser mayor de edad'
        }

        if (this.dataErrorMsg.error_edad) {
          result = undefined
        }

        if (result) {
          this.user.usuario.EMAIL_USUARIO = this.user.usuario.EMAIL_USUARIO.toLowerCase()
          let mail = this.user.usuario.EMAIL_USUARIO
          let err = await controller.PUT(this)
          if (!err) {
            emailer.sendMail(this, mail, 'Cambio de correo',
              'Buenas, junto con saludar le informamos que su correo electronico para ingresar al portal DelBarrio a sido cambiado exitosamente.')
          }
        } else {
          this.processing = false
        }
      })
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Editar Administrador'
    }
  }
}
</script>