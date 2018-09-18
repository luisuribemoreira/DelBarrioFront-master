<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 offset-md-3">
          <h2 class="text-center">Nuevo Emprendedor</h2>
          <hr>
          <form @submit.prevent="validateBeforeSubmit">
            <h4>Datos del Emprendimiento</h4>
            <div class="form-group margin-top">
              <label for="realname">Nombre Empresa</label>
              <input v-validate data-vv-rules="required" data-vv-as="nombre empresa" name="realname" type="text" v-model.trim="entrepreneur.DESC_NOMBRE_EMPRESA" class="form-control"/>
              <small class="text-danger" v-show="errors.has('realname')">{{ errors.first('realname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="rut">RUT</label>
              <input v-validate data-vv-rules="required|alpha_num|min:8" data-vv-as="RUT" name="rut" type="text" v-model.trim="entrepreneur.RUT_EMPRENDEDOR" class="form-control"/>
              <small class="text-danger" v-show="errors.has('rut')">{{ errors.first('rut')}}</small>
            </div>
            <div class="form-group margin-top">
              <label for="workfield">Rubro</label>
              <select v-model.trim="entrepreneur.IDEN_RUBRO" class="form-control" v-validate data-vv-rules="required" :size="5" name="workfield">
                <option v-for="workfield in workfields" v-if="workfield.FLAG_VIGENTE" :key="workfield.IDEN_RUBRO" :value="workfield.IDEN_RUBRO">
                  {{workfield.NOMB_RUBRO}}
                </option>
              </select>
              <small class="text-danger" v-show="errors.has('workfield')">{{ errors.first('workfield') }}</small>
            </div>
            <hr>
            <h4>Datos de emprendedor</h4>
            <div class="form-group margin-top">
              <label for="email">Correo electrónico</label>
              <input v-validate data-vv-rules="required|email" data-vv-as="correo electrónico" name="email" type="text" v-model.trim="entrepreneur.EMAIL_USUARIO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</small>
            </div>
            <div>
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
import controller from '~/controllers/admin/entrepreneurs'
import emailer from '~/controllers/admin/emailer'
import workfieldcontroller from '~/controllers/admin/workfields'

// sobrescritura de mensaje para alpha_num en RUT
const dict = {
  custom: {
    rut: {
      alpha_num: 'El formato del RUT no debe contener puntos ni guion. (Ej: 16712581k)'
    }
  }
}

export default {
  data () {
    return {
      entrepreneur: { DESC_PASSWORD: Math.random().toString(36).slice(-8) }, // Clave autogenerada de 8 caracteres
      message: false,
      processing: false
    }
  },
  mounted () {
    this.$validator.localize('es', dict)
  },
  asyncData ({ app }) {
    return workfieldcontroller.GETAll(app)
      .then(({ workfields }) => {
        return {
          workfields: workfields
        }
      })
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          this.entrepreneur.DESC_EMPRENDEDOR = 'DESCRIPCION TEMPORAL'
          this.entrepreneur.DESC_NOMBRE_FANTASIA = 'NOMBRE TEMPORAL'
          this.entrepreneur.FECH_CREACION = -1
          this.entrepreneur.EMAIL_USUARIO = this.entrepreneur.EMAIL_USUARIO.toLowerCase()
          let mail = this.entrepreneur.EMAIL_USUARIO
          let pass = this.entrepreneur.DESC_PASSWORD
          let err = await controller.POST(this)
          if (!err) {
            emailer.sendMail(this, mail, 'Usuario Ingresado',
              'Su usuario ha sido registrado con el correo: ' + mail + ' y contraseña: ' + pass)
          }
        }
        this.processing = false
      })
    }
  },
  head () {
    return {
      title: 'Nuevo Emprendedor'
    }
  }
}
</script>
