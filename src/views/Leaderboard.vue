<template>
 <div class="board">
      <h2>排行榜</h2>
      <ol>
          <li v-for="u in sorted" :key="u.id">{{u.name}} — {{u.score}}</li>
      </ol>
 </div>
</template>


<script>
import { store } from '../store'
import { computed } from 'vue'
export default { setup(){
const sorted = computed(()=>[...store.users].sort((a,b)=>b.score-a.score))
return { sorted }
} }
</script>


<style scoped>
.board{background:rgba(255,255,255,0.02);padding:12px;border-radius:8px}
</style>