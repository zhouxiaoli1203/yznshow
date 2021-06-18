import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

import { yznReq, baseUrl } from '@/utils/yznhttp'
import 'lib-flexible'

import 'vant/lib/index.css';
import Vant from 'vant';

Vue.use(Vant);
Vue.config.productionTip = false
Vue.prototype.yznReq = yznReq;
Vue.prototype.BASEURL = baseUrl;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')