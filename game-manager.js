// 遊戲管理系統

class GameManager {
    constructor() {
        this.currentSlot = null;
        this.gameState = null;
        this.saveSlots = {};
        this.loadSaveSlots();
    }

    // 初始化遊戲
    init() {
        this.loadSaveSlots();
        this.renderSlotButtons();
    }

    // 載入存檔槽
    loadSaveSlots() {
        for (let i = 1; i <= 20; i++) {
            const key = `gameSlot_${i}`;
            const data = localStorage.getItem(key);
            this.saveSlots[i] = data ? JSON.parse(data) : null;
        }
    }

    // 渲染存檔槽按鈕
    renderSlotButtons() {
        const container = document.getElementById('slotButtons');
        container.innerHTML = '';

        for (let i = 1; i <= 20; i++) {
            const btn = document.createElement('button');
            btn.className = 'slot-btn';
            btn.textContent = i;

            if (this.saveSlots[i]) {
                btn.classList.add('occupied');
                btn.title = `玩家 Lv.${this.saveSlots[i].playerLevel}`;
            }

            btn.onclick = () => this.selectSlot(i);
            container.appendChild(btn);
        }
    }

    // 選擇存檔槽
    selectSlot(slotNum) {
        this.currentSlot = slotNum;

        if (this.saveSlots[slotNum]) {
            // 讀取已有存檔
            this.gameState = JSON.parse(JSON.stringify(this.saveSlots[slotNum]));
            this.loadGame();
        } else {
            // 新遊戲
            this.gameState = JSON.parse(JSON.stringify(INITIAL_GAME_STATE));
            this.initNewGame();
        }
    }

    // 初始化新遊戲
    initNewGame() {
        // 給玩家一些初始卡牌
        for (let i = 0; i < 10; i++) {
            const card = this.drawRandomCard();
            this.gameState.cards.push(card);
        }

        // 設置預設陣型
        this.gameState.team.formationId = 1;

        // 自動保存
        this.saveGame();
        this.loadGame();
    }

    // 加載遊戲
    loadGame() {
        goToPage('mainPage');
        this.updateUI();
    }

    // 保存遊戲
    saveGame() {
        if (!this.currentSlot) return;

        const key = `gameSlot_${this.currentSlot}`;
        this.saveSlots[this.currentSlot] = JSON.parse(JSON.stringify(this.gameState));
        localStorage.setItem(key, JSON.stringify(this.gameState));

        // 記錄最後存檔時間
        this.saveSlots[this.currentSlot].lastSaved = new Date().toISOString();
    }

    // 快速保存
    quickSave() {
        this.saveGame();
        showNotification('遊戲已保存！');
    }

    // 更新 UI
    updateUI() {
        document.getElementById('playerLevel').textContent = this.gameState.playerLevel;
        document.getElementById('goldDisplay').textContent = this.gameState.gold.toLocaleString();
        document.getElementById('gemsDisplay').textContent = this.gameState.gems.toLocaleString();
    }

    // 隨機抽卡
    drawRandomCard() {
        let roll = Math.random() * 100;
        let colorId = 1;

        for (const rarity of GAME_DATA.cardRarity) {
            if (roll < rarity.rate) {
                colorId = rarity.value;
                break;
            }
            roll -= rarity.rate;
        }

        const sectId = Math.floor(Math.random() * 12) + 1;
        const position = GAME_DATA.positions[Math.floor(Math.random() * GAME_DATA.positions.length)];
        const stars = Math.floor(Math.random() * 3) + 1;

        return generateBaseCard(sectId, colorId, position, stars);
    }

    // 抽卡
    drawCards(times, costType) {
        const cost = times === 1 ? 100 : times === 10 ? 950 : 9000;

        if (this.gameState.gold < cost) {
            showNotification('靈石不足！');
            return [];
        }

        this.gameState.gold -= cost;
        const drawnCards = [];

        for (let i = 0; i < times; i++) {
            const card = this.drawRandomCard();
            this.gameState.cards.push(card);
            drawnCards.push(card);
        }

        // 更新任務進度
        this.updateTaskProgress('daily', 104, times);

        this.saveGame();
        this.updateUI();

        return drawnCards;
    }

    // 合成卡牌 - 升星
    synthesizeStars(cardName, color) {
        const matchingCards = this.gameState.cards.filter(
            c => c.name === cardName && c.colorId === color && c.stars < 6
        );

        if (matchingCards.length < 4) {
            showNotification(`缺少足夠的 ${cardName} 卡牌！需要 4 張，現有 ${matchingCards.length} 張`);
            return false;
        }

        // 移除 4 張卡牌
        for (let i = 0; i < 4; i++) {
            const idx = this.gameState.cards.indexOf(matchingCards[i]);
            this.gameState.cards.splice(idx, 1);
        }

        // 添加升星卡牌
        const newCard = { ...matchingCards[0], stars: matchingCards[0].stars + 1 };
        this.gameState.cards.push(newCard);

        // 更新任務進度
        this.updateTaskProgress('main', 3, 1);
        this.updateTaskProgress('daily', 103, 1);

        this.saveGame();
        return true;
    }

    // 合成卡牌 - 升色
    synthesizeColor(cardName, currentColor) {
        const nextColor = currentColor + 1;
        if (nextColor > 7) {
            showNotification('已經是最高等級！');
            return false;
        }

        const matchingCards = this.gameState.cards.filter(
            c => c.name === cardName && c.colorId === currentColor
        );

        if (matchingCards.length < 10) {
            showNotification(`缺少足夠的 ${cardName} 卡牌！需要 10 張，現有 ${matchingCards.length} 張`);
            return false;
        }

        // 移除 10 張卡牌
        for (let i = 0; i < 10; i++) {
            const idx = this.gameState.cards.indexOf(matchingCards[i]);
            this.gameState.cards.splice(idx, 1);
        }

        // 添加升色卡牌
        const newCard = { ...matchingCards[0], colorId: nextColor };
        this.gameState.cards.push(newCard);

        this.saveGame();
        return true;
    }

    // 一鍵合成
    autoSynthesize() {
        let synthesizCount = 0;

        // 重複合成直到無法繼續
        while (true) {
            let didSynthesized = false;

            // 分組統計卡牌
            const cardGroups = {};
            for (const card of this.gameState.cards) {
                const key = `${card.name}_${card.colorId}_${card.stars}`;
                if (!cardGroups[key]) {
                    cardGroups[key] = [];
                }
                cardGroups[key].push(card);
            }

            // 優先升星
            for (const key in cardGroups) {
                if (cardGroups[key].length >= 4) {
                    const card = cardGroups[key][0];
                    if (this.synthesizeStars(card.name, card.colorId)) {
                        didSynthesized = true;
                        synthesizCount++;
                        break;
                    }
                }
            }

            // 如果沒有升星，嘗試升色
            if (!didSynthesized) {
                for (const key in cardGroups) {
                    if (cardGroups[key].length >= 10) {
                        const card = cardGroups[key][0];
                        if (this.synthesizeColor(card.name, card.colorId)) {
                            didSynthesized = true;
                            synthesizCount++;
                            break;
                        }
                    }
                }
            }

            if (!didSynthesized) break;
        }

        if (synthesizCount > 0) {
            showNotification(`完成 ${synthesizCount} 次合成！`);
            refreshUI();
        } else {
            showNotification('無法進行合成！');
        }
    }

    // 設置隊伍
    setTeam(formationId, cardIds) {
        this.gameState.team.formationId = formationId;
        this.gameState.team.slots = cardIds;
        this.saveGame();
        showNotification('隊伍已保存！');
    }

    // 更新任務進度
    updateTaskProgress(taskType, taskId, progress) {
        const tasks = this.gameState.tasks[taskType];
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.progress = Math.min(task.progress + progress, task.target);
            if (task.progress >= task.target) {
                task.completed = true;
            }
        }
    }

    // 領取任務獎勵
    claimTaskReward(taskType, taskId) {
        const tasks = this.gameState.tasks[taskType];
        const task = tasks.find(t => t.id === taskId);

        if (!task || !task.completed) {
            showNotification('任務未完成！');
            return;
        }

        if (task.reward.gold) this.gameState.gold += task.reward.gold;
        if (task.reward.gems) this.gameState.gems += task.reward.gems;
        if (task.reward.cards) {
            for (let i = 0; i < task.reward.cards; i++) {
                this.gameState.cards.push(this.drawRandomCard());
            }
        }

        // 標記為已領取（通過移除或添加標記）
        task.claimed = true;

        this.saveGame();
        showNotification('獎勵已領取！');
        refreshUI();
    }

    // 清空所有資料
    clearAllData() {
        if (confirm('確定要清空所有遊戲資料嗎？此操作無法撤銷！')) {
            localStorage.clear();
            alert('所有資料已清空，頁面將刷新');
            location.reload();
        }
    }

    // 導出存檔
    exportSave() {
        if (!this.currentSlot || !this.saveSlots[this.currentSlot]) {
            showNotification('沒有存檔可導出！');
            return;
        }

        const data = JSON.stringify(this.saveSlots[this.currentSlot], null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `football-immortal-slot-${this.currentSlot}-${new Date().getTime()}.json`;
        a.click();
    }

    // 導入存檔
    importSave() {
        document.getElementById('fileInput').click();
    }

    // 處理文件導入
    handleFileImport(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (this.currentSlot) {
                    this.gameState = data;
                    this.saveGame();
                    showNotification('存檔導入成功！');
                    refreshUI();
                } else {
                    showNotification('請先選擇存檔槽位！');
                }
            } catch (err) {
                showNotification('存檔文件損壞！');
            }
        };
        reader.readAsText(file);
    }
}

// 全局遊戲管理器
let gameManager;

function initGameManager() {
    gameManager = new GameManager();
    gameManager.init();
}

// 開始新遊戲
function startNewGame() {
    gameManager.selectSlot(gameManager.currentSlot);
}
