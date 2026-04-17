```
rhyme-bus/
├── node_modules/         # npm 安裝的套件 (chalk, boxen, pinyin 等)
├── package.json          # 專案設定檔 (需設定 "type": "module")
├── src/
│   ├── index.js          # 入口點：負責 CLI 交互、接收輸入、印出彩色結果
│   │
│   ├── core/             # 核心邏輯層 (純 JS 邏輯，不依賴 UI/上色套件)
│   │   ├── engine.js     # 總指揮：調用 Transformer 與 Dictionary 執行匹配
│   │   ├── dictionary.js # Trie 數據結構：負責合法拼音與漢字詞庫的管理
│   │   └── pinyinTransformer.js # 拼音拆解器：負責聲母/韻母提取與組合
│   │
│   └── utils/            # 工具與配置層 (放置規則、主題與通用函數)
│       ├── rhymeMap.js   # 押韻規則表：定義韻部群組 (如 an, ian, uan 的歸類)
│       └── theme.js      # 視覺主題：定義 Chalk 的配色方案與 Boxen 樣式
│
└── data/                 # (預留) 資料存放區
    └── words.json        # 存放合法的拼音與對應漢字詞庫
```

Data source: CC-CEDICT