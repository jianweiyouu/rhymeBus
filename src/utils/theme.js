import chalk from 'chalk';

/**
 * 打亂順序後的 20 組酷炫色票
 * 邏輯：冷暖色交替、明暗度錯開，確保前 10 組押韻視覺對比最大化
 */

const palette = [
    // 1-5: 核心活力色
    chalk.bgHex('#2E86C1').white,  // 1. 亮鈷藍 (活力開場)
    chalk.bgHex('#A04000').white,  // 2. 琥珀橙
    chalk.bgHex('#239B56').white,  // 3. 翡翠綠
    chalk.bgHex('#884EA0').white,  // 4. 紫晶色
    chalk.bgHex('#D35400').white,  // 5. 南瓜橘

    // 6-10: 深邃電氣色
    chalk.bgHex('#17A589').white,  // 6. 碧璽綠
    chalk.bgHex('#B03A2E').white,  // 7. 紅寶石
    chalk.bgHex('#2471A3').white,  // 8. 藍寶石
    chalk.bgHex('#D4AC0D').black,  // 9. 芥末黃 (這組用黑字更清晰)
    chalk.bgHex('#717D7E').white,  // 10. 鋼鐵灰

    // 11-15: 熱帶與莫蘭迪活力版
    chalk.bgHex('#28B463').white,  // 11. 鮮孔雀綠
    chalk.bgHex('#E67E22').white,  // 12. 赭石橙
    chalk.bgHex('#7D3C98').white,  // 13. 深紫羅蘭
    chalk.bgHex('#1F618D').white,  // 14. 丹寧藍
    chalk.bgHex('#943126').white,  // 15. 漿果紅

    // 16-20: 冷暖交替
    chalk.bgHex('#117A65').white,  // 16. 深青松石
    chalk.bgHex('#CA6F1E').white,  // 17. 鐵線蓮
    chalk.bgHex('#5B2C6F').white,  // 18. 暗黑醋栗
    chalk.bgHex('#2E4053').white,  // 19. 深邃灰藍
    chalk.bgHex('#1E8449').white   // 20. 鮮綠林
];
export const theme = {
    primary: chalk.hex('#FF8800'),
    success: chalk.green.bold,
    muted: chalk.gray,

    renderChar: (wordObj) => {
        if (wordObj.hasRhymeGroup && wordObj.matchId) {
            // 取模 20 確保循環
            const colorFn = palette[(wordObj.matchId - 1) % palette.length];
            return colorFn(` ${wordObj.char} `);
        }
        return wordObj.char;
    }
};