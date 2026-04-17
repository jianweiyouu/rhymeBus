import dict from './dictionary.js';
import { rhymeChecker } from './rhymeChecker.js';

console.log("🚌 Rhyme Bus 引擎啟動中...");

// 1. 初始化字典 (讀取那 12 萬筆資料)
dict.init(); 

// 2. 測試搜尋
const testPinyin = 'ma';
const lookup = dict.search(testPinyin);

if (lookup.exists) {
    console.log(`✅ 字典匹配成功！拼音 "${testPinyin}" 對應的字有:`);
    console.log(lookup.chars.slice(0, 20).join(', ') + " ...");
    
    // 3. 測試押韻分析
    console.log(`\n正在尋找與 "${testPinyin}" 押韻的候選音...`);
    const { variations } = rhymeChecker.getPossibleVariations(testPinyin);
    
    // 4. 從字典中過濾出真實存在的押韻字
    const matches = variations.filter(v => dict.search(v).exists);
    console.log(`✨ 發現 ${matches.length} 個合法的押韻音節！`);
    console.log(`例如: ${matches.slice(0, 10).join(', ')}`);
}