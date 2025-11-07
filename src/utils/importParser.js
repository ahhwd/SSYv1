import JSZip from 'jszip';

/**
 * 解析 ChatGPT 匯出的 ZIP 檔案
 * @param {File} file - 上傳的 ZIP 檔案
 * @returns {Promise<Array>} 解析後的對話陣列
 */
export async function parseChatGPTZip(file) {
  try {
    console.log('開始解析 ZIP 檔案:', file.name, 'size:', file.size);
    
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    
    console.log('ZIP 檔案解析成功，內容:', Object.keys(zipContent.files));
    
    // 尋找 conversations.json 檔案
    const conversationsFile = zipContent.file('conversations.json');
    if (!conversationsFile) {
      console.error('找不到 conversations.json，ZIP 內容:', Object.keys(zipContent.files));
      throw new Error('找不到 conversations.json 檔案');
    }
    
    console.log('找到 conversations.json，開始讀取...');
    
    // 讀取並解析 JSON
    const conversationsText = await conversationsFile.async('text');
    console.log('conversations.json 文字長度:', conversationsText.length);
    
    const conversations = JSON.parse(conversationsText);
    console.log('成功解析，對話數量:', conversations.length);
    
    return conversations;
  } catch (error) {
    console.error('解析 ZIP 檔案時發生錯誤:', error);
    console.error('錯誤堆疊:', error.stack);
    throw new Error(`無法解析檔案：${error.message}`);
  }
}

/**
 * 從對話的 mapping 中提取訊息
 * @param {Object} mapping - ChatGPT 的訊息 mapping 物件
 * @returns {Array} 排序後的訊息陣列
 */
function extractMessages(mapping) {
  const messages = [];
  
  // 遍歷 mapping 中的每個節點
  for (const nodeId in mapping) {
    const node = mapping[nodeId];
    
    // 跳過沒有訊息或是系統訊息的節點
    if (!node.message || !node.message.author) {
      continue;
    }
    
    const message = node.message;
    const role = message.author.role;
    
    // 只保留 user 和 assistant 的訊息
    if (role === 'user' || role === 'assistant') {
      // 確保 content 永遠是字串
      let content = '';
      
      if (message.content?.parts?.[0]) {
        const part = message.content.parts[0];
        // 如果是字串，直接使用；如果不是，轉換為 JSON 字串
        content = typeof part === 'string' ? part : JSON.stringify(part);
      }
      
      // 跳過空訊息
      if (content && content.trim()) {
        messages.push({
          role,
          content,
          createTime: message.create_time,
        });
      }
    }
  }
  
  // 按照創建時間排序
  messages.sort((a, b) => (a.createTime || 0) - (b.createTime || 0));
  
  return messages;
}

/**
 * 將 ChatGPT 對話轉換為 Markdown 格式的筆記
 * @param {Object} conversation - ChatGPT 對話物件
 * @returns {Object} 筆記物件
 */
export function convertConversationToNote(conversation) {
  // 確保 conversation 有必要的屬性
  if (!conversation || !conversation.mapping) {
    console.warn('對話物件無效:', conversation);
    return null;
  }
  
  const messages = extractMessages(conversation.mapping);
  
  // 確保標題是字串
  const title = typeof conversation.title === 'string' ? conversation.title : '未命名對話';
  
  // 建立 Markdown 內容
  let markdownContent = `# ${title}\n\n`;
  
  messages.forEach((message, index) => {
    if (message.role === 'user') {
      markdownContent += `## 問題 ${Math.floor(index / 2) + 1}\n\n`;
      markdownContent += `${message.content}\n\n`;
    } else if (message.role === 'assistant') {
      markdownContent += `### 回答\n\n`;
      markdownContent += `${message.content}\n\n`;
      markdownContent += `---\n\n`;
    }
  });
  
  // 生成筆記物件
  const createDate = new Date((conversation.create_time || Date.now() / 1000) * 1000);
  const updateDate = new Date((conversation.update_time || conversation.create_time || Date.now() / 1000) * 1000);
  
  return {
    id: `note_${conversation.id || Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: title,
    content: markdownContent,
    categoryId: 'cat_uncategorized', // 預設放在未分類
    createdAt: createDate.toISOString(),
    updatedAt: updateDate.toISOString(),
    timestamp: createDate.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    sourceChatId: conversation.id,
    messageCount: messages.length,
  };
}

/**
 * 批次轉換多個對話
 * @param {Array} conversations - ChatGPT 對話陣列
 * @returns {Array} 筆記陣列
 */
export function convertConversationsToNotes(conversations) {
  if (!Array.isArray(conversations)) {
    console.error('conversations 不是陣列:', conversations);
    return [];
  }
  
  return conversations
    .map(conv => convertConversationToNote(conv))
    .filter(note => note !== null); // 過濾掉無效的筆記
}

/**
 * 簡單的關鍵字分類器（MVP 版本）
 * 根據筆記內容的關鍵字決定分類
 * @param {Object} note - 筆記物件
 * @returns {string} 分類 ID
 */
export function categorizeNote(note) {
  const content = (note.title + ' ' + note.content).toLowerCase();
  
  // 關鍵字對應分類
  const categoryKeywords = {
    'cat_ai': ['ai', 'gpt', 'chatgpt', '人工智慧', '機器學習', 'machine learning', 'deep learning', '神經網路'],
    'cat_development': ['程式', '開發', 'code', 'programming', 'javascript', 'python', 'react', '前端', '後端', 'api'],
    'cat_product': ['產品', 'product', 'pm', 'prd', '需求', '功能', 'feature', 'user story'],
    'cat_business': ['創業', '商業', 'business', 'startup', '新創', '營運', '商業模式'],
    'cat_finance': ['投資', '理財', '金融', 'investment', '股票', '基金', '財務'],
    'cat_personal': ['成長', '習慣', '自我', 'personal', '目標', '學習', '思考'],
    'cat_health': ['健康', '運動', '健身', 'health', 'fitness', '飲食'],
    'cat_language': ['語言', '翻譯', '英文', '日文', 'language', 'translation'],
    'cat_japan': ['日本', 'japan', '東京', '京都'],
    'cat_work': ['工作', '職涯', 'career', '面試', '履歷'],
  };
  
  // 計算每個分類的匹配分數
  let bestCategory = 'cat_uncategorized';
  let maxScore = 0;
  
  for (const [categoryId, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        score++;
      }
    });
    
    if (score > maxScore) {
      maxScore = score;
      bestCategory = categoryId;
    }
  }
  
  return bestCategory;
}

/**
 * 自動分類筆記
 * @param {Array} notes - 筆記陣列
 * @returns {Array} 包含分類的筆記陣列
 */
export function autoCategorizNotes(notes) {
  return notes.map(note => ({
    ...note,
    categoryId: categorizeNote(note),
  }));
}


