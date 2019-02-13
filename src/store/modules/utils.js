/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import {
  UTILS_PROCESSING_BEGIN,
  UTILS_PROCESSING_END,
  UTILS_PROCESSING_SET
} from '../actions/utils'

const state = {
  processing: false,
};

const getters = {
  processing: state => state.processing,
};

const actions = {
  [UTILS_PROCESSING_BEGIN]: ({ commit }) => {
    return new Promise((resolve) => {
      commit(UTILS_PROCESSING_SET, true);
      resolve();
    })
  },
  [UTILS_PROCESSING_END]: ({ commit }) => {
    return new Promise((resolve) => {
      commit(UTILS_PROCESSING_SET, false);
      resolve();
    })
  }
};

const mutations = {
  [UTILS_PROCESSING_SET]: (state, processing) => {
    state.processing = processing;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
