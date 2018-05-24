# APP PROYECTO DELBARRIO.PROVIDENCIA.CL


v1.0

Se consideran las siguientes tecnologías para el desarrollo del cliente REST.

* Vuejs 2.4
* Node 8+
* Nuxt 1.0.0 - RC11
* Nuxt/Axios 4.5.0
* JWT-Decode 2.2.0
* Js-Cookie
* Vee-Validate

### Caracteristicas consideradas:
* Separación de rutas en estructura de carpetas
* Vista por componente
* Lógica de modelos separada de componentes
* Permisos de ruta por JWT -> LocalStorage
* Utilización de ES6

___________________________________________________________________________
## INSTALACION EENTORNO DE DESARROLLO  ##

(Ver Documentación API)


___________________________________________________________________________
## EJECUCION ENTORNO DE DESARROLLO  ##


1.- Estructura de carpetas`:  Se presentan las siguientes carpetas y documentos relevantes
	
```
├── .nuxt
├── assets
├── node_modules
├── controllers
├── layouts
├── pages
├── static
├── nuxt.config.js
├── package.json
└── ---
```

Donde:

* .nuxt                 :  Generada por nuxt

* assets                :  Assets a compilar

* controllers           :  Archivos de controladores de modelos y utilitarios

* layouts               :  Templates generales

* pages					:  Componentes correspondientes a cada vista

* static			    :  Carpeta en la cual se encuentran elementos estáticos como .css y plugins .js que no corresponden a módulos npm

* nuxt.config.js		:  Archivo de configuración de Nuxt


___________________________________________________________________________
## DEFINICION DE METODOS HTTP UTILIZADOS EN LA API ##
* GET:      Consultar y leer recursos
* POST:     Permite crear un nuevo recurso
* PUT:      Permite editar un recurso
* DELETE:   Elimina un recurso