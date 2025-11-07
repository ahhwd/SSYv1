# Sasaya AI

將 AI 聊天記錄轉換為個人知識庫的 Mac 應用程式。

## 功能特色

- ✅ 匯入 ChatGPT .zip 檔案
- ✅ 自動分類筆記
- ✅ 智慧搜尋功能
- ✅ 本地儲存，隱私優先
- ✅ 三欄式 UI 設計
- ✅ AI 對話助手
- ✅ **多語系支援（🇺🇸 英文 / 🇹🇼 繁體中文）**

## 開發指令

```bash
# 安裝依賴
npm install

# 啟動開發模式（Vite + Electron）
npm run electron:dev

# 或分別啟動
# 終端 1: 啟動 Vite
npm run dev

# 終端 2: 啟動 Electron
npm run electron

# 建置應用程式
npm run build
npm run package
```

## 技術堆疊

- Electron
- React 19
- Vite
- i18next + react-i18next（國際化）
- localforage（本地儲存）
- jszip（ZIP 檔案處理）
- 純 CSS（無框架）

## 專案結構

```
├── electron/          # Electron 主程序
├── src/
│   ├── i18n/          # 國際化配置
│   │   ├── config.js  # i18n 配置
│   │   └── locales/   # 翻譯文件
│   │       ├── en.json       # 英文
│   │       └── zh-TW.json    # 繁體中文
│   ├── components/    # React 組件
│   ├── data/          # Mock data
│   ├── utils/         # 工具函數
│   ├── App.jsx        # 主應用程式
│   ├── App.css        # 樣式
│   └── main.jsx       # React 入口
├── index.html         # HTML 入口
└── package.json
```

## MVP 功能

目前版本包含 mock data，展示核心功能：
- 分類管理（展開/收合）
- 筆記列表與選擇
- 筆記編輯（標題和內容）
- 關鍵字搜尋
- AI 對話面板

## 多語系功能

Sasaya AI 支援以下語言：

- 🇺🇸 **English (US)** - 預設語言
- 🇹🇼 **繁體中文（台灣）**

### 切換語言

1. 點擊頂部欄左側的語言選擇器
2. 選擇您想要的語言
3. 介面會立即切換，選擇會自動保存

詳細測試指南請參閱：[I18N_TESTING_GUIDE.md](./I18N_TESTING_GUIDE.md)

## 部署

### Electron Desktop App

```bash
# 打包 macOS .dmg
npm run package:mac
```

### Web Version (Vercel)

```bash
# 建置 Web 版本
npm run build

# 部署到 Vercel
vercel
```

詳細部署指南請參閱：[VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md)

## 後續開發

- [x] 實際檔案匯入功能
- [x] AI 自動分類（關鍵字版本）
- [x] 本地資料庫整合
- [x] AI 對話功能（Demo 版本）
- [x] 多語系支援
- [ ] 真實 AI API 整合
- [ ] 筆記匯出功能
- [ ] 更多格式化工具


