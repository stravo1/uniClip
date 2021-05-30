import { createRouter, createWebHashHistory } from 'vue-router'
//import Home from '../views/Messages.vue'
//import store from '../store'

const routes = [
    /*
    {
          path: '/:device',
          name: 'Home',
          component: Home,
          children: [{
                  path: 'messages',
                  component: () =>
                      import ('../views/DeviceMessages')
              },
              {
                  path: 'deviceList',
                  component: () =>
                      import ('../views/DeviceList')
              }
          ]
      },
      */
    {
        path: '/',
        redirect: '/myDevice'
    },
    {
        path: '/myDevice',
        name: 'myDevice',
        component: () =>
            import ('../views/LandingPage.vue')
    },
    {
        path: '/myDevice/messages/:device',
        name: 'messages',
        component: () =>
            import ('../views/Messages.vue'),
        children: [{
                path: ':media',
                name: 'media',
                component: () =>
                    import ('../views/MediaInfo.vue')
            },
            {
                path: 'media',
                name: 'mediaa',
                component: () =>
                    import ('../views/MediaInfo.vue')
            }
        ]
    },
    {
        path: '/selectDevice',
        name: 'selectDevice',
        component: () =>
            import ('../views/selectDevice.vue')
    },
    {
        path: '/settings',
        name: 'Settings',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Settings.vue')
    },
    {
        path: '/notes',
        name: 'notes',
        component: () =>
            import ('../views/Notes')
    },
    {
        path: '/about',
        name: 'about',
        component: () =>
            import ('../views/About')
    },
    {
        path: '/initialize',
        name: 'initialize',
        component: () =>
            import ('../views/Initialize')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =>
            import ('../views/NotFound')
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router