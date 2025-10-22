<template>
  <div class="overlay" @click.self="close">
    <div class="card">
      <div class="left">
             <h2 class="scene-title">{{scene.title}}</h2>
             <div class="scene-image">
               <img :src="scene.image" :alt="scene.title" class="scene-img" />
             </div>
         <div class="content">{{ desc }}</div>
         <div class="log" ref="logEl"></div>
         <img v-show="showTreasure" class="treasure" src="/assets/scenes/picture.png" />
      </div>
      <div class="right">
        <div class="controls">
          <button @click="playStory" :disabled="playing">▶ 播放剧情</button>
          <button @click="stopStory" :disabled="!playing">■ 停止</button>
        </div>
        <div class="audio">
          <button @click="playBg">播放音乐</button>
          <button @click="pauseBg">暂停音乐</button>
        </div>
        <div class="actions">
          <button @click="close">离开</button>
        </div>
      </div>
    </div>
    <audio ref="bgAudio" :src="bgSrc" loop></audio>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { store, updateScore } from "../store";

export default {
  props: ["scene"],
  emits: ["close", "music-pause", "music-play"], // 声明发射的事件
  setup(props, { emit }) {
    const logEl = ref(null);
    const playing = ref(false);
    const abort = { abort: false };
    const showTreasure = ref(false);
    const bgAudio = ref(null);

    const desc = `欢迎来到${props.scene.title}。点击播放开始剧情（示例）。`;
    const bgMap = {
      library: "/assets/music/library.mp3",
      temple: "/assets/music/temple.mp3",
      sea: "/assets/music/sea.mp3",
      cave: "/assets/music/cave.mp3",
    };
    const bgSrc = bgMap[props.scene.id] || "";

    function append(text) {
      const p = document.createElement("p");
      p.textContent = text;
      logEl.value.appendChild(p);
      logEl.value.scrollTop = logEl.value.scrollHeight;
    }

    async function playStory() {
      playing.value = true;
      abort.abort = false;
      showTreasure.value = false;
      append("开始剧情...");
      try {
        if (props.scene.id === "library") {
          await wait(800);
          append("在古老的图书馆里找到了第一个线索...");
          await wait(800);
          append("解码出宝藏位置：神庙");
          await wait(900);
          append("在神庙遇见守卫，成功躲避并寻找到了箱子");
          await wait(700);
          append("打开箱子，发现宝藏");
          showTreasure.value = true;
          updateScore(store.currentUserId, 10);
        } else if (props.scene.id === "sea") {
          await wait(600);
          append("扬帆出海，遭遇风暴...");
          await wait(700);
          append("发现漂流瓶，获得线索");
          showTreasure.value = true;
          updateScore(store.currentUserId, 8);
        } else if (props.scene.id === "cave") {
          await wait(600);
          append("进入山洞，发现符文...");
          await wait(700);
          append("机关启动，密室打开");
          showTreasure.value = true;
          updateScore(store.currentUserId, 12);
        } else if (props.scene.id === "temple") {
          await wait(500);
          append("神庙祭坛微光，获得符文碎片");
          showTreasure.value = true;
          updateScore(store.currentUserId, 6);
        }
        append("剧情结束");
      } catch (e) {
        append("剧情被中断");
      }
      playing.value = false;
    }
    function stopStory() {
      abort.abort = true;
      playing.value = false;
      append("已停止");
    }
    function wait(ms) {
      return new Promise((res, rej) =>
        setTimeout(() => {
          if (abort.abort) return rej(new Error("abort"));
          res();
        }, ms)
      );
    }
    function playBg() {
      if (bgAudio.value) bgAudio.value.play().catch(() => {});
      emit("music-play");
    }
    function pauseBg() {
      if (bgAudio.value) {
        bgAudio.value.pause();
        bgAudio.value.currentTime = 0;
      }
      emit("music-pause");
    }

    function close() {
      pauseBg();
      emit("close");
    }

    onMounted(() => {
      /* 可在此做恢复进度的展示 */
    });
    return {
      desc,
      playStory,
      stopStory,
      playing,
      append,
      logEl,
      showTreasure,
      bgSrc,
      bgAudio,
      playBg,
      pauseBg,
      close,
    };
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.6), rgba(0, 0, 0, 0.85));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.card {
  width: min(980px, 98%);
  height: min(640px, 92%);
  background: linear-gradient(180deg, #07142a 0%, #051025 100%);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
}
.left{
  flex:1;
  padding:18px;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 添加滚动 */
}

.scene-title {
  margin: 0 0 16px 0;
  color: #e6f6ff;
  font-size: 24px;
  text-align: center;
}

/* 场景图片容器 */
.scene-image {
  margin-bottom: 16px;
  text-align: center;
}

.scene-img {
  max-width: 100%;
  max-height: 180px; /* 限制图片高度 */
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
}

.content {
  margin: 16px 0;
  padding: 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  color: #9be7ff;
  line-height: 1.5;
}

.right{
  width:320px;
  padding:18px;
  border-left:1px solid rgba(255,255,255,0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.log{
  background:rgba(255,255,255,0.02);
  padding:12px;
  border-radius:8px;
  height:180px; 
  overflow:auto;
  flex-shrink: 0; /* 防止被压缩 */
}
.treasure{
  width:200px; 
  border-radius:10px;
  box-shadow:0 14px 40px rgba(2,6,23,0.6);
  animation:pop .8s both;
  margin: 16px auto; 
  display: block;
}
@keyframes pop{
  from{transform:scale(.6);opacity:0}
  to{transform:scale(1);opacity:1}
}

.controls, .audio, .actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

button {
  padding: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover:not(:disabled) {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-height: 700px) {
  .scene-img {
    max-height: 120px;
  }
  .log {
    height: 120px;
  }
}
</style>
