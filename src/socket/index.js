/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import SocketIo from 'socket.io-client'

let query = {};

const token = localStorage.getItem('user-token');

if (token) {
  query.token = token;
}

export default SocketIo(process.env.VUE_APP_SOCKET_URL, {
  path: '/socket',
  autoConnect: false,
  reconnectionAttempts: parseInt(process.env.VUE_APP_SOCKET_RECONNECTION_ATTEMPTS),
  reconnectionDelay: parseInt(process.env.VUE_APP_SOCKET_RECONNECTION_DELAY),
  query: query
});
