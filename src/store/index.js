/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import Vue from 'vue'
import Vuex from 'vuex'

import users from './modules/users'
import requests from './modules/requests'
import events from './modules/events'
import dialogs from './modules/dialogs'
import socket from './modules/socket'
import utils from './modules/utils'
import geo from './modules/geo'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users,
    requests,
    events,
    dialogs,
    socket,
    utils,
    geo,
  },
  strict: process.env.NODE_ENV !== 'production'
});
