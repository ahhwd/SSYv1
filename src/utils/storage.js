import localforage from 'localforage';

// 設定 localforage
localforage.config({
  name: 'SasayaAI',
  storeName: 'sasaya_data',
  description: 'Sasaya AI 本地資料儲存',
});

const NOTES_KEY = 'sasaya_notes';
const CATEGORIES_KEY = 'sasaya_categories';

/**
 * 儲存筆記到本地
 * @param {Array} notes - 筆記陣列
 */
export async function saveNotes(notes) {
  try {
    await localforage.setItem(NOTES_KEY, notes);
    return true;
  } catch (error) {
    console.error('儲存筆記時發生錯誤:', error);
    return false;
  }
}

/**
 * 從本地載入筆記
 * @returns {Promise<Array>} 筆記陣列
 */
export async function loadNotes() {
  try {
    const notes = await localforage.getItem(NOTES_KEY);
    return notes || [];
  } catch (error) {
    console.error('載入筆記時發生錯誤:', error);
    return [];
  }
}

/**
 * 儲存分類到本地
 * @param {Array} categories - 分類陣列
 */
export async function saveCategories(categories) {
  try {
    await localforage.setItem(CATEGORIES_KEY, categories);
    return true;
  } catch (error) {
    console.error('儲存分類時發生錯誤:', error);
    return false;
  }
}

/**
 * 從本地載入分類
 * @returns {Promise<Array>} 分類陣列
 */
export async function loadCategories() {
  try {
    const categories = await localforage.getItem(CATEGORIES_KEY);
    return categories || null;
  } catch (error) {
    console.error('載入分類時發生錯誤:', error);
    return null;
  }
}

/**
 * 新增單一筆記
 * @param {Object} note - 筆記物件
 */
export async function addNote(note) {
  try {
    const notes = await loadNotes();
    notes.push(note);
    await saveNotes(notes);
    return true;
  } catch (error) {
    console.error('新增筆記時發生錯誤:', error);
    return false;
  }
}

/**
 * 更新單一筆記
 * @param {Object} updatedNote - 更新後的筆記物件
 */
export async function updateNote(updatedNote) {
  try {
    const notes = await loadNotes();
    const index = notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updatedNote, updatedAt: new Date().toISOString() };
      await saveNotes(notes);
      return true;
    }
    return false;
  } catch (error) {
    console.error('更新筆記時發生錯誤:', error);
    return false;
  }
}

/**
 * 刪除單一筆記
 * @param {string} noteId - 筆記 ID
 */
export async function deleteNote(noteId) {
  try {
    const notes = await loadNotes();
    const filtered = notes.filter(note => note.id !== noteId);
    await saveNotes(filtered);
    return true;
  } catch (error) {
    console.error('刪除筆記時發生錯誤:', error);
    return false;
  }
}

/**
 * 清除所有資料
 */
export async function clearAllData() {
  try {
    await localforage.clear();
    return true;
  } catch (error) {
    console.error('清除資料時發生錯誤:', error);
    return false;
  }
}


