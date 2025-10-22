<template>
  <div class="users-page">
      <h2>用户管理</h2>
      <div class="row">
            <div class="card">
              <h3>现有用户</h3>
              <ul>
               <li v-for="u in store.users" :key="u.id">{{u.name}} — 分数: {{u.score}} <button @click="select(u.id)">切换</button></li>
              </ul>
            </div>
          <div class="card">
             <h3>新增用户</h3>
             <input v-model="newName" placeholder="输入用户名" />
             <button @click="create">创建并切换</button>
           </div>
       </div>
  </div>
</template>


<script>
import { store, addUser } from '../store'
import { ref } from 'vue'
export default { setup(){ const newName = ref('')
function create(){ if(!newName.value) return alert('请输入名字'); addUser(newName.value); newName.value=''}
function select(id){ store.currentUserId = id }
return { store, newName, create, select }
} }
</script>


<style scoped>
.row{display:flex;gap:12px}
.card{background:rgba(255,255,255,0.02);padding:12px;border-radius:8px;width:100%}
</style>