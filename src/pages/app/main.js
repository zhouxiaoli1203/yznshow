import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { yznReq, baseUrl } from '@/utils/yznhttp'
import Directive from '@/utils/directives'
import 'lib-flexible'
import Bridge from '@/utils/JSbridge'

// 样式
import '@/assets/css/reset.css'
import '@/assets/css/common.less'
import 'vant/lib/index.css';
import Vant from 'vant';

import Fns from '@/utils/common'
Object.keys(Fns).forEach(key => {
    Vue.prototype[key] = Fns[key]
})
import filters from '@/utils/filters'
filters(Vue)

Vue.use(Directive);
Vue.config.productionTip = false
Vue.prototype.yznReq = yznReq;
Vue.prototype.BASEURL = baseUrl;
Vue.prototype.$bridge = Bridge
Vue.use(Vant);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')