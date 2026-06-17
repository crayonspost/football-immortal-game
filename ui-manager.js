// UI 管理系統

function goToPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');

        if (pageName === 'mainPage') {
            refreshMainPage();
        } else if (pageName === 'cardPage') {
            refreshCardPage();
        } else if (pageName === 'racePage') {
            refreshRacePage();
        } else if (pageName === 'synthPage') {
            refreshSynthPage();
        } else if (pageName === 'taskPage') {
            refreshTaskPage();
        } else if (pageName === 'savePage') {
            refreshSavePage();
        }
    }
}

// 刷新主菜單
function refreshMainPage() {
    gameManager.updateUI();
}

// 刷新卡牌頁面
function refreshCardPage() {
    renderInventory();
}

// 刷新賽事頁面
function refreshRacePage() {
    const container = document.getElementById('leagueList');
    container.innerHTML = '';

    const leagues = {};
    for (const chapter of GAME_DATA.leagues) {
        if (!leagues[chapter.level]) {
            leagues[chapter.level] = [];
        }
        leagues[chapter.level].push(chapter);
    }

    for (const level in leagues) {
        const section = document.createElement('div');
        section.className = 'league-section';
        section.innerHTML = `<h2>${leagues[level][0].name.split('·')[0]}</h2>`;

        const chapterList = document.createElement('div');
        chapterList.className = 'chapter-list';

        for (const chapter of leagues[level]) {
            const isUnlocked = gameManager.gameState.completedLevels.includes(chapter.id) || chapter.unlocked;
            const isCompleted = gameManager.gameState.completedLevels.includes(chapter.id);

            const item = document.createElement('div');
            item.className = 'chapter-item';
            item.innerHTML = `
                <div class="chapter-info">
                    <h3>${chapter.enemy}</h3>
                    <p>戰力要求: ${chapter.power} | ${chapter.difficulty}</p>
                </div>
                <div class="chapter-status">
                    <span class="status-badge ${isCompleted ? 'status-completed' : isUnlocked ? 'status-unlocked' : 'status-locked'}">
                        ${isCompleted ? '✅ 已完成' : isUnlocked ? '🔓 可挑戰' : '🔒 未開放'}
                    </span>
                </div>
            `;

            if (isUnlocked) {
                item.onclick = () => startChapter(chapter);
            }

            chapterList.appendChild(item);
        }

        section.appendChild(chapterList);
        container.appendChild(section);
    }
}

// 開始章節
function startChapter(chapter) {
    // 生成敵隊
    const enemyTeam = [];
    for (let i = 0; i < 11; i++) {
        const sectId = Math.floor(Math.random() * 12) + 1;
        const colorId = Math.min(5, Math.ceil(chapter.power / 1000));
        const position = GAME_DATA.positions[i % 4];
        const stars = Math.floor(Math.random() * 3) + 2;
        enemyTeam.push(generateBaseCard(sectId, colorId, position, stars));
    }

    window.currentChapter = chapter;
    window.currentEnemyTeam = enemyTeam;

    goToPage('battlePage');
    refreshBattlePage();
}

// 刷新戰鬥頁面
function refreshBattlePage() {
    const chapter = window.currentChapter;
    document.getElementById('battleTitle').textContent = `${chapter.name} - ${chapter.enemy}`;

    const formationSelect = document.getElementById('battleFormationSelect');
    formationSelect.innerHTML = '';
    for (const formation of GAME_DATA.formations) {
        const option = document.createElement('option');
        option.value = formation.id;
        option.textContent = formation.name;
        formationSelect.appendChild(option);
    }

    if (gameManager.gameState.team.formationId) {
        formationSelect.value = gameManager.gameState.team.formationId;
    }

    renderBattleTeamSlots();
}

// 渲染戰鬥隊伍槽位
function renderBattleTeamSlots() {
    const container = document.getElementById('battleTeamSlots');
    container.innerHTML = '';

    for (let i = 0; i < 11; i++) {
        const slot = document.createElement('div');
        slot.className = 'team-slot';
        slot.onclick = () => selectCardForSlot('battle', i);

        const cardId = gameManager.gameState.team.slots[i];
        if (cardId) {
            const card = gameManager.gameState.cards.find(c => c.id === cardId);
            if (card) {
                slot.classList.add('filled');
                slot.innerHTML = `
                    <div class="team-slot-card">${getCardEmoji(card)}</div>
                    <div class="team-slot-info">${card.color} ${card.stars}⭐</div>
                `;
            }
        }

        container.appendChild(slot);
    }
}

// 取得卡牌表情符號
function getCardEmoji(card) {
    const sect = GAME_DATA.sects.find(s => s.id === card.sectId);
    return sect ? sect.emoji : '🎴';
}

// 開始戰鬥
function startBattle() {
    const formationId = parseInt(document.getElementById('battleFormationSelect').value);
    if (!formationId || gameManager.gameState.team.slots.filter(s => s).length < 11) {
        showNotification('請先配置完整隊伍！');
        return;
    }

    const playerTeam = gameManager.gameState.team.slots.map(
        cardId => gameManager.gameState.cards.find(c => c.id === cardId)
    );

    window.currentBattle = new BattleSystem(
        gameManager,
        playerTeam,
        window.currentEnemyTeam,
        window.currentChapter
    );

    // 隱藏隊伍配置，顯示戰鬥
    document.querySelector('.team-setup-battle').style.display = 'none';
    document.getElementById('battleReplay').style.display = 'block';

    window.currentBattle.startBattle();
}

// 結束戰鬥
function endBattle() {
    document.querySelector('.team-setup-battle').style.display = 'block';
    document.getElementById('battleReplay').style.display = 'none';
    document.getElementById('battleResult').style.display = 'none';
    document.getElementById('battleLog').innerHTML = '';

    goToPage('mainPage');
}

// 刷新合成頁面
function refreshSynthPage() {
    const formationSelect = document.getElementById('formationSelect');
    formationSelect.innerHTML = '';
    for (const formation of GAME_DATA.formations) {
        const option = document.createElement('option');
        option.value = formation.id;
        option.textContent = formation.name;
        formationSelect.appendChild(option);
    }

    renderTeamSlots();
    renderInventory();
}

// 渲染隊伍槽位
function renderTeamSlots() {
    const container = document.getElementById('teamSlots');
    container.innerHTML = '';

    for (let i = 0; i < 11; i++) {
        const slot = document.createElement('div');
        slot.className = 'team-slot';
        slot.onclick = () => selectCardForSlot('team', i);

        const cardId = gameManager.gameState.team.slots[i];
        if (cardId) {
            const card = gameManager.gameState.cards.find(c => c.id === cardId);
            if (card) {
                slot.classList.add('filled');
                slot.innerHTML = `
                    <div class="team-slot-card">${getCardEmoji(card)}</div>
                    <div class="team-slot-info">${card.color} ${card.stars}⭐</div>
                `;
            }
        }

        container.appendChild(slot);
    }
}

// 選擇卡牌到槽位
function selectCardForSlot(type, slotIndex) {
    // 簡化版本：自動分配第一張可用卡牌
    const card = gameManager.gameState.cards[0];
    if (card) {
        if (type === 'team') {
            gameManager.gameState.team.slots[slotIndex] = card.id;
        }
        renderTeamSlots();
    }
}

// 保存隊伍
function saveTeam() {
    gameManager.saveGame();
    showNotification('隊伍已保存！');
}

// 變更陣型
function changeFormation() {
    const formationId = parseInt(document.getElementById('formationSelect').value);
    const formation = GAME_DATA.formations.find(f => f.id === formationId);
    if (formation) {
        document.getElementById('formationDisplay').textContent = `📋 ${formation.name}`;
    }
}

// 顯示合成窗口
function showSynthesisWindow() {
    // 分組統計卡牌
    const cardGroups = {};
    for (const card of gameManager.gameState.cards) {
        const key = `${card.name}_${card.colorId}_${card.stars}`;
        if (!cardGroups[key]) {
            cardGroups[key] = {
                name: card.name,
                color: card.colorId,
                stars: card.stars,
                count: 0,
                card: card
            };
        }
        cardGroups[key].count++;
    }

    const synthOptions = document.getElementById('synthOptions');
    synthOptions.innerHTML = '';

    for (const key in cardGroups) {
        const group = cardGroups[key];
        if (group.count >= 4 && group.stars < 6) {
            const option = document.createElement('div');
            option.className = 'synth-option-item';
            option.innerHTML = `
                <div class="synth-option-info">
                    <h4>${group.card.name}</h4>
                    <p>${group.card.color}色 ${group.stars}星 ➜ ${group.stars + 1}星 | 需要 4 張</p>
                </div>
                <div class="synth-count">${group.count} 張</div>
            `;
            option.onclick = () => {
                gameManager.synthesizeStars(group.name, group.color);
                closeSynthWindow();
                refreshUI();
            };
            synthOptions.appendChild(option);
        }
    }

    document.getElementById('synthWindow').style.display = 'block';
}

// 顯示升色窗口
function showColorUpWindow() {
    const cardGroups = {};
    for (const card of gameManager.gameState.cards) {
        const key = `${card.name}_${card.colorId}`;
        if (!cardGroups[key]) {
            cardGroups[key] = {
                name: card.name,
                color: card.colorId,
                count: 0,
                card: card
            };
        }
        cardGroups[key].count++;
    }

    const synthOptions = document.getElementById('synthOptions');
    synthOptions.innerHTML = '';

    for (const key in cardGroups) {
        const group = cardGroups[key];
        if (group.count >= 10 && group.color < 7) {
            const nextColor = GAME_DATA.colors.find(c => c.id === group.color + 1);
            const option = document.createElement('div');
            option.className = 'synth-option-item';
            option.innerHTML = `
                <div class="synth-option-info">
                    <h4>${group.card.name}</h4>
                    <p>${group.card.color}色 ➜ ${nextColor.name}色 | 需要 10 張</p>
                </div>
                <div class="synth-count">${group.count} 張</div>
            `;
            option.onclick = () => {
                gameManager.synthesizeColor(group.name, group.color);
                closeSynthWindow();
                refreshUI();
            };
            synthOptions.appendChild(option);
        }
    }

    document.getElementById('synthWindow').style.display = 'block';
}

// 關閉合成窗口
function closeSynthWindow() {
    document.getElementById('synthWindow').style.display = 'none';
}

// 一鍵合成
function autoSynthesize() {
    gameManager.autoSynthesize();
    refreshUI();
}

// 刷新卡牌頁面
function refreshCardPage() {
    renderInventory();
}

// 渲染背包
function renderInventory() {
    const container = document.getElementById('cardInventory');
    container.innerHTML = '';

    const cards = gameManager.gameState.cards;

    // 分組並排序
    const cardMap = {};
    for (const card of cards) {
        const key = `${card.name}_${card.colorId}`;
        if (!cardMap[key]) {
            cardMap[key] = {
                card: card,
                count: 0
            };
        }
        cardMap[key].count++;
    }

    for (const key in cardMap) {
        const { card, count } = cardMap[key];
        const color = GAME_DATA.colors.find(c => c.id === card.colorId);

        const item = document.createElement('div');
        item.className = 'card-item';
        item.innerHTML = `
            <div class="card-rarity">${color.symbol}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-star">${'⭐'.repeat(card.stars)}</div>
            <div class="card-count">×${count}</div>
        `;

        container.appendChild(item);
    }
}

// 篩選卡牌
function filterCards(color) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderInventory();
}

// 抽卡
function drawCard(times, cost) {
    const cards = gameManager.drawCards(times, 'gold');

    if (cards.length === 0) return;

    const resultDiv = document.getElementById('drawResult');
    let html = `<h3>抽卡結果 (${times}次)</h3>`;

    for (const card of cards) {
        const color = GAME_DATA.colors.find(c => c.id === card.colorId);
        html += `<div>${color.symbol} ${card.name} (${card.stars}⭐)</div>`;
    }

    resultDiv.innerHTML = html;
    gameManager.updateUI();
    refreshCardPage();
}

// 刷新任務頁面
function refreshTaskPage() {
    const mainTasksContainer = document.getElementById('mainTasks');
    const dailyTasksContainer = document.getElementById('dailyTasks');

    mainTasksContainer.innerHTML = '';
    dailyTasksContainer.innerHTML = '';

    for (const task of gameManager.gameState.tasks.main) {
        const item = createTaskElement(task, 'main');
        mainTasksContainer.appendChild(item);
    }

    for (const task of gameManager.gameState.tasks.daily) {
        const item = createTaskElement(task, 'daily');
        dailyTasksContainer.appendChild(item);
    }
}

// 建立任務元素
function createTaskElement(task, type) {
    const item = document.createElement('div');
    item.className = 'task-item';

    const progressPercent = (task.progress / task.target) * 100;
    const canClaim = task.completed && !task.claimed;

    item.innerHTML = `
        <div class="task-info">
            <h3>${task.name}</h3>
            <p>${task.desc}</p>
            <div class="task-progress">
                <div class="task-progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            <p style="font-size: 12px; margin-top: 5px;">${task.progress}/${task.target}</p>
        </div>
        <div class="task-action">
            <div class="task-reward">
                ${task.reward.gold ? `💰 ${task.reward.gold}` : ''}
                ${task.reward.gems ? `💎 ${task.reward.gems}` : ''}
                ${task.reward.cards ? `🎴 ${task.reward.cards}` : ''}
            </div>
            <button class="task-btn" ${!canClaim ? 'disabled' : ''} onclick="gameManager.claimTaskReward('${type}', ${task.id})">
                ${task.claimed ? '已領取' : canClaim ? '領取' : '進行中'}
            </button>
        </div>
    `;

    return item;
}

// 刷新存檔頁面
function refreshSavePage() {
    const container = document.getElementById('saveSlots');
    container.innerHTML = '';

    for (let i = 1; i <= 20; i++) {
        const slot = gameManager.saveSlots[i];
        const slotDiv = document.createElement('div');
        slotDiv.className = 'save-slot';

        if (slot) {
            const lastSaved = new Date(slot.lastSaved || 0).toLocaleString();
            slotDiv.innerHTML = `
                <div class="save-slot-header">
                    <div class="save-slot-name">槽位 ${i} - Lv.${slot.playerLevel}</div>
                    <div class="save-slot-time">${lastSaved}</div>
                </div>
                <div class="save-slot-info">
                    <div>💰 ${slot.gold}</div>
                    <div>💎 ${slot.gems}</div>
                </div>
                <div class="save-slot-actions">
                    <button onclick="gameManager.selectSlot(${i}); goToPage('mainPage');">讀取</button>
                    <button onclick="deleteSlot(${i})">刪除</button>
                </div>
            `;
        } else {
            slotDiv.innerHTML = `
                <div class="save-slot-header">
                    <div class="save-slot-name">槽位 ${i} - 空</div>
                </div>
                <div class="save-slot-actions">
                    <button onclick="gameManager.selectSlot(${i})">新建</button>
                </div>
            `;
        }

        container.appendChild(slotDiv);
    }
}

// 刪除槽位
function deleteSlot(slotNum) {
    if (confirm(`確定要刪除槽位 ${slotNum} 的存檔嗎？`)) {
        localStorage.removeItem(`gameSlot_${slotNum}`);
        gameManager.loadSaveSlots();
        refreshSavePage();
    }
}

// 快速保存
function quickSave() {
    gameManager.quickSave();
}

// 導出存檔
function exportSave() {
    gameManager.exportSave();
}

// 導入存檔
function importSave() {
    gameManager.importSave();
}

// 處理文件導入
function handleFileImport(event) {
    const file = event.target.files[0];
    if (file) {
        gameManager.handleFileImport(file);
    }
    document.getElementById('fileInput').value = '';
}

// 清空所有資料
function clearAllData() {
    gameManager.clearAllData();
}

// 切換設定頁面
function toggleSettings() {
    const settingsPage = document.getElementById('settingsPage');
    settingsPage.classList.toggle('active');
}

// 設定 BGM 音量
function setBGMVolume(value) {
    localStorage.setItem('bgmVolume', value);
}

// 設定 SFX 音量
function setSFXVolume(value) {
    localStorage.setItem('sfxVolume', value);
}

// 顯示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(99, 102, 241, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// 刷新 UI
function refreshUI() {
    gameManager.updateUI();
    renderCardPage();
}

// 錯誤處理
window.addEventListener('error', (e) => {
    console.error('遊戲錯誤:', e);
});
