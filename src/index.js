import readline from 'readline';
import { pinyinParser } from './core/pinyinParser.js';
import { analyzer } from './core/analyzer.js';
import { theme } from './utils/theme.js';

// 1. 初始化 Queue (滑動窗口)
let sentenceQueue = [];
const MAX_LINES = 10;

// 2. 建立 Readline 介面
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: theme.primary('RhymeBus ❯ ') 
});

console.log(theme.primary("\n🚌 歡迎搭乘 Rhyme Bus 歌詞分析巴士"));
console.log(theme.muted(`提示：輸入文字後按 Enter，系統將自動分析最近 ${MAX_LINES} 句。`));
console.log(theme.muted(`(不同顏色代表不同的連續押韻詞組)\n`));

rl.prompt();

// 3. 監聽每一行輸入
rl.on('line', (input) => {
    const text = input.trim();

    // 結束指令
    if (text.toLowerCase() === 'exit' || text.toLowerCase() === 'quit') {
        console.log(theme.primary("\n🏁 巴士到站，感謝搭乘！"));
        process.exit(0);
    }

    if (text) {
        // --- 核心邏輯開始 ---

        // A. 將新輸入轉為字物件並推入 Queue
        const newLine = pinyinParser.parseLine(text, 0);
        sentenceQueue.push(newLine);

        // B. 維持 Queue 長度 (滑動窗口)
        if (sentenceQueue.length > MAX_LINES) {
            sentenceQueue.shift();
        }

        // C. 重新對 Queue 裡的行號進行編號 (確保 analyzer 座標正確)
        sentenceQueue.forEach((line, idx) => {
            line.forEach(word => word.line = idx);
        });

        // D. 呼叫大腦分析 (全場掃描：會找出所有行之間的押韻並分配 matchId)
        analyzer.analyzeQueue(sentenceQueue);

        // E. 清除畫面並重新渲染
        // 如果想讓畫面像 App 一樣固定，可以解開下面這一行：
        // console.clear(); 
        
        console.log("\n" + theme.muted("--- 即時押韻分析 ---"));
        
        sentenceQueue.forEach((line, idx) => {
            // 使用 theme.renderChar 根據 matchId 自動上色
            const renderedLine = line.map(word => theme.renderChar(word)).join("");
            
            // 偵錯模式提示：顯示拼音韻部，方便檢查
            let debugInfo = "";
            if (idx === sentenceQueue.length - 1) {
                const tags = line.map(w => w.group || '?').join('|');
                debugInfo = theme.muted(`  [發音部：${tags}]`);
            }

            console.log(`${theme.muted(idx + 1 + ". ")}${renderedLine}`); //debugInfo 先不顯示
        });

        // F. 動態回饋：統計全場出現的所有 matchId
        const allActiveMatchIds = [...new Set(
            sentenceQueue.flat()
                .filter(w => w.matchId !== null)
                .map(w => w.matchId)
        )];
        
        if (allActiveMatchIds.length > 0) {
            console.log(theme.success(`✨ 全場偵測到 ${allActiveMatchIds.length} 組押韻詞對，已區分顏色`));
        } else {
            console.log(theme.muted("   (尚未偵測到符合門檻的雙押組合)"));
        }

        console.log(theme.muted("--------------------\n"));
        
        // --- 核心邏輯結束 ---
    }

    rl.prompt();
});