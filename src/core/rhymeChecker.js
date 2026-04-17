import { INITIALS, RHYME_GROUPS, getGroupTag } from '../utils/pinyinRules.js';

export const rhymeChecker = {
  /**
   * 1. 提取韻母 (Final)
   * 處理拼音並回傳其母音部分，包含防呆與特殊音節轉換
   */
  getFinal: (pinyin) => {
    if (!pinyin || typeof pinyin !== 'string') return '';
    
    const py = pinyin.toLowerCase().trim();
    
    // 處理特殊音節 (y, w 開頭的縮寫還原)
    if (py === 'yi') return 'i';
    if (py === 'wu') return 'u';
    if (py === 'yu') return 'v'; // 習慣上 v 代表 ü
    
    // 尋找第一個母音出現的位置 (a, e, i, o, u, v)
    const vowelIndex = py.search(/[aeiouv]/);
    
    // 如果找不到母音（例如純聲母或無效輸入），回傳原始字串
    if (vowelIndex === -1) return py;
    
    return py.substring(vowelIndex);
  },

  /**
   * 2. 取得韻部標籤 (Group Tag)
   * 這是 analyzer 最需要的：直接從拼音拿到 'an', 'au' 等標籤
   */

  getGroup: (pinyin) => {
    if (!pinyin) return null;
    const final = rhymeChecker.getFinal(pinyin);
    // 我們現在把 pinyin 也傳進去，讓 Rules 判斷它是哪種 i
    return getGroupTag(pinyin, final); 
  },
  /**
   * 3. 判定：兩者是否屬於同一個押韻群組
   */
  isRhyme: (py1, py2) => {
    const group1 = rhymeChecker.getGroup(py1);
    const group2 = rhymeChecker.getGroup(py2);
    
    // 必須兩個都有有效的群組且相等
    return group1 !== null && group1 === group2;
  },

  /**
   * 4. 生成變體 (Variations)
   * 用於推薦功能：根據該音節的韻部，生成所有字典中「理論上」可能的拼音
   */
  getPossibleVariations: (pinyin) => {
    const groupTag = rhymeChecker.getGroup(pinyin);
    
    if (!groupTag) {
      return { original: pinyin, group: null, variations: [] };
    }

    const memberFinals = RHYME_GROUPS[groupTag];
    const results = [];

    memberFinals.forEach(final => {
      INITIALS.forEach(init => {
        let combined = init + final;
        
        // 修正 y/w 特殊拼寫
        if (init === 'y' && final === 'i') combined = 'yi';
        if (init === 'w' && final === 'u') combined = 'wu';
        
        if (combined !== pinyin) {
          results.push(combined);
        }
      });
    });

    return {
      original: pinyin,
      group: groupTag,
      variations: results
    };
  }
};