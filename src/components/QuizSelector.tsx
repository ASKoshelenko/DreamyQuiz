import React, { useState } from 'react';
import { Question } from '../types';
import { loadQuestionsFromJson, availableQuizzes, QuizInfo } from '../utils/quizManager';

interface QuizSelectorProps {
  onSelectQuiz: (questions: Question[], quizName: string) => void;
  onUploadFile: () => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
}

const QuizSelector: React.FC<QuizSelectorProps> = ({ onSelectQuiz, onUploadFile, darkMode = false, setDarkMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuizId, setLoadingQuizId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Эффект для применения темной темы
  React.useEffect(() => {
    if (darkMode && setDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (setDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode, setDarkMode]);

  const handleQuizSelect = async (quiz: QuizInfo) => {
    setIsLoading(true);
    setLoadingQuizId(quiz.id);
    setError(null);
    
    try {
      const questions = await loadQuestionsFromJson(quiz.fileName);
      if (questions.length === 0) {
        throw new Error('No questions loaded');
      }
      onSelectQuiz(questions, quiz.name);
    } catch (error) {
      setError(`Failed to load ${quiz.name}. Please try again.`);
      console.error('Error loading quiz:', error);
    } finally {
      setIsLoading(false);
      setLoadingQuizId(null);
    }
  };

  // Icons for different quiz types
  const getQuizIcon = (quizId: string) => {
    if (quizId.includes('ai')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    }
  };

  // Color themes for different quiz types
  const getQuizTheme = (quizId: string) => {
    if (quizId.includes('ai')) {
      return {
        border: 'border-purple-500',
        bgHover: 'hover:bg-purple-900/20',
        iconBg: 'bg-purple-900/30',
        button: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      };
    } else {
      return {
        border: 'border-blue-500',
        bgHover: 'hover:bg-blue-900/20',
        iconBg: 'bg-blue-900/30',
        button: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      };
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-pink-900 flex items-center justify-center px-4 py-16">
      <div className="max-w-5xl w-full">
        <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-xl shadow-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Select Certification Quiz
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {availableQuizzes.map((quiz) => {
              const theme = getQuizTheme(quiz.id);
              const isCurrentLoading = isLoading && loadingQuizId === quiz.id;
              
              return (
                <div 
                  key={quiz.id}
                  onClick={() => !isLoading && handleQuizSelect(quiz)} 
                  className={`bg-white/10 dark:bg-gray-800/40 border-2 ${theme.border} rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 ${theme.bgHover} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`${theme.iconBg} p-4 rounded-full mb-6`}>
                      {getQuizIcon(quiz.id)}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">
                      {quiz.name}
                    </h3>
                    <p className="text-gray-200 mb-6">
                      {quiz.description}
                    </p>
                    <button 
                      className={`mt-4 px-8 py-3 bg-gradient-to-r ${theme.button} text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl w-full max-w-xs flex items-center justify-center`}
                      disabled={isLoading}
                    >
                      {isCurrentLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        'Start Quiz'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8">
            <button 
              onClick={onUploadFile}
              className="px-6 py-3 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors mt-8 flex items-center mx-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Custom Questions
            </button>
          </div>
          
          {error && (
            <div className="mt-8 p-6 bg-red-900/20 text-red-300 rounded-xl border border-red-500/30">
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSelector; 