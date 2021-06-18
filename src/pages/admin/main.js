import Antd from 'ant-design-vue'
// import '../../assets/css/reset.css'
// import Vuelidate from 'vuelidate'
import { yznReq, baseUrl } from '@/utils/yznhttp'
import 'ant-design-vue/dist/antd.less'


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.prototype.yznReq = yznReq;
Vue.prototype.BASEURL = baseUrl;
// Vue.use(Vuelidate)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')