import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import auth from './auth'
import leaveModule  from './leaveModule'
import helpers from './helpers'



export default store(function () {
  const Store = createStore({
    modules: {
      auth,
      leaveModule,
      helpers,
    },

  })

  return Store
})
