import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'

import store from '@/store'
import logger from './logger'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
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
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
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
