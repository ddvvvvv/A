import { reactive, watch } from 'vue'


const SAVE_KEY = 'vue_treasure_save_v1'


const initial = {
users: [
{ id: 'guest', name: 'Guest', score: 0 }
],
currentUserId: 'guest',
progress: {}, // { sceneId: {...} }
savedAt: null
}


function load(){
try{
const raw = localStorage.getItem(SAVE_KEY)
if(!raw) return JSON.parse(JSON.stringify(initial))
return JSON.parse(raw)
}catch(e){ return JSON.parse(JSON.stringify(initial)) }
}


export const store = reactive(load())


watch(store, (v)=>{
store.savedAt = new Date().toISOString()
localStorage.setItem(SAVE_KEY, JSON.stringify(v))
}, { deep:true })


export function findUser(id){ return store.users.find(u=>u.id===id) }
export function addUser(name){
const id = 'u_' + Date.now()
const user = { id, name, score: 0 }
store.users.push(user)
store.currentUserId = id
return user
}


export function updateScore(userId, delta){
const u = findUser(userId)
if(!u) return
u.score += delta
}