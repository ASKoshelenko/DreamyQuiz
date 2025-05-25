import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { loadQuestionsFromJson } from '../utils/quizManager';

interface QuizSelectorProps {
  onSelectQuiz: (questions: Question[], quizName: string) => void;
  onUploadFile: () => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
}

const singleQuiz = {
  id: 'azure-devops',
  name: 'AZ-400: Designing and Implementing Microsoft DevOps Solutions',
  description: 'Full practice exam for Microsoft Certified: DevOps Engineer Expert',
  fileName: 'AzureDevOps.json',
};

const QuizSelector: React.FC<QuizSelectorProps> = ({ onSelectQuiz, darkMode = false, setDarkMode }) => {
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    // Автоматически запускаем квиз при монтировании
    const startQuiz = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const questions = await loadQuestionsFromJson(singleQuiz.fileName);
        if (questions.length === 0) {
          throw new Error('No questions loaded');
        }
        onSelectQuiz(questions, singleQuiz.name);
      } catch (error) {
        setError('Failed to load quiz. Please try again.');
        console.error('Error loading quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };
    startQuiz();
  }, [onSelectQuiz]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-pink-900 flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full">
        <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-xl shadow-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Loading AZ-400 Practice Quiz...
          </h2>
          {isLoading && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xl text-white">Loading...</span>
              </div>
            </div>
          )}
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