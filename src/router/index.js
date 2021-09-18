import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/workload/:session_id',
    name: 'Workload',
    component: () => import(/* webpackChunkName: "home" */ '../components/Workload.vue')
  },{
    path: '/project/new',
    name: 'NewProject',
    component: () => import(/* webpackChunkName: "home" */ '../components/project/NewProject.vue')
  },
  {
    path: '/session/new/:project_id',
    name: 'NewSession',
    component: () => import(/* webpackChunkName: "home" */ '../components/project/NewSession.vue')
  },
  {
    path: '/',
    name: 'Project',
    component: () => import(/* webpackChunkName: "home" */ '../components/project/Project.vue')
  },
  {
    path: '/session/:project_id',
    name: 'Session',
    component: () => import(/* webpackChunkName: "home" */ '../components/project/Session.vue')
  },
  {
    path: '/hot/:id',
    name: 'Hot',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "hot" */ '../components/Hot.vue')
  },
  

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
