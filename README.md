# Sasaya AI

將 AI 聊天記錄轉換為個人知識庫的 Mac 應用程式。

## 功能特色

- ✅ 匯入 ChatGPT .zip 檔案
- ✅ 自動分類筆記
- ✅ 智慧搜尋功能
- ✅ 本地儲存，隱私優先
- ✅ 三欄式 UI 設計
- ✅ AI 對話助手

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
- 純 CSS（無框架）

## 專案結構

```
├── electron/          # Electron 主程序
├── src/
│   ├── components/    # React 組件
│   ├── data/          # Mock data
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

## 後續開發

- [ ] 實際檔案匯入功能
- [ ] AI 自動分類
- [ ] 本地資料庫整合
- [ ] 筆記匯出功能
- [ ] 更多格式化工具


