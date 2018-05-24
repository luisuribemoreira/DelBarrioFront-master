import Vue from 'vue'

/* Pick one way between the 2 following ways */

// only import the icons you use to reduce bundle size
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/pencil-square-o'
import 'vue-awesome/icons/angle-right'
import 'vue-awesome/icons/angle-down'
import 'vue-awesome/icons/camera'
import 'vue-awesome/icons/info-circle'
import 'vue-awesome/icons/comment'
import 'vue-awesome/icons/comments-o'
import 'vue-awesome/icons/twitter-square'
import 'vue-awesome/icons/facebook-square'
import 'vue-awesome/icons/phone'
import 'vue-awesome/icons/envelope-o'
import 'vue-awesome/icons/exclamation-circle'
import 'vue-awesome/icons/square'
import 'vue-awesome/icons/question-circle'
import 'vue-awesome/icons/home'
import 'vue-awesome/icons/wrench'

/* Register component with one of 2 methods */
import Icon from 'vue-awesome/components/Icon'

// globally (in your main .js file)
Vue.component('icon', Icon)
