import React from 'react';

interface MinimalHeaderProps {
  language: 'en' | 'ru';
  setLanguage: (lang: 'en' | 'ru') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onReset?: () => void;
  onShowHistory?: () => void;
  onShuffle?: () => void;
  onFinishAttempt?: () => void;
  disableFinish?: boolean;
  isLearnMode?: boolean;
  onToggleMode?: () => void;
}

const MinimalHeader: React.FC<MinimalHeaderProps> = ({ language, setLanguage, darkMode, setDarkMode, onReset, onShowHistory, onShuffle, onFinishAttempt, disableFinish, isLearnMode = false, onToggleMode }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-sm px-4 py-2">
      <div className="flex flex-row items-center justify-between gap-2 w-full">
        <h1 className="text-xl sm:text-2xl font-bold select-none flex items-center gap-2">
          <a
            href="https://smartbee.me"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent hover:underline transition-colors"
            title="Go to smartbee.me"
            style={{ cursor: 'pointer' }}
          >
            Dreamy Quiz
          </a>
        </h1>
        <div className="flex items-center gap-2">
          {/* Переключатель режимов Квиз/Учеба */}
          {onToggleMode && (
            <button
              onClick={onToggleMode}
              className={`p-3 rounded-xl flex items-center ${isLearnMode ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white hover:scale-105 transition-all duration-200 shadow-md mr-2`}
              title={isLearnMode 
                ? (language === 'en' ? 'Switch to Quiz Mode' : 'Переключиться в режим тестирования') 
                : (language === 'en' ? 'Switch to Learn Mode' : 'Переключиться в режим обучения')
              }
            >
              <span className="font-bold mr-2 text-sm">
                {isLearnMode 
                  ? (language === 'en' ? 'Quiz' : 'Тест') 
                  : (language === 'en' ? 'Learn' : 'Учеба')}
              </span>
              {isLearnMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
            </button>
          )}
          
          {/* Переключатель языка */}
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 mr-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                language === 'en' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-label="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                language === 'ru' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-label="Russian"
            >
              RU
            </button>
          </div>
          
          {/* Иконка Shuffle */}
          {onShuffle && (
            <button
              onClick={onShuffle}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              title={language === 'en' ? 'Shuffle Questions' : 'Перемешать вопросы'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356-2A9 9 0 106.097 19.423M20 9V4h-5" />
              </svg>
            </button>
          )}
          {/* Иконка History */}
          {onShowHistory && (
            <button
              onClick={onShowHistory}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              title={language === 'en' ? 'History' : 'История'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          {/* Иконка Finish Attempt - скрываем в режиме обучения */}
          {onFinishAttempt && !isLearnMode && (
            <button
              onClick={onFinishAttempt}
              className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-white flex items-center justify-center transition-all duration-200 disabled:opacity-50"
              disabled={disableFinish}
              title={language === 'en' ? 'Finish Attempt' : 'Завершить попытку'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v.01" />
              </svg>
            </button>
          )}
          {onReset && (
            <button
              onClick={onReset}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              aria-label={language === 'en' ? 'Start Over' : 'Начать заново'}
              title={language === 'en' ? 'Start Over' : 'Начать заново'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader; 