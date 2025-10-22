<template>
  <div class="app-root">
      <HeaderBar />
      <main class="container">
      <router-view />
      </main>
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue'
export default { 
  components: { HeaderBar } 
}
</script>

<style>
body {
  margin: 0;
  font-family: Inter, Arial;
  background: linear-gradient(180deg, #051025, #07142a);
  color: #e6f6ff;
}
.app-root {
  min-height: 100vh;
}
.container {
  padding: 18px;
}
</style>