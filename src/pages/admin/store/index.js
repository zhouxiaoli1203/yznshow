  
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store


// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {
//     activityId: '',
//     activityType: 1,
//     activityStatus: '',
//     contentType: 1,
//     leafletInfo: {},
//     pageInfo: {},
//     sellInfo: {},
//     otherInfo: 

//   },
//   mutations: {
//     MODIFY(state, Payload) {
//       state[Payload.key] = Payload.value;
//     }
//   },
//   actions: {},
//   modules: {},
//   getters: {

//   }
// })