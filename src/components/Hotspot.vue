<template>
   <button class="hp" @click="$emit('open', scene)">{{scene.title}}</button>
</template>


<script>
   export default { props:['scene'] }
</script>


<style scoped>
   .hp{padding:8px 10px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.03);cursor:pointer}
</style>