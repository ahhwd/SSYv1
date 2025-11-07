import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 導入翻譯文件
import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';

// 從 localStorage 獲取已保存的語言，或使用預設語言（英文）
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-TW': { translation: zhTW },
    },
    lng: savedLanguage, // 預設語言
    fallbackLng: 'en', // 備用語言
    interpolation: {
      escapeValue: false, // React 已經處理了 XSS
    },
  });

export default i18n;

