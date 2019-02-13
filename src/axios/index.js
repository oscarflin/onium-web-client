/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import Axios from 'axios'

let headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

const token = localStorage.getItem('user-token');

if (token) {
  headers['Authorization'] = 'Bearer ' + token;
}

export default Axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL + '/api/v' + process.env.VUE_APP_API_VERSION,
  headers: {
    common: headers
  }
});
