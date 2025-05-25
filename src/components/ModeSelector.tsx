import React from 'react';

interface ModeSelectorProps {
  onSelectMode: (mode: 'quiz' | 'learn') => void;
  language: 'en' | 'ru';
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode, language, darkMode, setDarkMode }) => {
  // Эффект для применения темной темы
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-pink-900 flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full">
        <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-xl shadow-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">
            {language === 'en' ? 'Select Quiz Mode' : 'Выберите режим викторины'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div 
              onClick={() => onSelectMode('quiz')} 
              className="bg-white/10 dark:bg-gray-800/40 border-2 border-blue-500 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-blue-900/20"
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {language === 'en' ? 'Quiz Mode' : 'Режим тестирования'}
                </h3>
                <p className="text-gray-200 mb-6">
                  {language === 'en' 
                    ? 'Test your knowledge by answering questions and getting scored.' 
                    : 'Проверьте свои знания, отвечая на вопросы и получая оценку.'}
                </p>
                <button className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                  {language === 'en' ? 'Start Quiz' : 'Начать тест'}
                </button>
              </div>
            </div>
            
            <div 
              onClick={() => onSelectMode('learn')} 
              className="bg-white/10 dark:bg-gray-800/40 border-2 border-green-500 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-green-900/20"
            >
              <div className="flex flex-col items-center">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {language === 'en' ? 'Learn Mode' : 'Режим обучения'}
                </h3>
                <p className="text-gray-200 mb-6">
                  {language === 'en' 
                    ? 'Browse questions with correct answers highlighted to learn the material.' 
                    : 'Просматривайте вопросы с выделенными правильными ответами для изучения материала.'}
                </p>
                <button className="mt-4 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl">
                  {language === 'en' ? 'Start Learning' : 'Начать обучение'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector; 