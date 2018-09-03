<template>
  <section class="container">
    <div>
      <h1>
        Formulario de registro de clientes
      </h1>
             <div class="col-lg-6">
          <form @submit.prevent="validateBeforeSubmit">
              <div class="form-group margin-top">
              <label for="email">Correo electrónico</label><span style="color: red"> (Formato ej: cliente@cliente.cl)</span>
              <input v-validate data-vv-rules="required|email" data-vv-as="correo electrónico" name="email" type="text" v-model="user.EMAIL_USUARIO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="name">Nombres</label><span style="color: red"> (Formato ej: Marcelo Díaz)</span>
              <input v-validate data-vv-rules="required" data-vv-as="nombre" name="name" type="text" v-model="persona.NOMBRES" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname">Apellido Paterno</label><span style="color: red"> (Formato ej: Pérez)</span>
              <input v-validate data-vv-rules="required" data-vv-as="apellido paterno" name="lastname" type="text" v-model="persona.APELLIDO_PATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname')">{{ errors.first('lastname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="lastname2">Apellido Materno</label><span style="color: red"> (Formato ej: Gallardo)</span>
              <input v-validate data-vv-rules="required" data-vv-as="apellido materno" name="lastname2" type="text" v-model="persona.APELLIDO_MATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname2')">{{ errors.first('lastname2') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="date">Fecha de Nacimiento</label>
              <datepicker 
                language="es"
                :format='format'
                v-model="persona.FECH_FECHA_NACIMIENTO"
                :bootstrapStyling = "true"
                name="date"
              ></datepicker>
            </div>
            <div v-if="dataErrorMsg.error_edad">
              <small class="text-danger">{{ dataErrorMsg.error_edad }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass">Contraseña</label><span style="color: red"> (*No utilice palabras o números de conocimiento público)</span>
              <input v-validate data-vv-rules="min:6" data-vv-as="contraseña" name="pass" type="password" v-model="user.pass" class="form-control"/>
              <small class="text-danger" v-show="errors.has('pass')">{{ errors.first('pass') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass2">Confirmar Contraseña</label>
              <input type="password" data-vv-as="contraseña" name="pass2" v-model="user.pass2" class="form-control"/>
              <small class="text-danger" v-if="dataErrorMsg.error_pw">{{ dataErrorMsg.error_pw }}</small>
            </div>
              <button type="submit" class="btn btn-default">Registrar</button>
            </form>
            <div v-if='message'>
            <span class="text-danger">{{message}}</span>
            </div>
        </div>
    </div>
  </section>
</template>

<script>
import customValidations from '~/controllers/customvalidations'
import Datepicker from 'vuejs-datepicker'
import controller from '~/controllers/admin/myaccount'

const dict = {
  custom: {
    rut: {
      alpha_num: 'El formato del RUT no debe contener puntos ni guion. (Ej: 16712581k)'
    }
  }
}
export default {
  middleware: 'anonymous',
  data () {
    return {
      selected: false,
      format: 'dd MMM, yyyy',
      dataErrorMsg: { error_edad: undefined, error_pw: undefined, error_foto: undefined },
      user: {},
      persona: {}
    }
  },
  mounted () {
    this.$validator.localize('es', dict)
  },
  components: {
    Datepicker
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then(async (result) => {
        // Se limpian los mensajes
        this.dataErrorMsg = { error_edad: undefined, error_pw: undefined, error_foto: undefined }
        // Se valida si la fecha ingresada coincide para poseer 18 años de edad o mas
        if (customValidations.isUnderAge(this.persona.FECH_FECHA_NACIMIENTO)) {
          this.dataErrorMsg.error_edad = 'Debe ser mayor de edad'
        }

        // Se valida que las contraseñas coincidan
        if (this.user.pass && (!this.user.pass2 || this.user.pass !== this.user.pass2)) {
          this.dataErrorMsg.error_pw = 'Las contraseñas deben coincidir'
        }
        if (this.dataErrorMsg.error_edad || this.dataErrorMsg.error_pw) {
          result = undefined
        }

        if (result) {
          controller.POSTCliente(this)
        }
      })
    },
    head () {
      return {
        title: 'Registro'
      }
    }
  }
}
</script>
