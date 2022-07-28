import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import Home from '@/views/home.vue'

const routes = [{
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/facein',
        component: () =>
            import ('@/views/Enter/FaceIn/index.vue')
    },
    {
        path: '/fingerin',
        component: () =>
            import ('@/views/Enter/FingerIn/index.vue')
    },
    {
        path: '/faceout',
        component: () =>
            import ('@/views/Exit/FaceOut/index.vue')
    },
    {
        path: '/fingerout',
        component: () =>
            import ('@/views/Exit/FingerOut/index.vue')
    },
    {
        path: '/visitorin',
        component: () =>
            import ('@/views/visitorIn.vue')
    },
    {
        path: '/visitorout',
        component: () =>
            import ('@/views/visitorOut.vue')
    }
    // {
    //     path: '/home',
    //     component: () =>
    //         import ('@/views/home.vue'), // 懒加载组件
    //     children: [{
    //         path: 'users',
    //         name: 'users',
    //         components: {
    //             table: () =>
    //                 import ('@/views/main/users.vue')
    //         }
    //     }]
    // }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router