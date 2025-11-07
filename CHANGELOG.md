# Changelog

## [Phase 4 Demo] - 2025-01-08

### ✨ 新功能

#### AI 對話介面
- 完整的對話歷史顯示
- 用戶訊息和 AI 回應的視覺區分
- 自動滾動到最新訊息
- 時間戳顯示

#### Mock AI 回應引擎
- 根據問題類型生成不同回答（是什麼/如何/為什麼/一般）
- 基於筆記內容的智能回答
- 友善的歡迎訊息
- 無相關筆記時的建議

#### 相關筆記搜尋
- 關鍵字提取和匹配算法
- 相關度評分系統（標題權重更高）
- 顯示 top 3 相關筆記
- 點擊筆記可直接跳轉並展開分類

#### 互動優化
- 思考中動態指示器（跳動點點動畫）
- 模擬真實 AI 思考延遲（1.5秒）
- Enter 發送，Shift+Enter 換行
- 輸入框和按鈕的禁用狀態管理

### 🎨 UI/UX 更新

#### 對話泡泡設計
- 用戶訊息：綠色背景（#3d7a4f），右對齊
- AI 訊息：深灰背景（#2d2d2d），左對齊
- 思考中：灰色背景，動態動畫

#### 動畫效果
- 訊息淡入動畫（fadeIn）
- 思考中跳動點點動畫
- 平滑滾動行為
- 相關筆記 hover 效果

#### 相關筆記卡片
- 顯示筆記標題和分類
- Hover 效果：藍色邊框 + 位移動畫
- 可點擊跳轉

### 🛠️ 技術改進

#### 新增文件
- `src/utils/mockAI.js` - Mock AI 回應生成器

#### 新增函數
- `searchRelevantNotes()` - 搜尋相關筆記（關鍵字匹配）
- `handleAISubmit()` - 處理 AI 提問
- `handleAIKeyPress()` - 處理輸入框按鍵
- `handleRelevantNoteClick()` - 點擊相關筆記跳轉
- `generateMockResponse()` - 生成 Mock 回答
- `simulateThinking()` - 模擬思考延遲
- `getWelcomeMessage()` - 歡迎訊息

#### 狀態管理
- `aiMessages` - 對話歷史陣列
- `aiInput` - 輸入框內容
- `isAiThinking` - 思考狀態
- `aiContentRef` - 對話內容區域引用（自動滾動）

#### CSS 樣式
- `.ai-message.user / .ai` - 用戶/AI 訊息樣式
- `.message-content` - 訊息內容樣式
- `.message-timestamp` - 時間戳樣式
- `.thinking-indicator / .thinking-dot` - 思考動畫
- `.relevant-notes / .relevant-note-item` - 相關筆記卡片
- `@keyframes fadeIn / thinking` - 動畫定義

### 📊 功能完整度
- ✅ 建立筆記
- ✅ 編輯筆記
- ✅ 刪除筆記
- ✅ 移動筆記
- ✅ 匯入筆記（Phase 2）
- ✅ 搜尋筆記（Phase 1）
- ✅ AI 對話（Demo，Mock）
- ⚠️ 真實 AI API（Phase 5）

### ⚠️ Demo 版本說明
- 這是 Demo 版本，AI 回答是預先設計的模板
- 不真正呼叫 OpenAI API
- 相關筆記搜尋使用關鍵字匹配（非向量搜尋）
- 適合展示 UI 和互動流程
- 未來可升級到真實 AI（Phase 5）

---

## [Phase 3] - 2025-01-08

### ✨ 新功能

#### 建立新筆記
- 點擊「➕ 新增」按鈕建立空白筆記
- 自動命名為「未命名筆記」
- 預設放在「未分類」分類
- 自動選中並開始編輯

#### 移動筆記
- 工具列新增分類選擇器（下拉選單）
- 即時移動筆記到任何分類
- 顯示所有分類和 emoji 圖示
- 自動更新筆記時間戳

#### 刪除筆記
- 工具列刪除按鈕現在可用
- 刪除前顯示確認對話框
- 自動選擇下一個筆記
- 支援資料持久化

### 🎨 UI/UX 更新

#### 工具列增強
- 新增分類選擇器（下拉選單）
- 刪除按鈕已連接功能
- 與深色主題一致的樣式

#### 互動改善
- 確認對話框防止誤刪
- 即時視覺回饋
- 流暢的筆記切換

### 🛠️ 技術改進

#### 新增函數
- `handleCreateNote()` - 建立新筆記
- `moveNoteToCategory()` - 移動筆記
- `handleDeleteNote()` - 刪除筆記

#### CSS 樣式
- `.category-selector` - 分類選擇器樣式
- Hover 和 focus 效果

### 📊 功能完整度
- ✅ 建立筆記
- ✅ 編輯筆記
- ✅ 刪除筆記
- ✅ 移動筆記
- ✅ 匯入筆記（Phase 2）
- ✅ 搜尋筆記（Phase 1）

---

## [Phase 2] - 2025-01-08

### ✨ 新功能

#### ZIP 檔案匯入
- 支援上傳 ChatGPT 匯出的 .zip 檔案
- 自動解析 `conversations.json`
- 批次處理多個對話（測試檔案包含 8 個對話）

#### 智能轉換
- 將 ChatGPT 對話樹轉換為線性 Markdown 筆記
- 格式化為問答形式
- 保留原始時間戳記
- 生成易讀的筆記標題

#### 自動分類
- 基於關鍵字的智能分類
- 支援 10+ 種分類（AI、開發、產品、商業等）
- 中英文關鍵字匹配
- 預設分類到「未分類」

#### 本地資料庫
- 整合 localforage（IndexedDB）
- 自動儲存筆記和分類變更
- 應用程式重啟後資料保留
- 支援大量筆記儲存

#### 使用者體驗
- 匯入進度即時顯示
- 階段性進度提示（解析 → 轉換 → 分類）
- 成功/失敗狀態提示
- 匯入統計資訊顯示

### 🛠️ 技術改進

#### 新增依賴
- `jszip` - ZIP 檔案處理
- `localforage` - IndexedDB 封裝

#### 新增工具模組
- `src/utils/importParser.js` - 檔案解析和轉換
- `src/utils/storage.js` - 資料儲存管理

#### 程式碼結構
- 分離關注點（解析、轉換、儲存）
- 錯誤處理和驗證
- 非同步操作處理

### 🎨 UI/UX 更新

#### 匯入介面
- 檔案選擇器（支援 .zip）
- 匯入按鈕狀態管理（正常/匯入中）
- 進度 modal 動畫

#### 進度顯示
- 半透明背景遮罩
- 模糊效果（backdrop-filter）
- 脈衝動畫圖示
- 進度條視覺化

### 📦 資料格式

#### 支援的匯入格式
```json
{
  "title": "對話標題",
  "create_time": 1762541834.909977,
  "mapping": {
    "node_id": {
      "message": {
        "author": { "role": "user" },
        "content": { "parts": ["文字內容"] }
      }
    }
  }
}
```

#### 輸出筆記格式
```markdown
# 對話標題

## 問題 1
用戶問題...

### 回答
AI 回答...

---
```

### 🧪 測試

#### 測試檔案
- `chatgptExportedZipFileExample.zip` - 包含 8 個對話
- 測試指南：`TEST_IMPORT_GUIDE.md`

#### 測試覆蓋
- ✅ ZIP 檔案解析
- ✅ JSON 格式驗證
- ✅ 對話轉換
- ✅ 自動分類
- ✅ 資料持久化
- ✅ 錯誤處理
- ✅ 進度顯示

### 🐛 已知問題
- 自動分類基於簡單關鍵字匹配（未來可改用 AI）
- 大檔案匯入可能需要較長時間

---

## [Phase 1] - 2025-01-08

### ✨ 初始功能

#### 核心功能
- Electron + React 應用程式
- 三欄式 UI 佈局
- 12 個預設分類（含 emoji）
- 10 個 mock 筆記範例
- 關鍵字搜尋功能
- 即時筆記編輯
- AI 對話面板

#### UI/UX
- 深色主題設計
- 平滑動畫效果
- Hover 互動回饋
- Mac 風格視窗控制

#### 技術堆疊
- Electron 33.2.1
- React 19.0.0
- Vite 6.0.3
- 純 CSS（無框架）

---

## 版本號規則
- Phase 1 = MVP 基礎功能
- Phase 2 = 匯入和資料庫
- Phase 3 = AI 功能（規劃中）


