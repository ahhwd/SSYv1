# 📦 Sasaya AI 打包指南

## 🎯 目標

將 Sasaya AI 打包成 `.dmg` 文件，供 macOS 用戶安裝使用。

---

## ⚡ 快速打包（推薦）

### 一鍵打包命令

```bash
npm run package:mac
```

這個命令會：
1. ✅ 構建 React 應用（`npm run build`）
2. ✅ 打包 Electron 應用
3. ✅ 生成 `.dmg` 安裝文件

---

## 📋 詳細步驟

### 步驟 1：確保專案已準備好

```bash
# 確認在專案目錄
cd /Users/alexho/Projects/SasayaByCursor1

# 確認依賴已安裝
npm install
```

### 步驟 2：執行打包

```bash
npm run package:mac
```

### 步驟 3：等待打包完成

打包過程約需 **2-5 分鐘**，你會看到：

```
Building...
Packaging app...
Creating DMG...
```

### 步驟 4：找到打包好的文件

打包完成後，文件位於：

```
/Users/alexho/Projects/SasayaByCursor1/release/
```

你會看到：
- `Sasaya AI-1.0.0.dmg` - **這就是要分享的文件！**
- `Sasaya AI-1.0.0-mac.zip` - 壓縮版本（可選）

---

## 📤 分享給同事

### 方法 1：直接傳送 .dmg 文件

1. 找到 `release/Sasaya AI-1.0.0.dmg`
2. 通過以下方式分享：
   - 📧 Email 附件
   - 💬 Slack / Teams
   - ☁️ Google Drive / Dropbox
   - 🔗 AirDrop（如果同事在附近）

### 方法 2：使用雲端分享連結

```bash
# 上傳到 Google Drive / Dropbox
# 然後分享下載連結給同事
```

---

## 🖥️ 同事的安裝步驟

### 1. 下載 .dmg 文件

### 2. 雙擊打開 .dmg

會看到一個視窗：
```
[Sasaya AI 圖示]  →  [應用程式資料夾]
```

### 3. 拖曳到應用程式資料夾

將 `Sasaya AI` 圖示拖到右邊的「應用程式」資料夾

### 4. 打開應用程式

- 方法 A：到「應用程式」資料夾中找到 `Sasaya AI`，雙擊打開
- 方法 B：使用 Spotlight（⌘ + Space），輸入 "Sasaya"

### 5. 首次打開的安全提示

macOS 可能會顯示：
> "無法打開「Sasaya AI」，因為它來自未識別的開發者"

**解決方法**：
1. 到「系統偏好設定」→「隱私權與安全性」
2. 找到 "無法打開 Sasaya AI" 的提示
3. 點擊「仍要打開」
4. 確認打開

或者：
1. 右鍵點擊 `Sasaya AI`
2. 選擇「打開」
3. 在提示中點擊「打開」

---

## 🔧 打包配置說明

### package.json 配置

```json
{
  "build": {
    "appId": "com.sasaya.ai",
    "productName": "Sasaya AI",
    "mac": {
      "category": "public.app-category.productivity",
      "target": ["dmg"]
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "package.json"
    ],
    "directories": {
      "output": "release"
    }
  }
}
```

### 說明：
- `appId`: 應用程式唯一識別碼
- `productName`: 顯示在 Finder 中的名稱
- `target`: 打包格式（dmg）
- `output`: 輸出目錄（release）

---

## 📝 打包前檢查清單

- [ ] 已執行 `npm install`
- [ ] 應用程式在開發模式正常運行（`npm start`）
- [ ] 沒有 linter 錯誤
- [ ] 所有功能測試通過
- [ ] 關閉開發模式（如果正在運行）

---

## ⚠️ 常見問題

### Q1: 打包失敗，顯示 "Cannot find module"

**解決**：
```bash
npm install
npm run build
npm run package:mac
```

### Q2: 打包後文件太大

**說明**：
- 正常大小約 **150-300 MB**
- 包含了 Electron、React、所有依賴
- 這是正常的桌面應用大小

### Q3: 同事無法打開，顯示安全警告

**說明**：
- 這是正常的 macOS 安全機制
- 因為應用程式沒有 Apple 開發者簽名
- 按照上述「首次打開的安全提示」解決

### Q4: 想要添加應用程式圖示

**步驟**：
1. 準備 1024x1024 的 PNG 圖示
2. 轉換為 `.icns` 格式（使用線上工具）
3. 放到 `build/icon.icns`
4. 重新打包

### Q5: 打包時顯示 icon 警告

**說明**：
- 如果沒有 `build/icon.icns`，會使用預設圖示
- 不影響功能，只是圖示會是 Electron 預設的
- 可以忽略這個警告

---

## 🚀 進階：自動化打包腳本

可以創建一個簡單的打包腳本：

```bash
#!/bin/bash
# build.sh

echo "🚀 開始打包 Sasaya AI..."

# 清理舊的 build
rm -rf dist release

# 安裝依賴
echo "📦 安裝依賴..."
npm install

# 構建
echo "🏗️ 構建應用..."
npm run build

# 打包
echo "📦 打包應用..."
npm run package:mac

echo "✅ 打包完成！"
echo "📂 檔案位置: release/Sasaya AI-1.0.0.dmg"
```

使用方法：
```bash
chmod +x build.sh
./build.sh
```

---

## 📊 打包後的文件結構

```
release/
├── Sasaya AI-1.0.0.dmg          # macOS 安裝檔（主要分享文件）
├── Sasaya AI-1.0.0-mac.zip      # 壓縮版本
└── mac/
    └── Sasaya AI.app            # 應用程式本體
```

---

## 🎉 完成！

現在你有：
- ✅ `Sasaya AI-1.0.0.dmg` - 可分享的安裝檔
- ✅ 完整的打包流程
- ✅ 給同事的安裝說明

**下一步**：
1. 測試打包後的 `.dmg` 文件
2. 分享給同事
3. 收集反饋

---

## 📞 支援

如果同事遇到問題：
1. 檢查 macOS 版本（建議 macOS 11+）
2. 確認有足夠硬碟空間
3. 嘗試重新下載 `.dmg` 文件
4. 查看系統日誌（Console.app）

---

**打包愉快！** 🚀✨

