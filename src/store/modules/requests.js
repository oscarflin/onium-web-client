/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import qs from 'qs'
import axios from "../../axios";

import {
  REQUESTS_FETCH_LIST,
  REQUESTS_SET_LIST,
  REQUESTS_FETCH,
  REQUESTS_POST,
  REQUESTS_RESET,
  REQUESTS_COUNTER_SET,
  REQUESTS_ARCHIVE,
  REQUESTS_RESPONSE_POST,
  REQUESTS_RESPONSE_FETCH
} from '../actions/requests'

const state = {
  requests: [],
  requestsCounter: 0
};

const getters = {
  requests: state => state.requests,
  requestsCounter: state => state.requestsCounter,
};

const actions = {
  [REQUESTS_FETCH_LIST]: ({ dispatch }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'requests',
        method: 'GET'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              dispatch(REQUESTS_SET_LIST, resp.data.requests);
              resolve();
              return;
            case 'error':
              reject();
              return;
          }
        })
        .catch(err => {
          reject(err);
        });
    })
  },
  [REQUESTS_FETCH]: ({ dispatch }, id) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'requests/' + id,
        method: 'GET'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              if ((resp.data.updated) && (!resp.data.request.seen)) {
                dispatch(REQUESTS_FETCH_LIST);
              }

              resolve(resp.data.request);
              return;
            case 'error':
              reject();
              return;
          }
        })
        .catch(err => {
          reject(err);
        });
    })
  },
  [REQUESTS_POST]: ({ dispatch }, request) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'requests',
        data: qs.stringify(request),
        method: 'POST'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              dispatch(REQUESTS_FETCH_LIST);
              resolve();
              return;
            case 'error':
              reject();
              return;
          }
        })
        .catch(err => {
          reject(err);
        });
    })
  },
  [REQUESTS_SET_LIST]: ({ commit, getters, state }, requests) => {
    return new Promise((resolve) => {
      commit(REQUESTS_COUNTER_SET, 0);

      switch (getters.userProfile.type) {
        case 'seeker':
          requests.forEach(function(request) {
            request.responses.forEach(function(response) {
              if (response.seen === false) {
                commit(REQUESTS_COUNTER_SET, (state.requestsCounter + 1));
              }
            });
          });
          break;
        case 'realtor':
          requests.forEach(function(request) {
            if (request.seen === false) {
              commit(REQUESTS_COUNTER_SET, (state.requestsCounter + 1));
            }
          });
          break;
      }

      commit(REQUESTS_SET_LIST, requests);
      resolve();
    })
  },
  [REQUESTS_ARCHIVE]: ({ dispatch }, id) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'requests/archive/' + id,
        method: 'PUT'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              dispatch(REQUESTS_FETCH_LIST);
              resolve();
              return;
            case 'error':
              reject();
              return;
          }
        })
        .catch(err => {
          reject(err);
        });
    })
  },
  [REQUESTS_RESET]: ({ commit }) => {
    return new Promise((resolve) => {
      commit(REQUESTS_RESET);
      commit(REQUESTS_COUNTER_SET, 0);
      resolve();
    })
  },
  [REQUESTS_RESPONSE_POST]: ({ dispatch }, response) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'requests/responses',
        data: qs.stringify(response),
        method: 'POST'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              dispatch(REQUESTS_FETCH_LIST);
              resolve();
              return;
            case 'error':
              reject();
              return;
          }
        })
        .catch(err => {
          reject(err);
        });
    })
  },
  [REQUESTS_RESPONSE_FETCH]: ({ dispatch }, id) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'requests/responses/' + id,
        method: 'GET'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              if ((resp.data.updated) && (!resp.data.response.seen)) {
                dispatch(REQUESTS_FETCH_LIST);
              }

              resolve(resp.data.response);
              return;
            case 'error':
              reject();
              return;
          }
        })
        .catch(err => {
          reject(err);
        });
    })
  },
};

const mutations = {
  [REQUESTS_SET_LIST]: (state, requests) => {
    state.requests = requests;
  },
  [REQUESTS_RESET]: (state) => {
    state.requests = [];
  },
  [REQUESTS_COUNTER_SET]: (state, value) => {
    state.requestsCounter = value;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
