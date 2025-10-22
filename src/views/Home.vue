<template>
  <div class="home">
    <div class="panorama">
      <div v-for="s in scenes" :key="s.id" class="hotspot" :style="pos(s)">
        <Hotspot :scene="s" @open="openScene" />
      </div>
    </div>
    <aside class="sidebar">
      <h3>地点列表</h3>
      <ul>
        <li v-for="s in scenes" :key="s.id">
          <button @click="openScene(s)">{{ s.title }}</button>
        </li>
      </ul>
      <div class="save-info">
        保存: {{ store.savedAt ? new Date(store.savedAt).toLocaleString() : "—" }}
      </div>
    </aside>

    <SceneModal
      v-if="active"
      :scene="active"
      @close="close"
      @music-pause="handleMusicControl('pause')"
      @music-play="handleMusicControl('play')"
    />
  </div>
</template>

<script>
import Hotspot from "../components/Hotspot.vue";
import SceneModal from "../components/SceneModal.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { store } from "../store";

const SCENES = [
  { id: "library", title: "古老图书馆", x: 12, y: 18 , image: '@/assets/scenes/library.png'},
  { id: "temple", title: "神庙遗址", x: 46, y: 30 , image: '@/assets/scenes/temple.png'},
  { id: "sea", title: "海上航行", x: 70, y: 60 , image: '@/assets/scenes/sea.png'},
  { id: "cave", title: "山洞探险", x: 30, y: 68 , image: '@/assets/scenes/cave.png'},
];

export default {
  components: { Hotspot, SceneModal },
  setup() {
    const active = ref(null);
    const bgm = ref(null);
    const isMusicPlaying = ref(false);

    function openScene(s) {
      active.value = s;
    }
    function close() {
      active.value = null;
    }
    function pos(s) {
      return { left: s.x + "%", top: s.y + "%" };
    }

    //播放对应音乐
    function playMusic(sceneId) {
      const map = {
        library: "@/assets/music/library.mp3",
        temple: "@/assets/music/temple.mp3",
        sea: "@/assets/music/sea.mp3",
        cave: "@/assets/music/cave.mp3",
      };

      if (!bgm.value) {
        bgm.value = new Audio();
        bgm.value.loop = true;
        bgm.value.volume = 0.5;
      }

      bgm.value.src = map[sceneId] || map.home;
      bgm.value.play().catch((err) => console.log("音频播放被阻止：", err));
      isMusicPlaying.value = true;
    }

    function pauseMusic() {
      if (bgm.value) {
        bgm.value.pause();
        isMusicPlaying.value = false; // 设置暂停状态
      }
    }

    function openScene(s) {
      active.value = s;
      playMusic(s.id); // 打开场景时播放对应音乐
    }

    function close() {
      active.value = null;
      if (bgm.value) {
        bgm.value.pause();
      }
    }

    // 监听 SceneModal 的音乐控制事件
    function handleMusicControl(action) {
      if (action === "pause") {
        pauseMusic();
      } else if (action === "play") {
        if (active.value) {
          playMusic(active.value.id);
        }
      }
    }
    onUnmounted(() => {
      if (bgm.value) bgm.value.pause();
    });
    return {
      scenes: SCENES,
      active,
      openScene,
      close,
      pos,
      store,
      handleMusicControl, // 暴露处理函数
    };
  },
};
</script>

<style scoped>
.home {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(145deg, #08121d, #0c1f2e);
  color: #fff;
}
.panorama {
  flex: 1;
  min-height: 520px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 25px rgba(0,0,0,0.4);
  background: 
    linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.7)),
    url('@/assets/panorama.jpg') center/cover no-repeat;
}


.hotspot {
  position: absolute;
  transform: translate(-50%, -50%); /* 居中定位 */
}

.hp {
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #304ed7ff 0%, #54a8ddff 100%);
  border: 2px solid rgba(255,255,255,0.3);
  cursor: pointer;
  color: white;
  font-weight: bold;
  font-size: 14px;
  min-width: 100px;
  text-align: center;
  position: relative;
  z-index: 10;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

/* 侧边栏样式 */
.sidebar {
  width: 260px;
  background: rgba(255,255,255,0.02);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
}

.sidebar h3 {
  margin-top: 0;
  color: #9be7ff;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 8px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin: 8px 0;
}

.sidebar button {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar button:hover {
  background: rgba(255,25 5,255,0.1);
  border-color: rgba(255,255,255,0.2);
  transform: translateX(5px);
}

.save-info {
  margin-top: 16px;
  font-size: 13px;
  color: #9be7ff;
  text-align: center;
  padding: 8px;
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
}

@media (max-width: 768px) {
  .home {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    order: -1;
  }
}
</style>