// 主程式入口

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 足球修仙界 - 初始化中...');
    
    // 初始化遊戲管理器
    initGameManager();
    
    // 添加全局錯誤處理
    window.onerror = (msg, url, lineNo, columnNo, error) => {
        console.error('遊戲錯誤:', error);
        return false;
    };

    console.log('✅ 遊戲已準備就緒！');
});

// 頁面卸載時保存
window.addEventListener('beforeunload', () => {
    if (gameManager && gameManager.currentSlot) {
        gameManager.saveGame();
    }
});

// 添加快捷鍵支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        toggleSettings();
    }
});

// 防止縮放
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });
