/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import Vue from 'vue'
import qs from 'qs'
import axios from '../../axios'
import socket from '../../socket'

import {
  USER_INIT,
  USER_RESET,
  USER_INIT_SUCCESS,
  USER_INIT_ERROR,
  USER_AUTH_REQUEST,
  USER_AUTH_ERROR,
  USER_AUTH_SUCCESS,
  USER_AUTH_LOGOUT
} from '../actions/users'

import {
  REQUESTS_SET_LIST,
  REQUESTS_RESET
} from '../actions/requests'

import {
  EVENTS_SET_LIST,
  EVENTS_RESET
} from '../actions/events'

import {
  DIALOGS_SET_LIST,
  DIALOGS_RESET
} from '../actions/dialogs'

import {
  SOCKET_CLOSE,
  SOCKET_OPEN
} from '../actions/socket';

import {
  GEO_SET_CITY_LIST,
  GEO_RESET_CITY_LIST
} from '../actions/geo';

import {
  UTILS_PROCESSING_BEGIN,
  UTILS_PROCESSING_END
} from '../actions/utils';

const state = {
  init: null,
  token: localStorage.getItem('user-token') || null,
  profile: qs.parse(localStorage.getItem('user-profile')) || null
};

const getters = {
  init: state => state.init,
  token: state => state.token,
  isAuthenticated: state => !!state.token,
  userProfile: state => state.profile
};

const actions = {
  [USER_INIT]: ({ dispatch, commit, state }) => {
    return new Promise((resolve, reject) => {
      if (state.token === null) {
        commit(USER_INIT_SUCCESS);
        resolve();
      } else {
        dispatch(UTILS_PROCESSING_BEGIN);

        axios({
          url: 'users/init',
          method: 'GET'
        })
          .then(resp => {
            dispatch(UTILS_PROCESSING_END);

            if (resp.data.result === 'error') {
              dispatch(USER_INIT_ERROR);
              reject();
              return;
            }

            dispatch(USER_INIT_SUCCESS, resp.data.init);
            resolve();
          })
          .catch(() => {
            dispatch(UTILS_PROCESSING_END);
            dispatch(USER_INIT_ERROR);
          });
      }
    })
  },
  [USER_INIT_SUCCESS]: ({ dispatch, commit }, data) => {
    return new Promise((resolve) => {
      dispatch(GEO_SET_CITY_LIST, data.cities);
      dispatch(REQUESTS_SET_LIST, data.requests);
      dispatch(EVENTS_SET_LIST, data.events);
      dispatch(DIALOGS_SET_LIST, data.dialogs);
      dispatch(SOCKET_OPEN);
      commit(USER_INIT_SUCCESS);
      resolve();
    })
  },
  [USER_INIT_ERROR]: ({ dispatch, commit }) => {
    return new Promise((resolve) => {
      dispatch(USER_RESET);
      commit(USER_INIT_ERROR);
      resolve();
    })
  },
  [USER_AUTH_REQUEST]: ({ dispatch, commit }, auth) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'users/auth',
        data: qs.stringify(auth),
        method: 'POST'
      })
        .then(resp => {
          if (resp.data.result === 'error') {
            dispatch(USER_RESET);
            commit(USER_AUTH_ERROR);
            reject();
            return;
          }

          dispatch(USER_AUTH_SUCCESS, resp.data);
          resolve(resp.data);
        })
        .catch(() => {
          dispatch(USER_RESET);
          commit(USER_AUTH_ERROR);
          reject();
        });
    })
  },
  [USER_AUTH_LOGOUT]: ({ dispatch, commit }) => {
    return new Promise((resolve) => {
      dispatch(USER_RESET);
      commit(USER_AUTH_LOGOUT);
      resolve();
    })
  },
  [USER_AUTH_SUCCESS]: ({ dispatch, commit }, data) => {
    return new Promise((resolve) => {
      localStorage.setItem('user-token', data.token);
      localStorage.setItem('user-profile', qs.stringify(data.profile));

      axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
      socket.io.opts.query.token = data.token;

      commit(USER_AUTH_SUCCESS, data);
      dispatch(USER_INIT);

      resolve();
    })
  },
  [USER_RESET]: ({ dispatch }) => {
    return new Promise((resolve) => {
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-profile');

      delete axios.defaults.headers.common['Authorization'];
      delete socket.io.opts.query.token;

      dispatch(GEO_RESET_CITY_LIST);
      dispatch(SOCKET_CLOSE);
      dispatch(REQUESTS_RESET);
      dispatch(EVENTS_RESET);
      dispatch(DIALOGS_RESET);

      resolve();
    })
  }
};

const mutations = {
  [USER_INIT_SUCCESS]: (state) => {
    state.init = true;
  },
  [USER_INIT_ERROR]: (state) => {
    state.init = false;
  },
  [USER_AUTH_SUCCESS]: (state, data) => {
    state.token = data.token;
    Vue.set(state, 'profile', data.profile);
  },
  [USER_AUTH_ERROR]: (state) => {
    state.token = null;
    Vue.set(state, 'profile', null);
  },
  [USER_AUTH_LOGOUT]: (state) => {
    state.token = null;
    Vue.set(state, 'profile', null);
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
