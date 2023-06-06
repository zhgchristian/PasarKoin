import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

// const BASE_URL = 'https://pasarkoin-production.up.railway.app'

const BASE_URL = 'http://localhost:3000'

export const useRegisterStore = defineStore('register', {
  state: () => ({
    isLoggedIn: false,
    profile: {}
  }),
  actions: {
    errorHandler(error) {
      if (error.message.includes('401')) {
        swal('Session Expired', 'Please login', 'warning')
        localStorage.clear()
        this.isLoggedIn = false
        this.router.push({ name: 'login' })
      }

      const BackErrors = error.response.data.message.split(',\n')

      BackErrors.forEach((error) => {
        if (error.includes('Validation error'))
          return Toastify({
            text: error.substring(18),
            className: 'info',
            style: {
              background: 'linear-gradient(to right, #c93d3d, #c25151)'
            }
          }).showToast()

        if (error === 'email must be unique')
          return Toastify({
            text: 'Email already registered',
            className: 'info',
            style: {
              background: 'linear-gradient(to right, #c93d3d, #c25151)'
            }
          }).showToast()
      })
    },

    async fetchProfile() {
      try {
        const profileData = await axios.get(`${BASE_URL}/trades/user`, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        this.profile = profileData.data
      } catch (err) {
        swal('Error', 'Failed to fetch profile data', 'error')
      }
    },

    async register(obj) {
      try {
        const dataRegister = await axios.post(`${BASE_URL}/register`, obj)
        swal('Register Success!', 'You can now login.', 'success')
        this.router.push({ name: 'LoginPage' })
      } catch (err) {
        this.errorHandler(err)
      }
    },

    async login(obj) {
      try {
        const dataLogin = await axios.post(`${BASE_URL}/login`, obj)

        localStorage.setItem('access_token', dataLogin.data.access_token)
        this.isLoggedIn = true
        this.router.push({ name: 'MainPage' })
      } catch (err) {
        swal('Login failed', 'Wrong username or password', 'error')
      }
    },

    checkLogin() {
      if (localStorage.getItem('access_token')) {
        this.isLoggedIn = true
      }
    },

    logout() {
      localStorage.clear()
      this.isLoggedIn = false
      this.router.push({ name: 'LoginPage' })
    }
  }
})

export const useTradeStore = defineStore('trade', {
  state: () => ({
    openTrades: [],
    commoditiesList: [],
    binanceMarketPrice: '',
    commodityInfo: {},
    closedTrades: [],
    depositData: [],
    stakingData: [],
    summaryData: []
  }),
  actions: {
    async handleDeposit(amount) {
      try {
        const deposit = await axios.post(`${BASE_URL}/deposits/prepay`, amount, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        snap.pay(deposit.data.token, {
          onSuccess: async function (result) {
            const confirmation = await axios.post(`${BASE_URL}/deposits/postpay`, result)
            swal('Payment succesfull', 'Money has been credited to your account.', 'success')
          },
          onPending: function (result) {
            swal('Failed payment', 'Window closed without payment. Please make a new deposit.', 'warning')
          },
          onError: function (result) {
            swal('Failed payment', 'Window closed without payment. Please make a new deposit.', 'warning')
          },
          onClose: function () {
            swal('Failed payment', 'Window closed without payment. Please make a new deposit.', 'warning')
          }
        })

        this.router.push({ name: 'MainPage' })
      } catch (err) {
        swal('Deposit failed', 'Something went wrong', 'error')
      }
    },

    async fetchOpenTrade() {
      try {
        const openTrades = await axios.get(`${BASE_URL}/trades`, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        this.openTrades = openTrades.data
      } catch (err) {
        swal('Failed', 'Something went wrong', 'error')
      }
    },

    async fetchCommodities() {
      try {
        const commodities = await axios.get(`${BASE_URL}/trades/commodities`, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        this.commoditiesList = commodities.data
      } catch (err) {
        swal('Failed', 'Something went wrong', 'error')
      }
    },

    async fetchCommodityById(id) {
      try {
        const commodityInfo = await axios.get(`${BASE_URL}/trades/commodities/${id}`, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        this.binanceMarketPrice = commodityInfo.data.marketPrice
        this.commodityInfo = commodityInfo.data.commodity
      } catch (err) {
        swal('Failed', 'Something went wrong', 'error')
      }
    },

    async buyCrypto(obj) {
      try {
        const newOrder = {
          CommodityId: obj.CommodityId[0],
          quantity: obj.quantity
        }

        const postOrder = await axios.post(`${BASE_URL}/trades/buy`, newOrder, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        swal('Congratulations',`You just bought ${obj.quantity} ${obj.CommodityId[1]}`, 'success')
        this.router.push({ name: 'TradePage' })
      } catch (err) {
        swal('Failed', 'Something went wrong', 'error')
      }
    },

    async sellCrypto(id, qty) {
      try {
        const data = {
          CommodityId: +id,
          quantity: qty
        }

        const sellOrder = await axios.post(`${BASE_URL}/trades/sell`, data, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        swal('Done',`Sell success`, 'success')
        this.router.push({ name: 'TradePage' })
      } catch (err) {
        swal('Failed', 'Something went wrong', 'error')
      }
    },

    async fetchClosedTrade() {
      try {
        const closedTrades = await axios.get(`${BASE_URL}/trades/close`, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        this.closedTrades = closedTrades.data
      } catch(err) {
      }
    },

    async fetchDeposits() {
      try {
        const depositData = await axios.get(`${BASE_URL}/deposits`, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        this.depositData = depositData.data.deposits
      } catch(err) {
        swal('Failed', 'Something went wrong', 'error')
      }
    },

    async fetchStakings() {
      try {
        const stakingData = await axios.get(`${BASE_URL}/trades/stakings`, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        this.stakingData = stakingData.data
      } catch(err) {
        swal('Failed', 'Something went wrong', 'error')
      }
    },

    async getSummary() {
      try {
        const summaries = await axios.get(`${BASE_URL}/trades/summary`, {
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })

        this.summaryData = summaries.data
        
      } catch(err) {
        swal('Failed', 'Something went wrong', 'error')
      }
    }

    }
  }
)
