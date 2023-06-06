import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import HomePage from '../views/HomePage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import MainPage from '../views/MainPage.vue'
import DepositPage from '../views/DepositPage.vue'
import TradePage from '../views/TradePage.vue'
import OrderPage from '../views/OrderPage.vue'
import SellPage from '../views/SellPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
      children: [
        {
          path: '/',
          name: 'MainPage',
          component: MainPage
        },
        {
          path: '/trades',
          name: 'TradePage',
          component: TradePage
        },
        {
          path: '/buy',
          name: 'OrderPage',
          component: OrderPage
        },
        {
          path: '/sell/:id',
          name: 'SellPage',
          component: SellPage
        },
        {
          path: '/deposits',
          name: 'DepositPage',
          component: DepositPage
        }
      ]
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'RegisterPage',
      component: RegisterPage
    },

  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'MainPage' && !localStorage.getItem('access_token')) next({ name: 'LoginPage' })
  else if (to.name === 'LoginPage' && localStorage.getItem('access_token'))
    next({ name: 'MainPage' })
  else if (to.name === 'RegisterPage' && localStorage.getItem('access_token'))
    next({ name: 'MainPage' })
  else next()
})

export default router
