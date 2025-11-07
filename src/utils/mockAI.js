/**
 * Mock AI 回應生成器（Demo 版本）
 * 用於展示 AI 對話功能，不真正呼叫 API
 */

import i18n from '../i18n/config';

/**
 * 根據問題生成 Mock 回答
 * @param {string} question - 用戶問題
 * @param {Array} relevantNotes - 相關筆記
 * @returns {string} Mock AI 回答
 */
export function generateMockResponse(question, relevantNotes) {
  const lowerQuestion = question.toLowerCase();
  
  // 如果沒有相關筆記
  if (relevantNotes.length === 0) {
    return `很抱歉，我在你的筆記中找不到與「${question}」相關的內容。

建議：
1. 嘗試使用不同的關鍵字
2. 匯入更多相關的 ChatGPT 對話記錄
3. 建立新筆記來記錄相關資訊`;
  }
  
  // 根據問題類型生成不同的回答
  let response = '';
  
  // 問「是什麼」類型
  if (lowerQuestion.includes('是什麼') || lowerQuestion.includes('what is')) {
    response = `根據你的筆記，我找到了 ${relevantNotes.length} 則相關內容。讓我為你總結：

${generateSummary(relevantNotes)}

**詳細說明：**
${generateDetailedExplanation(relevantNotes[0])}

這些資訊來自你在「${relevantNotes[0].categoryName || '未分類'}」分類中的筆記。`;
  }
  // 問「如何」類型
  else if (lowerQuestion.includes('如何') || lowerQuestion.includes('怎麼') || lowerQuestion.includes('how')) {
    response = `根據你過去的思考和記錄，我找到了以下相關的方法和步驟：

${generateHowToSteps(relevantNotes)}

**關鍵要點：**
${generateKeyPoints(relevantNotes)}

這些內容整理自你的 ${relevantNotes.length} 則相關筆記。`;
  }
  // 問「為什麼」類型
  else if (lowerQuestion.includes('為什麼') || lowerQuestion.includes('為何') || lowerQuestion.includes('why')) {
    response = `基於你的筆記內容，我可以提供以下分析：

**主要原因：**
${generateReasons(relevantNotes)}

**相關脈絡：**
${generateContext(relevantNotes[0])}

這個答案參考了你在「${relevantNotes[0].title}」等筆記中的思考。`;
  }
  // 一般問題
  else {
    response = `根據你的筆記庫，我找到了 ${relevantNotes.length} 則與「${question}」相關的內容：

${generateGeneralResponse(relevantNotes)}

**關聯筆記：**
${relevantNotes.slice(0, 3).map((note, idx) => `${idx + 1}. ${note.title}`).join('\n')}

你可以點擊這些筆記查看完整內容。`;
  }
  
  return response;
}

/**
 * 生成摘要
 */
function generateSummary(notes) {
  const firstNote = notes[0];
  const preview = firstNote.content.substring(0, 200).replace(/#+/g, '').trim();
  return `「${preview}...」`;
}

/**
 * 生成詳細說明
 */
function generateDetailedExplanation(note) {
  const lines = note.content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const relevantLines = lines.slice(0, 3);
  return relevantLines.join('\n\n') || '詳細內容請參考筆記。';
}

/**
 * 生成操作步驟
 */
function generateHowToSteps(notes) {
  return `1. 首先，根據你的記錄，需要理解核心概念
2. 接著，實際動手嘗試並記錄過程
3. 然後，根據結果調整方法
4. 最後，總結經驗並持續改進

（這些步驟是基於你過去的學習模式整理而成）`;
}

/**
 * 生成關鍵要點
 */
function generateKeyPoints(notes) {
  return `• 重視實踐和經驗累積
• 保持持續學習的態度  
• 記錄過程以便回顧
• 連結不同領域的知識`;
}

/**
 * 生成原因分析
 */
function generateReasons(notes) {
  return `1. 從你的筆記中可以看出，這個問題涉及多個層面的考量
2. 你之前的思考記錄顯示，背後有深層的邏輯關聯
3. 根據相關筆記的脈絡，這是一個值得深入探討的話題`;
}

/**
 * 生成脈絡說明
 */
function generateContext(note) {
  return `在「${note.title}」這則筆記中，你記錄了相關的思考過程。這些內容可以幫助你更深入理解這個問題。`;
}

/**
 * 生成一般回應
 */
function generateGeneralResponse(notes) {
  const firstNote = notes[0];
  const preview = firstNote.content.substring(0, 300).replace(/#+/g, '').trim();
  
  return `${preview}...

**我的分析：**
基於這些筆記，我注意到你對這個主題有持續的關注和思考。你可以進一步探索相關筆記中的連結和想法。`;
}

/**
 * 模擬 AI 思考延遲
 * @param {number} ms - 延遲毫秒數
 */
export function simulateThinking(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 生成友善的歡迎訊息
 */
export function getWelcomeMessage() {
  return i18n.t('ai.welcome');
}

