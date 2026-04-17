import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 處理 ES Module 的路徑問題
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.chars = []; // 存放對應的中文字
  }
}

export class Dictionary {
  constructor() {
    this.root = new TrieNode();
  }

  // 插入邏輯
  insert(pinyin, char) {
    let curr = this.root;
    for (const letter of pinyin) {
      if (!curr.children[letter]) curr.children[letter] = new TrieNode();
      curr = curr.children[letter];
    }
    curr.isEndOfWord = true;
    if (char && !curr.chars.includes(char)) {
      curr.chars.push(char);
    }
  }

  // 搜尋邏輯
  search(pinyin) {
    let curr = this.root;
    for (const letter of pinyin) {
      if (!curr.children[letter]) return { exists: false, chars: [] };
      curr = curr.children[letter];
    }
    return { exists: curr.isEndOfWord, chars: curr.chars };
  }

  /**
   * 💡 核心：載入並解析 CEDICT 文件
   */
 init() {
    console.time('🚀 Dictionary Loaded');
    
    // 正確路徑：向上跳兩層 (../../) 才能從 core 走到根目錄的 data
    const filePath = path.join(__dirname, '../../data/cedict_ts.u8');
    
    // 💡 調試小撇步：如果還是不行，解開下面這行註釋，看看路徑到底指向哪裡
    // console.log('🔍 絕對路徑指向：', filePath);

    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ 找不到文件！請確認檔案是否存在於：${filePath}`);
            return;
        }

      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach(line => {
        // 跳過註釋行 (#)
        if (line.startsWith('#') || !line.trim()) return;

        // 正則表達式抓取： 繁體 簡體 [pinyin]
        // 格式範例： 碼 码 [ma3] /.../
        const match = line.match(/^(\S+)\s\S+\s\[([^\]]+)\]/);
        
        if (match) {
          const char = match[1]; // 繁體字
          const rawPinyin = match[2]; // 帶音調和空格的拼音
          
          // 預處理拼音：轉小寫、去掉數字音調、去掉多餘空格
          const cleanPinyin = rawPinyin
            .replace(/[0-9]/g, '')
            .replace(/\s+/g, '')
            .toLowerCase();

          this.insert(cleanPinyin, char);
        }
      });

      console.timeEnd('🚀 Dictionary Loaded');
    } catch (err) {
      console.error('❌ 無法讀取字典檔案:', err);
    }
  }
}

// 導出單例
const dict = new Dictionary();
export default dict;