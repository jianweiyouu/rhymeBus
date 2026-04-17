/**
 * 聲母表 (Initials)
 */
export const INITIALS = [
    '', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 
    'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'
];

/**
 * 押韻分組表 (Rhyme Groups)
 * 進行了「嚴格化」調整，特別是針對 i 韻進行細分
 */
export const RHYME_GROUPS = {
    'a': ['a', 'ia', 'ua'],
    'uo': ['o', 'uo'],
    'e': ['e', 'ie', 've'],
    'ai': ['ai', 'uai'],
    'ei': ['ei', 'ui'],
    'ao': ['ao', 'iao'],
    'ou': ['ou', 'iu'],
    'an': ['an', 'ian', 'uan', 'van'],
    'en': ['en', 'in', 'un', 'vn'],
    'ang': ['ang', 'iang', 'uang'],
    'eng': ['eng', 'ing', 'ong', 'iong'],
    'u': ['u'],
    'er': ['er'],
    
    // --- 細分後的 i 韻部 ---
    'i_pure': ['i', 'v'],                // 齊齒音：地 (di), 離 (li), 去 (qu/qv)
    'i_zhi': ['zhi', 'chi', 'shi', 'ri'], // 捲舌音：制 (zhi), 吃 (chi), 試 (shi)
    'i_zi': ['zi', 'ci', 'si'],           // 平舌音：自 (zi), 次 (ci), 四 (si)
};

/**
 * 反向查詢：輸入拼音，回傳所屬群組標籤
 * 注意：現在需要完整的拼音來判斷 i 的類型
 */
export const getGroupTag = (pinyin, final) => {
    // 針對 i 的特殊判斷邏輯
    if (final === 'i') {
        if (['zh', 'ch', 'sh', 'r'].some(s => pinyin.startsWith(s))) return 'i_zhi';
        if (['z', 'c', 's'].some(s => pinyin.startsWith(s))) return 'i_zi';
        return 'i_pure';
    }

    // 其他韻母的常規比對
    for (const [group, members] of Object.entries(RHYME_GROUPS)) {
        if (members.includes(final)) return group;
    }
    return null;
};