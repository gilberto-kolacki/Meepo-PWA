/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
Vue.use(Vuesax)


// Theme Configurations
import '../themeConfig.js'

// Firebase
import '@/firebase/firebaseConfig'

// Auth0 Plugin
import AuthPlugin from "./plugins/auth";
Vue.use(AuthPlugin);

// import VuePouchDB from 'vuejs-pouchdb' 
// Vue.use(VuePouchDB, { name: 'fv-pwa-db' })

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css';


// Vue Router
import router from './router'


import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

import money from 'v-money'
Vue.use(money, {precision: 2})

// Vuex Store
import store from './store/store'


// Vuesax Admin Filters
import './filters/filters'

// VeeValidate
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);


// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

import './registerServiceWorker';

// Feather font icon
require('./assets/css/iconfont.css')

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
