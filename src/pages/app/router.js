import Vue from 'vue'
import VueRouter from 'vue-router'
import index from './views/index.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: { name: "index" } }, // 重定向到主页
    {
        path: '/index',
        name: 'index',
        meta: { title: "模板库", index: 1 },
        component: index
        
    },
    {
        path: '/mine',
        name: 'mine',
        meta: { title: "我的活动", index: 2, keepAlive: true, },
        component: () =>
            import ('./views/mine.vue')
    },
    {
        path: '/setting',
        name: 'setting',
        meta: {
            title: "制作活动",
            keepAlive: true,
            isBack: false, //用于判断上一个页面是哪个
            index: 5
        },
        component: () =>
            import ('./views/setting.vue')
    },
    {
        path: '/factory',
        name: 'factory',
        meta: { index: 7 },
        component: () =>
            import ('./views/factory.vue')
    },
    {
        path: '/lib',
        name: 'lib',
        meta: { title: "选择背景音乐", index: 6 },
        component: () =>
            import ('./views/lib.vue')
    },
    {
        path: '/preview',
        name: 'preview',
        meta: { index: 3 },
        component: () =>
            import ('./views/preview.vue')
    },
    {
        path: '/myData',
        name: 'myData',
        meta: { title: "活动数据", index: 4 },
        component: () =>
            import ('./views/myData.vue')
    }
]


const router = new VueRouter({
    base: '/show/public/',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }
});
// 全局路由守卫
router.beforeEach((to, from, next) => {
    if (to.query.token) {
        localStorage.setItem("show_token", to.query.token);
    }
    document.title = to.meta.title ? to.meta.title : to.query.tl ? to.query.tl : '';
    next();
});

router.afterEach(route => {
    // 从路由的元信息中获取 title 属性
    let title = route.meta.title ? route.meta.title : route.query.tl ? route.query.tl : '';
    if (title) {
        document.title = title;
        // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
        // if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        //     const hackIframe = document.createElement('iframe');
        //     hackIframe.style.display = 'none';
        //     hackIframe.src = '/static/html/fixIosTitle.html?r=' + Math.random();
        //     document.body.appendChild(hackIframe);
        //     setTimeout(_ => {
        //         document.body.removeChild(hackIframe)
        //     }, 300)
        // }
    }
});

export default router