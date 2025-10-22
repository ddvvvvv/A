    /* =========================
       改写与扩展说明：
       - 将原有的 Promise 链改写成 async/await
       - 新增两个寻宝情节：海上航行（Sea Voyage）和山洞探险（Cave Adventure）
       - UI：全景页 + 场景弹窗 + 动画 + 背景音乐
       - 存档：使用 localStorage 保存 currentScene 与 progress
       =========================*/

    // --- 模拟的 TreasureMap
    class TreasureMap {
      static async getInitialClue() {
        await delay(800);
        return '在古老的图书馆里找到了第一个线索...';
      }

      static async decodeAncientScript(clue) {
        await delay(1200);
        if (!clue) throw new Error('没有线索可以解码!');
        return '解码成功!宝藏在一座古老的神庙中...';
      }

      static async searchTemple(location) {
        await delay(1400);
        if (Math.random() < 0.45) throw new Error('糟糕!遇到了神庙守卫!');
        return '找到了一个神秘的箱子...';
      }

      static async openTreasureBox() {
        await delay(900);
        return '恭喜!你找到了传说中的宝藏!';
      }

      // 新增情节 A: 海上航行
      static async seaVoyage() {
        await delay(800);
        const log = [];
        log.push('出航！风帆被拉起。');
        await delay(700);
        log.push('风暴来临，海浪拍打甲板。');
        await delay(800);
        if (Math.random() < 0.35) throw new Error('风暴过大，船只受损，任务中断。');
        log.push('发现漂流瓶，里面写着：\"向北的孤岛\"。');
        await delay(700);
        log.push('到达孤岛，挖掘到了一个木箱。');
        await delay(500);
        log.push('打开木箱：里面是宝藏。');
        return log;
      }

      // 新增情节 B: 山洞探险
      static async caveAdventure() {
        await delay(600);
        const log = [];
        log.push('进入山洞，空气湿冷，脚步回响。');
        await delay(700);
        log.push('发现古老的壁画，指向地下密室。');
        await delay(700);
        if (Math.random() < 0.4) throw new Error('洞内坍塌，出口被封!');
        log.push('点燃火把，找到秘密机关。');
        await delay(600);
        log.push('机关打开，出现一个带有符文的宝盒。');
        await delay(600);
        log.push('宝盒中放着一颗发光的宝石。');
        return log;
      }
    }

    function delay(ms){return new Promise(res=>setTimeout(res,ms));}

    //场景定义 
    const SCENES = [
      {id:'library', title:'古老图书馆', music:'bg_music_library', x:12,y:18},
      {id:'temple', title:'神庙遗址', music:'bg_music_temple', x:46,y:30},
      {id:'sea', title:'海上航行', music:'bg_music_sea', x:70,y:60},
      {id:'cave', title:'山洞探险', music:'bg_music_cave', x:30,y:68}
    ];

    // 存档管理 
    const SAVE_KEY = 'treasure_game_save_v1';
    function saveGame(state){
      const data={...state, savedAt: new Date().toISOString()};
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      updateSavedUI();
    }
    function loadGame(){
      const raw = localStorage.getItem(SAVE_KEY); if(!raw) return null; try{return JSON.parse(raw);}catch(e){return null}
    }
    function clearSave(){localStorage.removeItem(SAVE_KEY);updateSavedUI();}

    // 逻辑 
    const panorama = document.getElementById('panorama');
    const placeList = document.getElementById('placeList');
    const overlay = document.getElementById('overlay');
    const sceneTitle = document.getElementById('sceneTitle');
    const sceneContent = document.getElementById('sceneContent');
    const logEl = document.getElementById('log');
    const treasureImg = document.getElementById('treasureImg');

    const savedAtEl = document.getElementById('savedAt');
    const currentSceneEl = document.getElementById('currentScene');

    let state = {currentScene:null, progress:{}};
    const audios = {};

    // 初始化
    function init(){
      // 渲染热点
      SCENES.forEach(s => {
        const btn = document.createElement('div');
        btn.className='hotspot';
        btn.style.left = s.x+'%';
        btn.style.top = s.y+'%';
        btn.innerHTML = `<strong>${s.title}</strong>`;
        btn.addEventListener('click', ()=>openScene(s.id));
        panorama.appendChild(btn);

        // 侧栏
        const p = document.createElement('div');
        p.className='place'; p.textContent=s.title; p.addEventListener('click', ()=>openScene(s.id));
        placeList.appendChild(p);

        // 音频元素引用
        const audioEl = document.getElementById(s.music);
        audios[s.id]=audioEl;
      });

      // 恢复存档
      const saved = loadGame();
      if(saved){ state = {...state, ...saved}; }
      updateSavedUI();

      document.getElementById('resetBtn').addEventListener('click', ()=>{ if(confirm('确认清空存档？')){clearSave(); state={currentScene:null,progress:{}}; updateSavedUI(); alert('已重置'); } });

      // 场景控制按钮
      document.getElementById('playBtn').addEventListener('click', ()=>playSceneStory());
      document.getElementById('stopBtn').addEventListener('click', ()=>{ stopSceneStory(); });
      document.getElementById('bgPlay').addEventListener('click', ()=>{ playBgMusicForScene(state.currentScene); });
      document.getElementById('bgPause').addEventListener('click', ()=>{ pauseAllMusic(); });
      document.getElementById('closeScene').addEventListener('click', ()=>closeOverlay());

      // 如果保存中存在 currentScene，则自动打开
      if(state.currentScene) openScene(state.currentScene, {restore:true});
    }

    function updateSavedUI(){
      const saved = loadGame();
      savedAtEl.textContent = saved && saved.savedAt ? (new Date(saved.savedAt)).toLocaleString() : '—';
      currentSceneEl.textContent = state.currentScene||'无';
    }

    // 场景打开/关闭
    function openScene(id, opts={}){
      const s = SCENES.find(x=>x.id===id); if(!s) return;
      state.currentScene = id; saveGame(state);
      sceneTitle.textContent = s.title;
      sceneContent.innerHTML = `<p>欢迎来到 <strong>${s.title}</strong>。</p>`;
      logEl.innerHTML = '';
      treasureImg.classList.remove('show');
      overlay.classList.add('open');

      // 自动播放背景音乐
      playBgMusicForScene(id);

      // 若为恢复，并且有 progress 展示简单信息
      if(opts.restore && state.progress && state.progress[id]){
        appendLog('恢复到上次进度: ' + JSON.stringify(state.progress[id]));
      }
    }

    function closeOverlay(){
      overlay.classList.remove('open');
      pauseAllMusic();
      state.currentScene = null; saveGame(state);
      updateSavedUI();
    }

    //背景音乐控制 
    function playBgMusicForScene(id){
      pauseAllMusic();
      if(!id) return;
      const s = SCENES.find(x=>x.id===id); if(!s) return;
      const a = audios[id]; if(!a) return; a.play().catch(()=>{});
    }
    function pauseAllMusic(){ Object.values(audios).forEach(a=>{ try{a.pause(); a.currentTime=0;}catch(e){} }); }

    //剧情执行
    let currentStoryAbort = {abort:false};

    async function playSceneStory(){
      if(!state.currentScene) { appendLog('请先打开一个场景再播放剧情。'); return; }
      currentStoryAbort = {abort:false};
      const id = state.currentScene;
      appendLog('开始播放剧情：'+id);

      try{
        if(id==='library'){
          const clue = await TreasureMap.getInitialClue(); appendLog(clue);
          const location = await TreasureMap.decodeAncientScript(clue); appendLog(location);
          const box = await TreasureMap.searchTemple(location); appendLog(box);
          const treasure = await TreasureMap.openTreasureBox(); appendLog(treasure);
          treasureImg.classList.add('show');
          state.progress[id] = {found:true,when:new Date().toISOString()};
        } else if(id==='temple'){
          // temple 为一个快速版本，仅示例
          appendLog('你站在神庙中央，祭坛微微发光...');
          await delay(800);
          if(Math.random()<0.3) throw new Error('触发了古老机关，必须撤退');
          appendLog('你找到了机关并获得符文碎片。');
          state.progress[id] = {rune:true,when:new Date().toISOString()};
          treasureImg.classList.add('show');
        } else if(id==='sea'){
          const logs = await TreasureMap.seaVoyage();
          for(const l of logs){ if(currentStoryAbort.abort) throw new Error('用户中止'); appendLog(l); await delay(300);} 
          treasureImg.classList.add('show');
          state.progress[id]={sea:true,when:new Date().toISOString()};
        } else if(id==='cave'){
          const logs = await TreasureMap.caveAdventure();
          for(const l of logs){ if(currentStoryAbort.abort) throw new Error('用户中止'); appendLog(l); await delay(300);} 
          treasureImg.classList.add('show');
          state.progress[id]={cave:true,when:new Date().toISOString()};
        }
        appendLog('剧情结束。');
      }catch(err){ appendLog('剧情中断: '+err.message); }

      saveGame(state); updateSavedUI();
    }

    function stopSceneStory(){ currentStoryAbort.abort=true; appendLog('已请求停止剧情。'); }

    //日志工具（带打字效果）
    function appendLog(text){
      const p = document.createElement('p'); p.textContent = text; logEl.appendChild(p); logEl.scrollTop = logEl.scrollHeight;
    }

    // 启动
    init();


