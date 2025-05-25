import React from 'react';

interface ModeSelectorProps {
  onSelectMode: (mode: 'quiz' | 'learn') => void;
  language: 'en' | 'ru';
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode, language }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {language === 'en' ? 'Select Quiz Mode' : 'Выберите режим викторины'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div 
            onClick={() => onSelectMode('quiz')} 
            className="bg-white dark:bg-gray-700 border-2 border-blue-500 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {language === 'en' ? 'Quiz Mode' : 'Режим тестирования'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {language === 'en' 
                  ? 'Test your knowledge by answering questions and getting scored.' 
                  : 'Проверьте свои знания, отвечая на вопросы и получая оценку.'}
              </p>
              <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors">
                {language === 'en' ? 'Start Quiz' : 'Начать тест'}
              </button>
            </div>
          </div>
          
          <div 
            onClick={() => onSelectMode('learn')} 
            className="bg-white dark:bg-gray-700 border-2 border-green-500 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {language === 'en' ? 'Learn Mode' : 'Режим обучения'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {language === 'en' 
                  ? 'Browse questions with correct answers highlighted to learn the material.' 
                  : 'Просматривайте вопросы с выделенными правильными ответами для изучения материала.'}
              </p>
              <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors">
                {language === 'en' ? 'Start Learning' : 'Начать обучение'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector; 