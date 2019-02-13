/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import axios from "../../axios";

import {
  GEO_FETCH_CITY_LIST,
  GEO_SET_CITY_LIST,
  GEO_RESET_CITY_LIST
} from '../actions/geo'

const state = {
  cities: []
};

const getters = {
  cities: state => state.cities,
};

const actions = {
  [GEO_FETCH_CITY_LIST]: ({ dispatch }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'geo/city',
        method: 'GET'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              dispatch(GEO_SET_CITY_LIST, resp.data.list);
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
  [GEO_SET_CITY_LIST]: ({ commit }, cities) => {
    return new Promise((resolve) => {
      commit(GEO_SET_CITY_LIST, cities);
      resolve();
    })
  },
  [GEO_RESET_CITY_LIST]: ({ commit }, cities) => {
    return new Promise((resolve) => {
      commit(GEO_RESET_CITY_LIST, cities);
      resolve();
    })
  }
};

const mutations = {
  [GEO_SET_CITY_LIST]: (state, cities) => {
    state.cities = cities;
  },
  [GEO_RESET_CITY_LIST]: (state) => {
    state.cities = [];
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
