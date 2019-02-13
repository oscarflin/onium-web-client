/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import axios from "../../axios";

import {
  EVENTS_FETCH_LIST,
  EVENTS_SET_LIST,
  EVENTS_VIEW,
  EVENTS_RESET,
  EVENTS_COUNTER_SET
} from '../actions/events'

const state = {
  events: [],
  eventsCounter: 0
};

const getters = {
  events: state => state.events,
  eventsCounter: state => state.eventsCounter,
};

const actions = {
  [EVENTS_FETCH_LIST]: ({ dispatch }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'events',
        method: 'GET'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              dispatch(EVENTS_SET_LIST, resp.data.events);
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
  [EVENTS_SET_LIST]: ({ commit, state }, events) => {
    return new Promise((resolve) => {
      commit(EVENTS_COUNTER_SET, 0);

      events.forEach(function(event) {
        if (event.seen === false) {
          commit(EVENTS_COUNTER_SET, (state.eventsCounter + 1));
        }
      });

      commit(EVENTS_SET_LIST, events);
      resolve();
    })
  },
  [EVENTS_VIEW]: ({ dispatch }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'events',
        method: 'PUT'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              dispatch(EVENTS_FETCH_LIST);
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
  [EVENTS_RESET]: ({ commit }) => {
    return new Promise((resolve) => {
      commit(EVENTS_RESET);
      commit(EVENTS_COUNTER_SET, 0);
      resolve();
    })
  }
};

const mutations = {
  [EVENTS_SET_LIST]: (state, events) => {
    state.events = events;
  },
  [EVENTS_RESET]: (state) => {
    state.events = [];
  },
  [EVENTS_COUNTER_SET]: (state, value) => {
    state.eventsCounter = value;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
