import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router'

import HomeView from './components/HelloWorld.vue'
import home from './components/main.vue'

const routes = [
  { path: '/', name:'home', component: home },
  { path: '/start', name:'start', component: HomeView },
  { path: '/menu', name:'menu', component: ()=>{return import('./components/menu.vue')} },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})