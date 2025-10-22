<template>
    <header class="hb">
      <div class="brand"> 寻宝游戏（Vue）</div>
    <nav>
       <router-link to="/">全景</router-link>
       <router-link to="/users">用户管理</router-link>
       <router-link to="/leaderboard">排行榜</router-link>
    </nav>
    <div class="user-info">
        <select v-model="currentId" @change="switchUser">
           <option v-for="u in store.users" :key="u.id" :value="u.id">{{u.name}}</option>
        </select>
        <button @click="$emit('open-profile')">⚙️</button>
    </div>
  </header>
</template>

<script>
import { store, findUser } from '../store.js'
import { computed } from 'vue'
export default {
setup(){
return { store, currentId: store.currentUserId, findUser }
},
computed:{
// keep select in sync with store
},
watch:{
// none here; we use v-model with a local proxy
},
methods:{
switchUser(e){ store.currentUserId = e.target.value }
}
}
</script>


<style scoped>
.hb{display:flex;align-items:center;justify-content:space-between;padding:10px 18px;background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.03)}
.hb nav a{margin:0 8px;color:#9be7ff;text-decoration:none}
.user-info select{background:transparent;color:inherit;border:1px solid rgba(255,255,255,0.03);padding:6px;border-radius:6px}
</style>