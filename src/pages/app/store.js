import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        STEP1_INIT: true, //制造中心是否重新获取数据
    },
    mutations: {
        MODIFY(state, Payload) {
            state[Payload.key] = Payload.value;
        }
    },
    actions: {},
    modules: {}
})