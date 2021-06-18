import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/wx',
        name: 'Wx',
        meta: {
            title: '授权'
        },
        component: () =>
            import ( /* webpackChunkName: "wxLogin" */ './views/WxLogin.vue')
    },
    {
        path: '/index',
        name: 'Index',
        meta: {
            title: '活动详情'
        },
        component: () =>
            import ( /* webpackChunkName: "index" */ './views/Index.vue')
    },
    {
        path: 'weChat.html/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ './views/About.vue')
    },
    {
        path: '/register',
        name: 'Register',
        meta: {
            title: '新生完善报名信息'
        },
        component: () =>
            import ( /* webpackChunkName: "register" */ './views/Register.vue')
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录'
        },
        component: () =>
            import ( /* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
        path: '/comfirm',
        name: 'Comfirm',
        meta: {
            title: '确认订单'
        },
        component: () =>
            import ( /* webpackChunkName: "comfirm" */ './views/Comfirm.vue')
    },
    {
        path: '/record',
        name: 'Record',
        meta: {
            title: '报名记录'
        },
        component: () =>
            import ( /* webpackChunkName: "record" */ './views/Record.vue')
    }, {
        path: '/invite',
        name: 'Invite',
        meta: {
            title: '邀请有礼'
        },
        component: () =>
            import ( /* webpackChunkName: "record" */ './views/Invite.vue')
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.query.tl ? to.query.tl : to.meta.title;
    console.log(to, from);
    if (to.name === 'Index' && from.name === 'Comfirm') {
        to.query.isJoinNow = ''
        to.query.showChoiceLesson = ''
        to.query.showChoiceStu = ''
    }
    next();
});

export default router