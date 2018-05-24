<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-3 fondo-beige">
          <h2 class="text-center">Nuevo Emprendedor</h2>
          <hr>
          <form @submit.prevent="validateBeforeSubmit">
            <h4>Datos del Emprendimiento</h4>
            <div class="form-group margin-top">
              <label for="name">Nombre de fantasía</label>
              <input v-validate data-vv-rules="required" data-vv-as="nombre" name="name" type="text" v-model="entrepreneur.DESC_NOMBRE_FANTASIA" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="realname">Nombre Empresa</label>
              <input v-validate data-vv-rules="required" data-vv-as="nombre empresa" name="realname" type="text" v-model="entrepreneur.DESC_NOMBRE_EMPRESA" class="form-control"/>
              <small class="text-danger" v-show="errors.has('realname')">{{ errors.first('realname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="rut">RUT</label>
              <input v-validate data-vv-rules="required|alpha_num" data-vv-as="RUT" name="rut" type="text" v-model="entrepreneur.RUT_EMPRENDEDOR" class="form-control"/>
              <small class="text-danger" v-show="errors.has('rut')">{{ errors.first('rut') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="description">Descripcion</label>
              <textarea v-validate data-vv-rules="required" data-vv-as="descripción" name="description" type="text" v-model="entrepreneur.DESC_EMPRENDEDOR" class="form-control"></textarea>
              <small class="text-danger" v-show="errors.has('description')">{{ errors.first('description') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="workfield">Rubro</label>
              <select v-model="entrepreneur.IDEN_RUBRO" class="form-control" v-validate data-vv-rules="required" :size="5" name="workfield">
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
              <input v-validate data-vv-rules="required|email" data-vv-as="correo electrónico" name="email" type="text" v-model="entrepreneur.EMAIL_USUARIO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="pass">Clave municipalidad</label>
              <input v-validate data-vv-rules="required" data-vv-as="clave de municipalidad" name="pass" type="text" v-model="entrepreneur.DESC_PASSWORD" class="form-control"/>
              <small class="text-danger" v-show="errors.has('pass')">{{ errors.first('pass') }}</small>
            </div>
            <div>
            </div>
            <button type="submit" class="btn btn-default">Guardar</button>
          </form>
          <div v-if='message'>
            <span>{{message}}</span>
          </div>
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import controller from '~/controllers/admin/entrepreneurs'
import workfieldcontroller from '~/controllers/admin/workfields'

export default {
  data () {
    return {
      entrepreneur: {},
      message: false
    }
  },
  asyncData ({ app }) {
    return workfieldcontroller.GETAll(app)
      .then(workfields => {
        return controller.GETAll(app)
          .then(entrepreneurs => {
            return {
              entrepreneurs: entrepreneurs.entrepreneurs,
              workfields: workfields
            }
          })
      })
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          controller.POST(this)
        }
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
