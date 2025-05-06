import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { loadQuestionsFromJson } from '../utils/quizManager';

interface QuizSelectorProps {
  onSelectQuiz: (questions: Question[], quizName: string) => void;
  onUploadFile: () => void;
}

const singleQuiz = {
  id: 'azure-devops',
  name: 'AZ-400: Designing and Implementing Microsoft DevOps Solutions',
  description: 'Full practice exam for Microsoft Certified: DevOps Engineer Expert',
  fileName: 'AzureDevOps.json',
};

const QuizSelector: React.FC<QuizSelectorProps> = ({ onSelectQuiz }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-6">Loading AZ-400 Practice Quiz...</h2>
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSelector; 