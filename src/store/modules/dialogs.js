/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import axios from "../../axios";

import {
  DIALOGS_FETCH_LIST,
  DIALOGS_FETCH_MESSAGES_LIST,
  DIALOGS_SET_LIST,
  DIALOGS_SET_CONTACT_MESSAGES,
  DIALOGS_COUNTER_SET,
  DIALOGS_RESET,
  DIALOGS_CONTACT_RESET
} from '../actions/dialogs'

const state = {
  dialogs: [],
  dialogsCounter: 0,
  contactDialog: {
    contact: null,
    messages: []
  }
};

const getters = {
  dialogs: state => state.dialogs,
  dialogsCounter: state => state.dialogsCounter,
  contactDialog: state => state.contactDialog,
};

const actions = {
  [DIALOGS_FETCH_LIST]: ({ dispatch }) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'dialogs',
        method: 'GET'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              dispatch(DIALOGS_SET_LIST, resp.data.dialogs);
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
  [DIALOGS_SET_LIST]: ({ commit, state }, dialogs) => {
    return new Promise((resolve) => {
      commit(DIALOGS_COUNTER_SET, 0);

      dialogs.forEach(function(dialog) {
        if ((dialog.contact._id === dialog.sender._id) && (dialog.seen === false)) {
          commit(DIALOGS_COUNTER_SET, (state.dialogsCounter + 1));
        }
      });

      commit(DIALOGS_SET_LIST, dialogs);
      resolve();
    })
  },
  [DIALOGS_FETCH_MESSAGES_LIST]: ({ commit }, dialog) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'dialogs/' + dialog,
        method: 'GET'
      })
        .then(resp => {
          if (!resp.data.result) {
            reject();
            return;
          }

          switch (resp.data.result) {
            case 'success':
              commit(DIALOGS_SET_CONTACT_MESSAGES, {
                contact: dialog,
                messages: resp.data.messages
              });
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
  [DIALOGS_RESET]: ({ commit }) => {
    return new Promise((resolve) => {
      commit(DIALOGS_RESET);
      commit(DIALOGS_COUNTER_SET, 0);
      commit(DIALOGS_CONTACT_RESET);
      resolve();
    })
  }
};

const mutations = {
  [DIALOGS_SET_LIST]: (state, dialogs) => {
    state.dialogs = dialogs;
  },
  [DIALOGS_SET_CONTACT_MESSAGES]: (state, contactDialog) => {
    state.contactDialog = contactDialog;
  },
  [DIALOGS_RESET]: (state) => {
    state.dialogs = [];
  },
  [DIALOGS_CONTACT_RESET]: (state) => {
    state.contactDialog = {
      contact: null,
      messages: []
    };
  },
  [DIALOGS_COUNTER_SET]: (state, value) => {
    state.dialogsCounter = value;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
