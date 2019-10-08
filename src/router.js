import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/layout/Index.vue'
import login from './views/login/login.vue'
Vue.use(Router)
    //解决警示报错，不影响页面使用
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
export const RoleRoutes = [{
        path: '/layout/Index',
        name: 'Index',
        redirect: '/list/index',
        component: Index,
        children: [{
            path: '/list/index',
            name: 'index',
            meta: {
                name: '首页',
                requiresAuth: true,
                ico: 'el-icon-s-home'
            },
            component: () =>
                import ('./views/list/index.vue')
        }]
    },
    {
        path: '/eidtpwd',
        redirect: 'layout/eidtpwd',
        component: Index,
        children: [{
            path: '/layout/eidtpwd',
            name: 'eidtpwd',
            meta: {
                name: '修改密码',
                requiresAuth: true,
            },
            component: () =>
                import ('./views/layout/eidtpwd.vue')
        }]
    },
    {
        path: '*',
        redirect: '/list/index'
    }
]

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            redirect: '/login/login',
        },
        {
            path: '/login/login',
            name: 'login',
            component: login,
            meta: {
                name: '登录'
            }
        },
    ]
})