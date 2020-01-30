import Vue from 'vue'
import Router from 'vue-router'

import Login from './views/Login.vue'

import store from '@/store'
import logger from '@/logger'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/logout',
      name: 'logout',
    },
    {
      path: '/',
      name: 'parking-status',
      component: () => import(/* webpackChunkName: "parking-status" */ './views/ParkingStatus.vue'),
    },
    {
      path: '/parking-history',
      name: 'parking-history',
      component: () => import(/* webpackChunkName: "parking-history" */ './views/ParkingHistory.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import(/* webpackChunkName: "users" */ './views/Users.vue'),
    },
    {
      path: '/users-history',
      name: 'users-history',
      component: () => import(/* webpackChunkName: "user-history" */ './views/UserHistory.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue'),
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import(/* webpackChunkName: "statistics" */ './views/ParkingStatistics.vue'),
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: () => import(/* webpackChunkName: "reservations" */ './views/UpcomingReservations.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  logger.debug('ROUTER: to', to, ', from', from)

  if (to.name === 'login') {
    next()
  } else if (!store.getters['auth/isLoggedIn']) {
    next('/login')
  } else if (to.name === 'logout' || to.name === '/logout') {
    await store.dispatch('auth/logout')
    next('/login')
  } else {
    next()
  }
})

export default router
