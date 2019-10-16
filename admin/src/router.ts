import Vue from 'vue'
import Router from 'vue-router'

import Login from './views/Login.vue'
import ParkingStatus from './views/ParkingStatus.vue'

import store from '@/store'
import logger from '@/logger'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout'
    },
    {
      path: '/',
      name: 'parking-status',
      component: ParkingStatus
    },
    {
      path: '/parking-history',
      name: 'parking-history',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "empty" */ './views/Empty.vue')
    },
    {
      path: '/users',
      name: 'users',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "empty" */ './views/Empty.vue')
    },
    {
      path: '/users-history',
      name: 'users-history',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "empty" */ './views/Empty.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "empty" */ './views/Empty.vue')
    }
  ]
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
