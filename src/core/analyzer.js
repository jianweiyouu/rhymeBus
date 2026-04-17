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
        // ... (這裡的邏輯維持不變) ...
        for (let i = 0; i < lineA.length; i++) {
            for (let j = 0; j < lineB.length; j++) {
                let offset = 0;
                const currentMatchSegment = [];
                while (
                    (i + offset) < lineA.length && 
                    (j + offset) < lineB.length &&
                    lineA[i + offset].group && 
                    lineB[j + offset].group &&
                    lineA[i + offset].group === lineB[j + offset].group
                ) {
                    currentMatchSegment.push({
                        wordA: lineA[i + offset],
                        wordB: lineB[j + offset]
                    });
                    offset++;
                }
                if (currentMatchSegment.length > 0) {
                    allMatches.push(currentMatchSegment);
                    if (offset > 1) j += (offset - 1);
                }
            }
        }
        return allMatches;
    }
};