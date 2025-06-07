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
  currentQuizName?: string;
  onLogout?: () => void;
}

const MinimalHeader: React.FC<MinimalHeaderProps> = ({ 
  language, 
  setLanguage, 
  darkMode, 
  setDarkMode, 
  onReset, 
  onShowHistory, 
  onShuffle, 
  onFinishAttempt, 
  disableFinish, 
  isLearnMode = false,
  currentQuizName = '',
  onLogout
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-sm px-4 py-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold select-none mb-1 sm:mb-0 flex items-center gap-2">
            <a
              href="https://smartbee.me"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#c770f0] to-[#7c3aed] bg-clip-text text-transparent hover:underline transition-colors"
              title="Go to smartbee.me"
              style={{ cursor: 'pointer' }}
            >
              Dreamy Quiz
            </a>
          </h1>
          
          {currentQuizName && (
            <div className="flex items-center">
              <span className="mx-2 text-gray-400 hidden sm:inline">/</span>
              <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {currentQuizName}
              </span>
            </div>
          )}
          
          {isLearnMode && (
            <span className="ml-2 text-sm bg-[#c770f0] text-white px-2 py-1 rounded-full">
              {language === 'en' ? 'Learn Mode' : 'Режим обучения'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Переключатель языка */}
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 mr-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                language === 'en' 
                  ? 'bg-[#c770f0] text-white' 
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
                  ? 'bg-[#c770f0] text-white' 
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
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-[#c770f0]/20 transition-colors"
              title={language === 'en' ? 'Shuffle Questions' : 'Перемешать вопросы'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c770f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356-2A9 9 0 106.097 19.423M20 9V4h-5" />
              </svg>
            </button>
          )}
          {/* Иконка History */}
          {onShowHistory && (
            <button
              onClick={onShowHistory}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-[#c770f0]/20 transition-colors"
              title={language === 'en' ? 'History' : 'История'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c770f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          {/* Иконка Finish Attempt - скрываем в режиме обучения */}
          {onFinishAttempt && !isLearnMode && (
            <button
              onClick={onFinishAttempt}
              className="p-2 rounded-full bg-[#c770f0] hover:bg-[#b35fd8] text-white flex items-center justify-center transition-all duration-200 disabled:opacity-50"
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
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-[#c770f0]/20 transition-colors"
              aria-label={language === 'en' ? 'Start Over' : 'Начать заново'}
              title={language === 'en' ? 'Start Over' : 'Начать заново'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c770f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-[#c770f0]/20 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c770f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c770f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-[#c770f0]/20 transition-colors"
              title={language === 'en' ? 'Logout' : 'Выйти'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c770f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader; 