<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-3 fondo-beige">
          <h2 class="text-center">Editar Emprendedor</h2>
          <hr>
          <form @submit.prevent="validateBeforeSubmit">
            <h4>Datos del Emprendimiento</h4>
            <div class="form-group margin-top">
              <label for="realname">Nombre Empresa</label>
              <input v-validate data-vv-rules="required" pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,64}" title="Sólo letras" data-vv-as="nombre empresa" name="realname" type="text" v-model.trim="entrepreneur.DESC_NOMBRE_EMPRESA" class="form-control"/>
              <small class="text-danger" v-show="errors.has('realname')">{{ errors.first('realname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="rut">RUT</label>
              <input v-validate data-vv-rules="required|alpha_num|min:8" data-vv-as="RUT" name="rut" type="text" v-model.trim="rut" class="form-control"/>
              <small class="text-danger" v-show="errors.has('rut')">{{ errors.first('rut') }}</small>
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
              <input v-validate data-vv-rules="required|email" data-vv-as="correo electrónico" name="email" type="text" v-model.trim="entrepreneur.usuario.EMAIL_USUARIO" class="form-control"/>
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
import controller from '~/controllers/admin/entrepreneurs'
import workfieldcontroller from '~/controllers/admin/workfields'
import emailer from '~/controllers/admin/emailer'

export default {
  data () {
    this.$store.state.title = 'ModerarEmprendedor'
    return {
      message: false,
      processing: false
    }
  },
  asyncData ({ app, params, redirect, store }) {
    store.commit('SET_TITLE', 'ModerarEmprendedor')
    return workfieldcontroller.GETAll(app)
      .then(workfields => {
        return controller.GET(app, params.id)
          .then(entrepreneur => {
            if (!entrepreneur) redirect('/')
            return {
              id: entrepreneur.id,
              entrepreneur: entrepreneur.entrepreneur,
              rut: entrepreneur.entrepreneur.RUT_EMPRENDEDOR + entrepreneur.entrepreneur.DV_EMPRENDEDOR,
              workfields: workfields.workfields
            }
          })
      })
  },
  methods: {
    validateBeforeSubmit () {
      if (this.processing) return
      this.processing = true
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          this.entrepreneur.usuario.EMAIL_USUARIO = this.entrepreneur.usuario.EMAIL_USUARIO.toLowerCase()
          let mail = this.entrepreneur.usuario.EMAIL_USUARIO
          let err = await controller.PUT(this)
          if (!err) {
            emailer.sendMail(this, mail, 'Cambio de correo',
              'Buenas, junto con saludar le informamos que su correo electronico para ingresar al portal DelBarrio a sido cambiado exitosamente.')
          }
        }
        this.processing = false
      })
    }
  },
  head () {
    return {
      title: 'Editar Emprendedor'
    }
  }
}
</script>
