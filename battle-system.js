// 戰鬥系統

class BattleSystem {
    constructor(gameManager, playerTeam, enemyTeam, chapter) {
        this.gameManager = gameManager;
        this.playerTeam = playerTeam;
        this.enemyTeam = enemyTeam;
        this.chapter = chapter;
        this.battleLog = [];
        this.playerScore = 0;
        this.enemyScore = 0;
        this.speed = 1;
        this.battleTime = 0;
        this.totalTime = 60000; // 60 秒
    }

    // 計算隊伍戰力
    calculateTeamPower(team) {
        let totalPower = 0;
        let sectionCounts = {};

        for (const card of team) {
            if (!card) continue;

            // 基礎戰力
            const basePower = (card.baseStats.atk * 1.5 + card.baseStats.def + card.baseStats.spd * 0.8) * card.stars;
            totalPower += basePower;

            // 統計宗門
            sectionCounts[card.sectId] = (sectionCounts[card.sectId] || 0) + 1;
        }

        // 宗門絆加成
        for (const sectId in sectionCounts) {
            if (sectionCounts[sectId] >= 5) {
                totalPower *= 1.15; // 5 名同宗門 +15%
            } else if (sectionCounts[sectId] >= 3) {
                totalPower *= 1.05; // 3 名同宗門 +5%
            }
        }

        return Math.floor(totalPower);
    }

    // 生成比賽事件
    generateBattleEvents() {
        const events = [];
        const eventCount = 15 + Math.floor(Math.random() * 10);

        for (let i = 0; i < eventCount; i++) {
            const time = Math.floor(Math.random() * this.totalTime);
            const type = ['pass', 'shoot', 'defend', 'foul'][Math.floor(Math.random() * 4)];
            const actor = Math.random() > 0.5 ? 'player' : 'enemy';
            const card = (actor === 'player' ? this.playerTeam : this.enemyTeam)[
                Math.floor(Math.random() * 11)
            ];

            if (card) {
                events.push({ time, type, actor, card });
            }
        }

        return events.sort((a, b) => a.time - b.time);
    }

    // 開始戰鬥
    startBattle() {
        const events = this.generateBattleEvents();
        this.battleLog = [];
        this.playerScore = 0;
        this.enemyScore = 0;

        const logContainer = document.getElementById('battleLog');
        logContainer.innerHTML = '';

        let eventIndex = 0;
        const simInterval = setInterval(() => {
            this.battleTime += 16 * this.speed;

            // 處理比賽事件
            while (eventIndex < events.length && events[eventIndex].time <= this.battleTime) {
                const event = events[eventIndex];
                this.processEvent(event);
                eventIndex++;
            }

            // 顯示日誌
            if (this.battleLog.length > 0) {
                const lastEntry = this.battleLog[this.battleLog.length - 1];
                logContainer.innerHTML += `<div class="battle-log-entry">
                    <span class="battle-log-time">[${(event?.time / 1000).toFixed(1)}s]</span>
                    ${lastEntry}
                </div>`;
                logContainer.scrollTop = logContainer.scrollHeight;
            }

            if (this.battleTime >= this.totalTime) {
                clearInterval(simInterval);
                this.endBattle();
            }
        }, 16);
    }

    // 處理戰鬥事件
    processEvent(event) {
        const eventTexts = {
            pass: `${event.card.name} 發動傳球！`,
            shoot: `${event.card.name} 射門！${Math.random() > 0.5 ? '⚽ GOAL!' : '✅ 被擋下'}`,
            defend: `${event.card.name} 進行防守！`,
            foul: `${event.card.name} 犯規！`
        };

        const text = eventTexts[event.type];
        this.battleLog.push(text);

        // 判定進球
        if (event.type === 'shoot') {
            if (Math.random() > 0.6) {
                if (event.actor === 'player') {
                    this.playerScore++;
                } else {
                    this.enemyScore++;
                }
            }
        }
    }

    // 結束戰鬥
    endBattle() {
        const playerWon = this.playerScore > this.enemyScore;
        const resultDiv = document.getElementById('battleResult');

        resultDiv.className = playerWon ? 'battle-result' : 'battle-result lost';
        resultDiv.innerHTML = `
            <h2>${playerWon ? '🎉 勝利！' : '❌ 失敗'}</h2>
            <div class="battle-result-info">
                <div class="result-item">
                    <h3>我方得分</h3>
                    <div class="result-value">${this.playerScore}</div>
                </div>
                <div class="result-item">
                    <h3>敵方得分</h3>
                    <div class="result-value">${this.enemyScore}</div>
                </div>
            </div>
            <div class="battle-result-info">
                <div class="result-item">
                    <h3>獲得靈石</h3>
                    <div class="result-value">${playerWon ? '+500' : '+100'}</div>
                </div>
                <div class="result-item">
                    <h3>獲得經驗</h3>
                    <div class="result-value">${playerWon ? '+250' : '+50'}</div>
                </div>
            </div>
            <div class="battle-result-buttons">
                <button class="btn-primary" onclick="endBattle()">返回</button>
                <button class="btn-primary" onclick="goToPage('mainPage')">返回主菜單</button>
            </div>
        `;
        resultDiv.style.display = 'block';

        // 更新任務進度
        this.gameManager.updateTaskProgress('daily', 101, 1);
        if (playerWon) {
            this.gameManager.updateTaskProgress('main', 2, 1);
            this.gameManager.updateTaskProgress('daily', 102, 1);
        }

        // 獎勵玩家
        if (playerWon) {
            this.gameManager.gameState.gold += 500;
            this.gameManager.gameState.playerExp += 250;
        } else {
            this.gameManager.gameState.gold += 100;
            this.gameManager.gameState.playerExp += 50;
        }

        this.gameManager.saveGame();
        this.gameManager.updateUI();
    }
}

// 設置戰鬥速度
function setBattleSpeed(speed) {
    if (window.currentBattle) {
        window.currentBattle.speed = speed;
    }

    document.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// 掃蕩
function sweepBattle() {
    if (window.currentBattle) {
        window.currentBattle.totalTime = 1000;
        window.currentBattle.speed = 100;
    }
}
