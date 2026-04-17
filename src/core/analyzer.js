import { rhymeChecker } from './rhymeChecker.js';
export const analyzer = {
   analyzeQueue: (queue) => {
        if (!queue || queue.length < 2) return;

        // 1. 全場初始化
        let globalMatchCounter = 0;
        const groupToIdMap = {}; // 💡 核心：用來記錄「哪種韻部組合」對應「哪個 ID」

        queue.flat().forEach(word => {
            word.group = rhymeChecker.getGroup(word.pinyin);
            word.hasRhymeGroup = false;
            word.matchId = null; 
        });

        // 2. 全場比對
        for (let i = 0; i < queue.length; i++) {
            for (let j = i + 1; j < queue.length; j++) {
                const lineA = queue[i];
                const lineB = queue[j];

                const matches = analyzer.findContinuousMatches(lineA, lineB);

                matches.forEach(match => {
                    if (match.length >= 2) {
                        // 💡 建立這組匹配的「指紋」（例如： "eng-i_pure"）
                        const matchFingerprint = match.map(m => m.wordA.group).join('-');

                        // 如果這組發音組合沒出現過，才增加計數器
                        if (!groupToIdMap[matchFingerprint]) {
                            globalMatchCounter++;
                            groupToIdMap[matchFingerprint] = globalMatchCounter;
                        }

                        // 統一發放該指紋對應的 ID
                        const currentId = groupToIdMap[matchFingerprint];

                        match.forEach(wordPair => {
                            wordPair.wordA.hasRhymeGroup = true;
                            wordPair.wordA.matchId = currentId;
                            
                            wordPair.wordB.hasRhymeGroup = true;
                            wordPair.wordB.matchId = currentId;
                        });
                    }
                });
            }
        }
    },
    
    findContinuousMatches: (lineA, lineB) => {
    const allMatches = [];
    // 建立一個紀錄表，避免重複抓取已經匹配過的字
    const usedA = new Set();
    const usedB = new Set();

    // 先找最長的（炫技優先），再找短的
    for (let len = Math.min(lineA.length, lineB.length); len >= 2; len--) {
        for (let i = 0; i <= lineA.length - len; i++) {
            for (let j = 0; j <= lineB.length - len; j++) {
                
                // 檢查這一段是否連續匹配
                let isMatch = true;
                const currentSegment = [];
                for (let k = 0; k < len; k++) {
                    const wordA = lineA[i + k];
                    const wordB = lineB[j + k];
                    
                    if (usedA.has(wordA) || usedB.has(wordB) || wordA.group !== wordB.group) {
                        isMatch = false;
                        break;
                    }
                    currentSegment.push({ wordA, wordB });
                }

                if (isMatch) {
                    allMatches.push(currentSegment);
                    // 標記這些字已經用過了，不要再被拆開
                    currentSegment.forEach(pair => {
                        usedA.add(pair.wordA);
                        usedB.add(pair.wordB);
                    });
                }
            }
        }
    }
    return allMatches;
}
};