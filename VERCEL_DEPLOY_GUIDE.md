# 🚀 部署 Sasaya AI 到 Vercel

## ✅ 準備完成！

你的專案已經配置好，可以直接部署到 Vercel 了！

---

## 🎯 快速部署（3 分鐘）

### 方法 1：通過 Vercel CLI（推薦）

#### 步驟 1：安裝 Vercel CLI

```bash
npm i -g vercel
```

#### 步驟 2：登入 Vercel

```bash
vercel login
```

會開啟瀏覽器，選擇你的登入方式：
- GitHub
- GitLab  
- Email

#### 步驟 3：部署

```bash
cd /Users/alexho/Projects/SasayaByCursor1
vercel
```

按照提示操作：
1. Set up and deploy? → **Yes**
2. Which scope? → 選擇你的帳號
3. Link to existing project? → **No**
4. What's your project's name? → **sasaya-ai** (或自訂)
5. In which directory is your code located? → **./** (按 Enter)
6. Want to override the settings? → **No**

等待約 1-2 分鐘...

✅ **完成！** 你會看到：
```
✅ Production: https://sasaya-ai-xxxx.vercel.app
```

---

### 方法 2：通過 Vercel 網站

#### 步驟 1：推送到 GitHub（如果還沒有）

```bash
# 初始化 git（如果還沒有）
git init

# 添加所有檔案
git add .

# 提交
git commit -m "feat: add Vercel deployment support"

# 創建 GitHub repo 並推送
# 到 GitHub 創建新 repo，然後：
git remote add origin https://github.com/你的用戶名/sasaya-ai.git
git branch -M main
git push -u origin main
```

#### 步驟 2：連接 Vercel

1. 到 [vercel.com](https://vercel.com)
2. 點擊「Sign Up」或「Login」
3. 使用 GitHub 帳號登入
4. 點擊「New Project」
5. 選擇「Import Git Repository」
6. 找到你的 `sasaya-ai` repo
7. 點擊「Import」

#### 步驟 3：配置專案

- **Framework Preset**: Vite ✅ (自動偵測)
- **Root Directory**: ./
- **Build Command**: `npm run build` ✅ (自動設定)
- **Output Directory**: dist ✅ (自動設定)
- **Install Command**: `npm install` ✅ (自動設定)

不需要修改任何設定！直接點擊「Deploy」

#### 步驟 4：等待部署

約 1-2 分鐘後...

✅ **部署完成！**

你會看到：
- 🎉 恭喜畫面
- 🔗 你的網址：`https://sasaya-ai-xxxx.vercel.app`
- 📸 預覽截圖

---

## 🎨 已配置的功能

### ✅ 自動配置
- `vercel.json` - Vercel 部署配置
- `vite.config.js` - 支持 Electron 和 Web 雙模式
- SPA 路由支持（所有路徑指向 index.html）

### ✅ 保留所有功能
- 📝 筆記管理（完全相同）
- 🤖 AI 對話（完全相同）
- 📥 匯入 ChatGPT ZIP（完全相同）
- 💾 本地儲存（IndexedDB，完全相同）
- 🔍 搜尋功能（完全相同）

### ✅ 雙版本支持
- **Electron 版本**：`npm start` - 桌面應用
- **Web 版本**：部署到 Vercel - 網頁應用
- 兩者功能完全相同！

---

## 📱 分享給同事

部署完成後，你會獲得一個網址，例如：
```
https://sasaya-ai-abc123.vercel.app
```

### 🎯 如何分享

1. **直接分享網址**
   - 複製 Vercel 給你的網址
   - 傳給同事
   - 同事直接在瀏覽器打開

2. **無需安裝**
   - 不用下載 .dmg
   - 不用擔心 macOS 安全警告
   - 直接打開就能用

3. **跨平台**
   - ✅ macOS
   - ✅ Windows
   - ✅ Linux
   - ✅ 任何有瀏覽器的設備

---

## 🔄 更新部署

### 如果使用 Vercel CLI

每次更新後：
```bash
git add .
git commit -m "更新內容"
git push

# 部署新版本
vercel --prod
```

### 如果使用 GitHub + Vercel

Vercel 會**自動部署**！

每次你推送到 GitHub：
```bash
git add .
git commit -m "更新內容"
git push
```

Vercel 會自動：
1. 偵測到更新
2. 自動構建
3. 自動部署
4. 更新網址內容

**完全自動化！** 🎉

---

## 🎨 自訂網域（可選）

如果你有自己的網域（如 `sasaya.yourname.com`）：

1. 到 Vercel 專案設定
2. 點擊「Domains」
3. 輸入你的網域
4. 按照指示設定 DNS
5. 完成！

---

## 🧪 測試清單

部署後，請測試以下功能：

### ✅ 基本功能
- [ ] 應用程式能正常載入
- [ ] 三欄式佈局顯示正常
- [ ] Mock 資料正常載入

### ✅ 筆記管理
- [ ] 建立新筆記
- [ ] 編輯筆記內容
- [ ] 刪除筆記
- [ ] 移動筆記到不同分類
- [ ] 搜尋筆記

### ✅ AI 對話
- [ ] 打開 AI 面板
- [ ] 提問並獲得回答
- [ ] 顯示相關筆記
- [ ] 點擊相關筆記跳轉

### ✅ 匯入功能
- [ ] 點擊「匯入」按鈕
- [ ] 選擇 ZIP 檔案
- [ ] 成功匯入筆記
- [ ] 筆記正確分類

### ✅ 資料持久化
- [ ] 重新整理頁面
- [ ] 資料仍然保留
- [ ] 關閉瀏覽器再打開
- [ ] 資料仍然保留

---

## 🔧 環境變數（如果需要）

目前不需要設定環境變數。

如果未來需要（例如 OpenAI API key）：

1. 到 Vercel 專案設定
2. 點擊「Environment Variables」
3. 添加變數
4. 重新部署

---

## ⚠️ 注意事項

### 1. 資料儲存

**Web 版本**：
- 資料儲存在瀏覽器的 IndexedDB
- 每個瀏覽器獨立儲存
- 清除瀏覽器資料會刪除筆記
- 不同設備不同步

**如果需要雲端同步**：
- 需要實作後端 API
- 或使用 Firebase / Supabase

### 2. 檔案大小限制

- Vercel 免費版：最大 100MB 檔案
- 匯入的 ChatGPT ZIP 檔案通常 < 10MB
- 不會有問題

### 3. 免費額度

Vercel 免費版：
- ✅ 無限專案
- ✅ 100GB 頻寬/月
- ✅ 1000 次部署/月
- ✅ 適合 prototype 和個人專案

---

## 📊 部署資訊

| 項目 | 內容 |
|------|------|
| 平台 | Vercel |
| 框架 | Vite + React |
| 部署方式 | Git Push 自動部署 |
| HTTPS | ✅ 自動啟用 |
| CDN | ✅ 全球 CDN |
| 建置時間 | ~30 秒 |
| 冷啟動 | < 1 秒 |

---

## 🐛 問題排解

### Q1: 部署失敗

**檢查**：
```bash
# 本地構建是否成功
npm run build

# 檢查 node 版本
node -v  # 建議 v18+
```

### Q2: 404 錯誤

**確認**：
- `vercel.json` 存在
- rewrites 規則正確

### Q3: 白畫面

**檢查**：
- 瀏覽器 Console 是否有錯誤
- 確認 base path 設定正確

### Q4: 資料無法儲存

**確認**：
- 瀏覽器支援 IndexedDB
- 沒有開啟無痕模式
- 沒有禁用 Cookie

---

## 🎉 完成！

現在你有：
- ✅ Web 版本（Vercel）
- ✅ 桌面版本（Electron + .dmg）
- ✅ 兩者功能完全相同
- ✅ 可以分享給任何人

**兩種分享方式**：
1. **需要安裝**：分享 .dmg 文件（桌面應用）
2. **直接使用**：分享 Vercel 網址（Web 應用）

---

## 📞 下一步

1. ✅ 部署到 Vercel
2. ✅ 測試所有功能
3. ✅ 分享網址給同事
4. ✅ 收集反饋
5. ✅ 持續迭代

---

**部署愉快！** 🚀✨

如果遇到任何問題，歡迎隨時詢問！

