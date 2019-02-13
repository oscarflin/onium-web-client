/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

require('dotenv').config();

import Vue from 'vue'
import axios from './axios'
import vueAxios from 'vue-axios'
import app from './app'
import router from './router'
import store from './store'
import socket from './socket'
import VueSocketIo from 'vue-socket.io'
import bootstrap from 'bootstrap-vue'
import multiSelect from 'vue-multiselect'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'nprogress/nprogress.css'

Vue.component('Multiselect', multiSelect);

Vue.use(vueAxios, axios);
Vue.use(bootstrap);
Vue.use(new VueSocketIo({
  debug: (process.env.VUE_APP_SOCKET_DEBUG === 'true'),
  connection: socket,
  vuex: {
    store,
    actionPrefix: 'SOCKET_'
  }
}));

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app');
