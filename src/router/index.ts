import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

const Index = ()=>import('../pages/index.vue')
const Login = ()=>import('@/pages/login.vue')

const routes:RouteRecordRaw[] = [
    {
        path:'/',
        component:Index
    },
    {
        path:'/login',
        component:Login
    }
]

const router  = createRouter({
    history:createWebHashHistory(),
    routes
})

export  default router