/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import socket from '../../socket'

import {
  SOCKET_OPEN,
  SOCKET_CLOSE,
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
  SOCKET_ERROR,
  // Actions
  SOCKET_NEW_INCOMING_REQUEST,
  SOCKET_ARCHIVE_ACTIVE_INCOMING_REQUEST,
  SOCKET_ARCHIVE_ACTIVE_INCOMING_REQUEST_EVENT,
  SOCKET_NEW_REQUEST_RESPONSE
} from '../actions/socket'

import {
  REQUESTS_FETCH_LIST
} from '../actions/requests'

import {
  EVENTS_FETCH_LIST
} from '../actions/events'

const state = {
  connected: false,
  error: false
};

const actions = {
  [SOCKET_OPEN]: () => {
    return new Promise((resolve) => {
      socket.open();
      resolve();
    })
  },
  [SOCKET_CLOSE]: () => {
    return new Promise((resolve) => {
      socket.close();
      resolve();
    })
  },
  [SOCKET_CONNECT]: ({ commit }) => {
    return new Promise((resolve) => {
      commit(SOCKET_CONNECT);
      resolve();
    })
  },
  [SOCKET_DISCONNECT]: ({ commit }) => {
    return new Promise((resolve) => {
      commit(SOCKET_DISCONNECT);
      resolve();
    })
  },
  [SOCKET_ERROR]: ({ commit }) => {
    return new Promise((resolve) => {
      commit(SOCKET_ERROR);
      resolve();
    })
  },
  // Actions
  [SOCKET_NEW_INCOMING_REQUEST]: ({ dispatch }) => {
    return new Promise((resolve) => {
      dispatch(REQUESTS_FETCH_LIST);
      resolve();
    })
  },
  [SOCKET_ARCHIVE_ACTIVE_INCOMING_REQUEST]: ({ dispatch }) => {
    return new Promise((resolve) => {
      dispatch(REQUESTS_FETCH_LIST);
      resolve();
    })
  },
  [SOCKET_ARCHIVE_ACTIVE_INCOMING_REQUEST_EVENT]: ({ dispatch }) => {
    return new Promise((resolve) => {
      dispatch(EVENTS_FETCH_LIST);
      resolve();
    })
  },
  [SOCKET_NEW_REQUEST_RESPONSE]: ({ dispatch }) => {
    return new Promise((resolve) => {
      dispatch(REQUESTS_FETCH_LIST);
      resolve();
    })
  }
};

const mutations = {
  [SOCKET_CONNECT]: (state) => {
    state.connected = true;
  },
  [SOCKET_DISCONNECT]: (state) => {
    state.connected = false;
  },
  [SOCKET_ERROR]: (state) => {
    state.error = true;
  }
};

export default {
  state,
  actions,
  mutations,
};
