// 遊戲全局資料

const GAME_DATA = {
    // 12 宗門定義
    sects: [
        { id: 1, name: '森陽幻森宗', element: '木', color: '#10b981', emoji: '🌳' },
        { id: 2, name: '蒼瀑劍河宗', element: '水', color: '#3b82f6', emoji: '💧' },
        { id: 3, name: '星穹聖光宗', element: '光', color: '#fbbf24', emoji: '⭐' },
        { id: 4, name: '王庭聖鋒宗', element: '金', color: '#f59e0b', emoji: '👑' },
        { id: 5, name: '烈焰紅獅宗', element: '火', color: '#ef4444', emoji: '🔥' },
        { id: 6, name: '風車天翼宗', element: '風', color: '#06b6d4', emoji: '🌪️' },
        { id: 7, name: '航海破浪宗', element: '水', color: '#0ea5e9', emoji: '🌊' },
        { id: 8, name: '赤陽鬥魂宗', element: '火', color: '#ff6b6b', emoji: '🌅' },
        { id: 9, name: '聖城鐵壁宗', element: '土', color: '#a78bfa', emoji: '🏰' },
        { id: 10, name: '棋域幻影宗', element: '暗', color: '#8b5cf6', emoji: '♟️' },
        { id: 11, name: '雷霆戰車宗', element: '雷', color: '#fbbf24', emoji: '⚡' },
        { id: 12, name: '自由星界宗', element: '空', color: '#60a5fa', emoji: '🌌' }
    ],

    // 卡牌顏色等級
    colors: [
        { id: 1, name: '白', symbol: '🤍', value: 1 },
        { id: 2, name: '綠', symbol: '💚', value: 2 },
        { id: 3, name: '藍', symbol: '💙', value: 3 },
        { id: 4, name: '橘', symbol: '🧡', value: 4 },
        { id: 5, name: '紅', symbol: '❤️', value: 5 },
        { id: 6, name: '紫', symbol: '💜', value: 6 },
        { id: 7, name: '黃', symbol: '💛', value: 7 }
    ],

    // 卡牌位置
    positions: ['門將', '後衛', '中場', '前鋒'],

    // 陣型配置（18 種）
    formations: [
        { id: 1, name: '劍陣·1 (4-3-3)', formation: '4-3-3', type: '攻擊', atk: 25, def: -15, mid: -5 },
        { id: 2, name: '劍陣·2 (3-4-3)', formation: '3-4-3', type: '攻擊', atk: 20, def: -10, mid: 10 },
        { id: 3, name: '劍陣·3 (2-4-4)', formation: '2-4-4', type: '攻擊', atk: 15, def: -5, mid: 15 },
        { id: 4, name: '鐵壁陣·1 (5-4-1)', formation: '5-4-1', type: '防守', atk: -15, def: 25, mid: 5 },
        { id: 5, name: '鐵壁陣·2 (5-3-2)', formation: '5-3-2', type: '防守', atk: -10, def: 20, mid: -5 },
        { id: 6, name: '鐵壁陣·3 (4-5-1)', formation: '4-5-1', type: '防守', atk: -5, def: 15, mid: 10 },
        { id: 7, name: '八卦陣·1 (4-4-2)', formation: '4-4-2', type: '均衡', atk: 5, def: 5, mid: 20 },
        { id: 8, name: '八卦陣·2 (4-3-3)', formation: '4-3-3', type: '均衡', atk: 0, def: 0, mid: 15 },
        { id: 9, name: '八卦陣·3 (3-5-2)', formation: '3-5-2', type: '均衡', atk: 10, def: 10, mid: 10 },
        { id: 10, name: '天羅地網·1 (4-2-4)', formation: '4-2-4', type: '控場', atk: -5, def: 10, mid: 30 },
        { id: 11, name: '天羅地網·2 (5-2-3)', formation: '5-2-3', type: '控場', atk: -10, def: 15, mid: 25 },
        { id: 12, name: '天羅地網·3 (3-3-4)', formation: '3-3-4', type: '控場', atk: 5, def: 5, mid: 25 },
        { id: 13, name: '虹光陣 (3-3-1-4)', formation: '特殊', type: '特殊', atk: 15, def: 15, mid: 15 },
        { id: 14, name: '五行陣 (動態)', formation: '特殊', type: '特殊', atk: 10, def: 10, mid: 20 },
        { id: 15, name: '星陣連環 (3-3-1-4)', formation: '特殊', type: '特殊', atk: 10, def: 10, mid: 20 },
        { id: 16, name: '修羅場 (激進)', formation: '特殊', type: '特殊', atk: 30, def: -20, mid: 10 },
        { id: 17, name: '禪定陣 (保守)', formation: '特殊', type: '特殊', atk: -10, def: 30, mid: 5 },
        { id: 18, name: '九宮格 (均衡)', formation: '特殊', type: '特殊', atk: 10, def: 10, mid: 10 }
    ],

    // 聯賽配置
    leagues: [
        {
            id: 'C1',
            name: '丙級業餘修仙',
            chapter: 1,
            level: '丙級',
            difficulty: '⭐',
            enemy: '庸才隊',
            power: 500,
            rewards: { gold: 200, exp: 100, cards: 1 },
            unlocked: true
        },
        {
            id: 'C2',
            name: '丙級業餘修仙',
            chapter: 2,
            level: '丙級',
            difficulty: '⭐⭐',
            enemy: '進階隊',
            power: 800,
            rewards: { gold: 300, exp: 150, cards: 1 },
            unlocked: false
        },
        {
            id: 'C3',
            name: '丙級業餘修仙',
            chapter: 3,
            level: '丙級',
            difficulty: '⭐⭐⭐',
            enemy: '菁英隊',
            power: 1200,
            rewards: { gold: 500, exp: 200, cards: 2 },
            unlocked: false
        },
        {
            id: 'B1',
            name: '乙級業餘修仙',
            chapter: 4,
            level: '乙級',
            difficulty: '⭐⭐⭐',
            enemy: '中階隊',
            power: 1500,
            rewards: { gold: 600, exp: 250, cards: 2 },
            unlocked: false
        },
        {
            id: 'B2',
            name: '乙級業餘修仙',
            chapter: 5,
            level: '乙級',
            difficulty: '⭐⭐⭐⭐',
            enemy: '強隊',
            power: 2000,
            rewards: { gold: 800, exp: 300, cards: 2 },
            unlocked: false
        },
        {
            id: 'B3',
            name: '乙級業餘修仙',
            chapter: 6,
            level: '乙級',
            difficulty: '⭐⭐⭐⭐',
            enemy: '勁敵隊',
            power: 2500,
            rewards: { gold: 1000, exp: 350, cards: 3 },
            unlocked: false
        },
        {
            id: 'A1',
            name: '甲級業餘修仙',
            chapter: 7,
            level: '甲級',
            difficulty: '⭐⭐⭐⭐',
            enemy: '甲級隊',
            power: 3000,
            rewards: { gold: 1200, exp: 400, cards: 3 },
            unlocked: false
        },
        {
            id: 'A2',
            name: '甲級業餘修仙',
            chapter: 8,
            level: '甲級',
            difficulty: '⭐⭐⭐⭐⭐',
            enemy: '精銳隊',
            power: 3500,
            rewards: { gold: 1500, exp: 450, cards: 3 },
            unlocked: false
        },
        {
            id: 'A3',
            name: '甲級業餘修仙',
            chapter: 9,
            level: '甲級',
            difficulty: '⭐⭐⭐⭐⭐',
            enemy: '最強隊',
            power: 4000,
            rewards: { gold: 2000, exp: 500, cards: 4 },
            unlocked: false
        },
        {
            id: 'SC1',
            name: '二軍初選賽',
            chapter: 10,
            level: '二軍',
            difficulty: '⭐⭐⭐⭐⭐',
            enemy: '二軍隊',
            power: 4500,
            rewards: { gold: 2500, exp: 550, cards: 4 },
            unlocked: false
        },
        {
            id: 'D1',
            name: '階梯賽',
            chapter: 11,
            level: '階梯',
            difficulty: '⭐⭐⭐⭐⭐⭐',
            enemy: '職業隊',
            power: 5000,
            rewards: { gold: 3000, exp: 600, cards: 5 },
            unlocked: false
        },
        {
            id: 'P1',
            name: '職業冠軍賽',
            chapter: 12,
            level: '冠軍',
            difficulty: '⭐⭐⭐⭐⭐⭐⭐',
            enemy: '冠軍隊',
            power: 6000,
            rewards: { gold: 5000, exp: 1000, cards: 10 },
            unlocked: false
        }
    ],

    // 抽卡機制
    cardRarity: [
        { color: 'white', rate: 60, value: 1 },
        { color: 'green', rate: 25, value: 2 },
        { color: 'blue', rate: 10, value: 3 },
        { color: 'orange', rate: 3, value: 4 },
        { color: 'red', rate: 1.5, value: 5 },
        { color: 'purple', rate: 0.4, value: 6 },
        { color: 'yellow', rate: 0.1, value: 7 }
    ],

    // 任務配置
    tasks: {
        main: [
            { id: 1, name: '首次上陣', desc: '進行 1 場比賽', reward: { gold: 100 }, progress: 0, target: 1, completed: false },
            { id: 2, name: '贏下第一場', desc: '贏得 1 場比賽', reward: { gems: 50 }, progress: 0, target: 1, completed: false },
            { id: 3, name: '升到 3 星', desc: '合成 1 張 3 星卡牌', reward: { gold: 200, cards: 1 }, progress: 0, target: 1, completed: false },
            { id: 4, name: '組建完整隊伍', desc: '配置 11 名球員', reward: { gold: 300 }, progress: 0, target: 1, completed: false },
            { id: 5, name: '通過乙級副本', desc: '通過乙級聯賽第 1 章', reward: { cards: 3 }, progress: 0, target: 1, completed: false }
        ],
        daily: [
            { id: 101, name: '比賽新手', desc: '進行 3 場比賽', reward: { gold: 50 }, progress: 0, target: 3, completed: false },
            { id: 102, name: '勝利者', desc: '贏得 5 場比賽', reward: { gold: 100, gems: 50 }, progress: 0, target: 5, completed: false },
            { id: 103, name: '合成大師', desc: '合成 5 次卡牌', reward: { gold: 75 }, progress: 0, target: 5, completed: false },
            { id: 104, name: '抽卡狂人', desc: '抽卡 10 次', reward: { gold: 50 }, progress: 0, target: 10, completed: false }
        ]
    }
};

// 生成基礎卡牌資料
function generateBaseCard(sectId, colorId, position, stars) {
    const sect = GAME_DATA.sects.find(s => s.id === sectId);
    const color = GAME_DATA.colors.find(c => c.id === colorId);
    
    return {
        id: `card_${sectId}_${colorId}_${position}_${stars}`,
        name: `${sect.name}·${position}`,
        sect: sect.name,
        sectId: sect.id,
        element: sect.element,
        emoji: sect.emoji,
        color: color.name,
        colorId: color.id,
        position: position,
        stars: stars,
        baseStats: {
            atk: 30 + (colorId * 5) + (stars * 10),
            def: 25 + (colorId * 4) + (stars * 8),
            spd: 20 + (colorId * 3) + (stars * 5),
            acc: 25 + (colorId * 4) + (stars * 6)
        }
    };
}

// 遊戲初始狀態
const INITIAL_GAME_STATE = {
    playerLevel: 1,
    playerExp: 0,
    gold: 10000,
    gems: 100,
    cards: [], // 玩家卡牌
    team: {
        formationId: null,
        slots: [] // 11 個位置的卡牌 ID
    },
    battleHistory: [],
    completedLevels: [],
    tasks: {
        main: GAME_DATA.tasks.main.map(t => ({ ...t })),
        daily: GAME_DATA.tasks.daily.map(t => ({ ...t }))
    },
    totalBattles: 0,
    totalWins: 0,
    lastDailyReset: new Date().toDateString()
};
