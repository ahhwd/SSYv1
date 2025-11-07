import React, { useState, useEffect, useRef } from 'react';
import { mockCategories, mockNotes } from './data/mockData';
import { parseChatGPTZip, convertConversationsToNotes, autoCategorizNotes } from './utils/importParser';
import { saveNotes, loadNotes, saveCategories, loadCategories, updateNote as updateNoteInStorage } from './utils/storage';
import { generateMockResponse, simulateThinking, getWelcomeMessage } from './utils/mockAI';

function App() {
  const [categories, setCategories] = useState(mockCategories);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [editingContent, setEditingContent] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const fileInputRef = useRef(null);
  const aiContentRef = useRef(null);

  // 載入資料
  useEffect(() => {
    async function loadData() {
      const savedNotes = await loadNotes();
      const savedCategories = await loadCategories();
      
      if (savedNotes && savedNotes.length > 0) {
        setNotes(savedNotes);
        setSelectedNote(savedNotes[0]);
      } else {
        // 使用 mock data
        setNotes(mockNotes);
        setSelectedNote(mockNotes[0]);
        await saveNotes(mockNotes);
      }
      
      if (savedCategories) {
        setCategories(savedCategories);
      } else {
        await saveCategories(mockCategories);
      }
      
      // 初始化 AI 歡迎訊息
      setAiMessages([{
        id: 'welcome',
        type: 'ai',
        content: getWelcomeMessage(),
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
    
    loadData();
  }, []);

  // 儲存筆記變更
  useEffect(() => {
    if (notes.length > 0) {
      saveNotes(notes);
    }
  }, [notes]);

  // 儲存分類變更
  useEffect(() => {
    if (categories.length > 0) {
      saveCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (selectedNote) {
      setEditingContent(selectedNote.content);
      setEditingTitle(selectedNote.title);
    }
  }, [selectedNote]);

  const toggleCategory = (categoryId) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
    ));
  };

  const selectNote = (note) => {
    setSelectedNote(note);
  };

  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const updateNoteContent = (content) => {
    setEditingContent(content);
    if (selectedNote) {
      setNotes(notes.map(note =>
        note.id === selectedNote.id ? { ...note, content } : note
      ));
    }
  };

  const updateNoteTitle = (title) => {
    setEditingTitle(title);
    if (selectedNote) {
      setNotes(notes.map(note =>
        note.id === selectedNote.id ? { ...note, title } : note
      ));
      setSelectedNote({ ...selectedNote, title });
    }
  };

  // 建立新筆記
  const handleCreateNote = () => {
    const now = new Date();
    const newNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: '未命名筆記',
      content: '',
      categoryId: 'cat_uncategorized',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timestamp: now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setSelectedNote(newNote);
    
    // 展開未分類分類（如果未展開）
    setCategories(categories.map(cat =>
      cat.id === 'cat_uncategorized' ? { ...cat, isExpanded: true } : cat
    ));
  };

  // 移動筆記到不同分類
  const moveNoteToCategory = (noteId, newCategoryId) => {
    setNotes(notes.map(note =>
      note.id === noteId ? { ...note, categoryId: newCategoryId, updatedAt: new Date().toISOString() } : note
    ));
    
    // 如果是當前選中的筆記，更新它
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote({ ...selectedNote, categoryId: newCategoryId });
    }
  };

  // 刪除筆記
  const handleDeleteNote = (noteId) => {
    if (window.confirm('確定要刪除這個筆記嗎？')) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      
      // 如果刪除的是當前選中的筆記，清除選擇
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
      }
    }
  };

  // 搜尋相關筆記
  const searchRelevantNotes = (query) => {
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(word => word.length > 1);
    
    // 計算每個筆記的相關度分數
    const scoredNotes = notes.map(note => {
      let score = 0;
      const lowerTitle = note.title.toLowerCase();
      const lowerContent = note.content.toLowerCase();
      
      // 標題匹配權重更高
      queryWords.forEach(word => {
        if (lowerTitle.includes(word)) score += 3;
        if (lowerContent.includes(word)) score += 1;
      });
      
      // 完整問句匹配
      if (lowerTitle.includes(lowerQuery)) score += 5;
      if (lowerContent.includes(lowerQuery)) score += 2;
      
      return { ...note, score };
    });
    
    // 返回相關度最高的前 5 個筆記
    return scoredNotes
      .filter(note => note.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(note => ({
        ...note,
        categoryName: categories.find(cat => cat.id === note.categoryId)?.name || '未分類'
      }));
  };

  // 處理 AI 提問
  const handleAISubmit = async () => {
    if (!aiInput.trim() || isAiThinking) return;
    
    const userQuestion = aiInput.trim();
    setAiInput('');
    
    // 添加用戶訊息
    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: userQuestion,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    setIsAiThinking(true);
    
    try {
      // 搜尋相關筆記
      const relevantNotes = searchRelevantNotes(userQuestion);
      
      // 模擬思考延遲
      await simulateThinking(1500);
      
      // 生成 AI 回答
      const aiResponse = generateMockResponse(userQuestion, relevantNotes);
      
      // 添加 AI 回答訊息
      const aiMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        relevantNotes: relevantNotes.slice(0, 3), // 顯示前 3 個相關筆記
      };
      
      setAiMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('AI 回答錯誤:', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: '抱歉，我在處理你的問題時遇到了錯誤。請稍後再試。',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      };
      setAiMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // 處理輸入框按鍵
  const handleAIKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAISubmit();
    }
  };

  // 點擊相關筆記
  const handleRelevantNoteClick = (note) => {
    setSelectedNote(note);
    // 展開該筆記所屬的分類
    setCategories(categories.map(cat =>
      cat.id === note.categoryId ? { ...cat, isExpanded: true } : cat
    ));
  };

  // 自動滾動到最新訊息
  useEffect(() => {
    if (aiContentRef.current) {
      aiContentRef.current.scrollTop = aiContentRef.current.scrollHeight;
    }
  }, [aiMessages]);

  // 匯入 ChatGPT ZIP 檔案
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress({ stage: '正在讀取檔案...', current: 0, total: 0 });

    try {
      // 解析 ZIP 檔案
      setImportProgress({ stage: '正在解析 ZIP 檔案...', current: 0, total: 0 });
      const conversations = await parseChatGPTZip(file);
      
      // 轉換為筆記
      setImportProgress({ stage: '正在轉換對話...', current: 0, total: conversations.length });
      const newNotes = convertConversationsToNotes(conversations);
      
      // 自動分類
      setImportProgress({ stage: '正在分類筆記...', current: 0, total: newNotes.length });
      const categorizedNotes = autoCategorizNotes(newNotes);
      
      // 合併到現有筆記
      const updatedNotes = [...notes, ...categorizedNotes];
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      
      // 顯示統計資訊
      setImportProgress({
        stage: '完成！',
        current: categorizedNotes.length,
        total: conversations.length,
        success: true,
        message: `成功匯入 ${conversations.length} 個對話，建立了 ${categorizedNotes.length} 個筆記`,
      });
      
      // 3 秒後關閉進度提示
      setTimeout(() => {
        setImportProgress(null);
        setIsImporting(false);
      }, 3000);
      
      // 選擇第一個新匯入的筆記
      if (categorizedNotes.length > 0) {
        setSelectedNote(categorizedNotes[0]);
      }
      
    } catch (error) {
      console.error('匯入失敗:', error);
      setImportProgress({
        stage: '匯入失敗',
        error: true,
        message: error.message || '無法解析檔案，請確認這是 ChatGPT 匯出的 .zip 檔案',
      });
      
      setTimeout(() => {
        setImportProgress(null);
        setIsImporting(false);
      }, 5000);
    }
    
    // 清除 file input
    event.target.value = '';
  };

  const filteredNotes = searchTerm
    ? notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : notes;

  const getNotesForCategory = (categoryId) => {
    return filteredNotes.filter(note => note.categoryId === categoryId);
  };

  return (
    <div className="app">
      {/* 隱藏的檔案選擇器 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      
      {/* 匯入進度提示 */}
      {importProgress && (
        <div className="import-overlay">
          <div className="import-modal">
            <div className="import-icon">
              {importProgress.success ? '✅' : importProgress.error ? '❌' : '⏳'}
            </div>
            <h3>{importProgress.stage}</h3>
            {importProgress.message && (
              <p className="import-message">{importProgress.message}</p>
            )}
            {!importProgress.success && !importProgress.error && importProgress.total > 0 && (
              <div className="import-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {importProgress.current} / {importProgress.total}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span style={{ fontSize: '12px', color: '#707070' }}>Integrations</span>
        </div>
        <div className="top-bar-center">
          <input
            type="text"
            className="search-box"
            placeholder="搜尋 / 提問 / 整理  ⌘P"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="top-bar-right">
          <button className="top-bar-btn">Note</button>
          <button 
            className={`top-bar-btn ${showAIPanel ? 'active' : ''}`}
            onClick={() => setShowAIPanel(!showAIPanel)}
          >
            Ask
          </button>
          <button className="top-bar-btn">Split</button>
          <button className="top-bar-btn">Organize</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <button 
              className="sidebar-btn"
              onClick={handleCreateNote}
            >
              ➕ 新增
            </button>
            <button 
              className="sidebar-btn"
              onClick={handleImportClick}
              disabled={isImporting}
            >
              {isImporting ? '⏳ 匯入中...' : '⬇️ 匯入'}
            </button>
          </div>

          <div className="categories-list">
            {categories.map((category) => (
              <div key={category.id}>
                <div
                  className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => {
                    toggleCategory(category.id);
                    selectCategory(category.id);
                  }}
                >
                  <span className="category-expand">
                    {getNotesForCategory(category.id).length > 0 ? '▶' : ''}
                  </span>
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </div>

                {category.isExpanded && (
                  <div className="notes-list">
                    {getNotesForCategory(category.id).map((note) => (
                      <div
                        key={note.id}
                        className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
                        onClick={() => selectNote(note)}
                      >
                        <span className="note-title">{note.title}</span>
                        <span className="note-time">{note.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="editor-area">
          {selectedNote ? (
            <>
              <div className="editor-toolbar">
                <button 
                  className="toolbar-btn" 
                  title="刪除"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                >
                  🗑️
                </button>
                <div className="toolbar-divider"></div>
                <button className="toolbar-btn" title="粗體"><strong>B</strong></button>
                <button className="toolbar-btn" title="斜體"><em>I</em></button>
                <button className="toolbar-btn" title="底線"><u>U</u></button>
                <button className="toolbar-btn" title="刪除線"><s>S</s></button>
                <button className="toolbar-btn" title="程式碼">{'</>'}</button>
                <button className="toolbar-btn" title="字體">Aa</button>
                <div className="toolbar-divider"></div>
                <select 
                  className="category-selector"
                  value={selectedNote.categoryId}
                  onChange={(e) => moveNoteToCategory(selectedNote.id, e.target.value)}
                  title="移動到分類"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="editor-content">
                <input
                  type="text"
                  className="editor-title"
                  value={editingTitle}
                  onChange={(e) => updateNoteTitle(e.target.value)}
                  placeholder="筆記標題"
                />
                <textarea
                  className="editor-body"
                  value={editingContent}
                  onChange={(e) => updateNoteContent(e.target.value)}
                  placeholder="開始寫作..."
                />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-title">選擇一個筆記開始編輯</div>
              <div className="empty-state-text">
                從左側選擇一個筆記，或點擊「新增」按鈕建立新筆記
              </div>
            </div>
          )}
        </div>

        {/* AI Chat Panel */}
        {showAIPanel && (
          <div className="ai-panel">
            <div className="ai-header">
              <div className="ai-title">
                <div className="ai-icon">💜</div>
                <div className="ai-title-text">
                  <h3>Sasaya AI</h3>
                  <p>您的智能知識助手</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowAIPanel(false)}>
                ✕
              </button>
            </div>

            <div className="ai-content" ref={aiContentRef}>
              {aiMessages.map((message) => (
                <div key={message.id} className={`ai-message ${message.type}`}>
                  <div className="message-content">
                    {message.content.split('\n').map((line, idx) => {
                      // 處理標題
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <strong key={idx}>{line.replace(/\*\*/g, '')}</strong>;
                      }
                      // 處理列表
                      if (line.startsWith('• ') || line.startsWith('- ')) {
                        return <li key={idx}>{line.substring(2)}</li>;
                      }
                      // 處理數字列表
                      if (line.match(/^\d+\.\s/)) {
                        return <li key={idx}>{line.substring(line.indexOf('.') + 2)}</li>;
                      }
                      // 一般文字
                      return line ? <p key={idx}>{line}</p> : <br key={idx} />;
                    })}
                  </div>
                  
                  {/* 顯示相關筆記 */}
                  {message.relevantNotes && message.relevantNotes.length > 0 && (
                    <div className="relevant-notes">
                      <div className="relevant-notes-title">📎 相關筆記</div>
                      {message.relevantNotes.map((note) => (
                        <div 
                          key={note.id} 
                          className="relevant-note-item"
                          onClick={() => handleRelevantNoteClick(note)}
                        >
                          <div className="relevant-note-title">{note.title}</div>
                          <div className="relevant-note-category">{note.categoryName}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="message-timestamp">{message.timestamp}</div>
                </div>
              ))}
              
              {/* AI 思考中 */}
              {isAiThinking && (
                <div className="ai-message ai thinking">
                  <div className="thinking-indicator">
                    <span className="thinking-dot"></span>
                    <span className="thinking-dot"></span>
                    <span className="thinking-dot"></span>
                  </div>
                  <div className="message-timestamp">思考中...</div>
                </div>
              )}
            </div>

            <div className="ai-input-area">
              <div className="scope-selector">
                <label>搜尋範圍</label>
                <select>
                  <option>📚 所有筆記 ({notes.length})</option>
                  <option>📁 此資料夾</option>
                  <option>📄 此筆記</option>
                </select>
              </div>
              <div className="input-box">
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={handleAIKeyPress}
                  placeholder="詢問任何問題..."
                  rows="1"
                  disabled={isAiThinking}
                />
                <button 
                  className="send-btn"
                  onClick={handleAISubmit}
                  disabled={!aiInput.trim() || isAiThinking}
                >
                  {isAiThinking ? '⏳' : '📤'}
                </button>
              </div>
              <div className="input-hint">
                按 Enter 發送，Shift + Enter 換行
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

