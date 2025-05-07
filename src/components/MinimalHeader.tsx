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
}

const MinimalHeader: React.FC<MinimalHeaderProps> = ({ language, setLanguage, darkMode, setDarkMode, onReset, onShowHistory, onShuffle, onFinishAttempt, disableFinish }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-sm px-4 py-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
        <h1 className="text-xl sm:text-2xl font-bold select-none mb-1 sm:mb-0 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">Dreamy Quiz</h1>
        <div className="flex items-center gap-2">
          {/* Иконка Shuffle */}
          {onShuffle && (
            <button
              onClick={onShuffle}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              title="Shuffle Questions"
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
              title="History"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          {/* Иконка Finish Attempt */}
          {onFinishAttempt && (
            <button
              onClick={onFinishAttempt}
              className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-white flex items-center justify-center transition-all duration-200 disabled:opacity-50"
              disabled={disableFinish}
              title="Finish Attempt"
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
              aria-label="Start Over"
              title="Start Over"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          {/* Temporarily commented out language switcher
          <button
            onClick={() => setLanguage('en')}
            className={`p-2 rounded-full ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800'}`}
            aria-label="English"
          >EN</button>
          <button
            onClick={() => setLanguage('ru')}
            className={`p-2 rounded-full ${language === 'ru' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800'}`}
            aria-label="Russian"
          >RU</button>
          */}
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