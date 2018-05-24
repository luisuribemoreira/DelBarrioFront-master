<template>
  <section id="publicacion" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-3 fondo-beige">
          <h2 class="text-center">Nuevo Administrador</h2>
          <form @submit.prevent="validateBeforeSubmit">
            <div class="form-group margin-top">
              <label for="name">Nombres</label>
              <input v-validate data-vv-rules="required" data-vv-as="nombre" name="name" type="text" v-model="user.NOMBRES" class="form-control"/>
              <small class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="name">Apellido Paterno</label>
              <input v-validate data-vv-rules="required" data-vv-as="apellido paterno" name="lastname" type="text" v-model="user.APELLIDO_PATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname')">{{ errors.first('lastname') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="name">Apellido Materno</label>
              <input v-validate data-vv-rules="required" data-vv-as="apellido materno" name="lastname2" type="text" v-model="user.APELLIDO_MATERNO" class="form-control"/>
              <small class="text-danger" v-show="errors.has('lastname2')">{{ errors.first('lastname2') }}</small>
            </div>
            <div class="form-group margin-top">
              <label for="date">Fecha de Nacimiento</label>
              <datepicker 
                language="es"
                :format='format'
                v-model="user.FECH_FECHA_NACIMIENTO"
                :bootstrapStyling = "true"
                name="date"
              ></datepicker>
            </div>
            <button type="submit" class="btn btn-default" @click="POST()">Ingresar</button>
          </form>
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import controller from '~/controllers/admin/admins'
import Datepicker from 'vuejs-datepicker'

export default {
  asyncData ({ app }) {
    return controller.GET(app, this)
  },
  data () {
    return {
      format: 'dd MMM, yyyy',
      user: {}
    }
  },
  components: {
    Datepicker
  },
  methods: {
    POST (client) {
      controller.POST(this)
    }
  },
  head () {
    return {
      title: 'Nuevo Emprendedor'
    }
  }
}
</script>