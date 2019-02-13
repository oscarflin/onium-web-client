/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress'
import store from '../store'

// Components
import Home from '../components/home'
import SignUp from '../components/signup'
import SignIn from '../components/signin'
import Requests from '../components/requests/list'
import AddRequest from '../components/requests/add'
import ViewRequest from '../components/requests/view'
import AddRequestResponse from '../components/requests/responses/add'
import ViewRequestResponse from '../components/requests/responses/view'
import Contacts from '../components/contacts'
import ContactsMessages from '../components/contacts/messages'
import Events from '../components/events'
import Settings from '../components/settings'
import Profile from '../components/profile/index'
import AboutTerms from '../components/about/terms'
import Developers from '../components/developers'
import Error404 from '../components/error404'

Vue.use(VueRouter);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }

  next({ name: 'home' });
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }

  next({ name: 'signin' });
};

const ifSeekerAuthenticated = (to, from, next) => {
  if ((store.getters.isAuthenticated) && (store.getters.userProfile.type === 'seeker')) {
    next();
    return;
  }

  next({ name: 'home' });
};

const ifRealtorAuthenticated = (to, from, next) => {
  if ((store.getters.isAuthenticated) && (store.getters.userProfile.type === 'realtor')) {
    next();
    return;
  }

  next({ name: 'home' });
};

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // Main page
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // New User Registration
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
      beforeEnter: ifNotAuthenticated
    },
    // Login for registered users
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
      beforeEnter: ifNotAuthenticated
    },
    // Requests page
    {
      path: '/requests',
      name: 'requests',
      component: Requests,
      props: true,
      beforeEnter: ifAuthenticated
    },
    // Add request page
    {
      path: '/requests/add',
      name: 'addRequest',
      component: AddRequest,
      beforeEnter: ifSeekerAuthenticated
    },
    // View request
    {
      path: '/requests/:id',
      name: 'viewRequest',
      component: ViewRequest,
      props: true,
      beforeEnter: ifAuthenticated
    },
    // View request response
    {
      path: '/responses/:id',
      name: 'viewRequestResponse',
      component: ViewRequestResponse,
      props: true,
      beforeEnter: ifAuthenticated
    },
    // Add response to request
    {
      path: '/requests/:id/responses/add',
      name: 'addRequestResponse',
      component: AddRequestResponse,
      beforeEnter: ifRealtorAuthenticated
    },
    // Contacts page
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts,
      beforeEnter: ifAuthenticated
    },
    // Contact messages page
    {
      path: '/contacts/:id',
      name: 'contactsMessages',
      component: ContactsMessages,
      props: true,
      beforeEnter: ifAuthenticated
    },
    // Events page
    {
      path: '/events',
      name: 'events',
      component: Events,
      beforeEnter: ifAuthenticated
    },
    // Settings page
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      beforeEnter: ifRealtorAuthenticated
    },
    // Profile page
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: ifAuthenticated
    },
    // Terms page
    {
      path: '/about/terms',
      name: 'aboutTerms',
      component: AboutTerms
    },
    // For developers page
    {
      path: '/developers',
      name: 'developers',
      component: Developers
    },
    // 404 (not found) page
    {
      path: '*',
      name: 'error404',
      component: Error404
    }
  ]
});

nprogress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    nprogress.start();
  }

  next();
});

router.afterEach(() => {
  nprogress.done();
});

export default router;
