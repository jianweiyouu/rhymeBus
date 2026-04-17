import pinyin from 'pinyin';

export const pinyinParser = {
  /**
   * 將整句話轉換為結構化的字物件陣列
   * @param {string} text - 使用者輸入的一整句話
   * @param {number} lineIndex - 這句話在 Queue 裡面的行號 (0, 1, 2)
   */
  parseLine: (text, lineIndex) => {
    if (!text || typeof text !== 'string') return [];

    const nodePinyin = typeof pinyin === 'function' ? pinyin : pinyin.default;
    
    // 1. 將整句話拆解成單字陣列
    const chars = text.split('');

    // 2. 轉化為結構化物件
    return chars.map((char, pos) => {
      // 取得該字的拼音 (不帶聲調)
      const pyResult = nodePinyin(char, {
        style: 0, // STYLE_NORMAL
        heteronym: false
      });

      const py = pyResult ? pyResult[0][0] : '';

      return {
        line: lineIndex,      // 行索引
        pos: pos,             // 字位置
        char: char,           // 原始漢字
        pinyin: py,           // 拼音
        isTail: pos === chars.length - 1, // 是否為句尾
        hasRhymeGroup: false, // 預設為未押韻，留給 Analyzer 標記
        rhymeWith: []         // 預設空的，用來存放關聯座標
      };
    });
  }
};