import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Users from './views/Users.vue'
import Leaderboard from './views/Leaderboard.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/users', component: Users },
  { path: '/leaderboard', component: Leaderboard }
]

const router = createRouter({ 
  history: createWebHistory(), 
  routes 
})

createApp(App).use(router).mount('#app')