import React, { useState } from 'react';
import { Question } from '../types';
import { availableQuizzes, loadQuestionsFromJson } from '../utils/quizManager';

interface QuizSelectorProps {
  onSelectQuiz: (questions: Question[], quizName: string) => void;
  onUploadFile: () => void;
}

const QuizSelector: React.FC<QuizSelectorProps> = ({ onSelectQuiz, onUploadFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectQuiz = async (quizId: string) => {
    const selectedQuizInfo = availableQuizzes.find(quiz => quiz.id === quizId);
    if (!selectedQuizInfo) return;

    setIsLoading(true);
    setError(null);

    try {
      const questions = await loadQuestionsFromJson(selectedQuizInfo.fileName);
      if (questions.length === 0) {
        throw new Error('No questions loaded');
      }
      onSelectQuiz(questions, selectedQuizInfo.name);
    } catch (error) {
      setError('Failed to load quiz. Please try again.');
      console.error('Error loading quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Select a Quiz</h2>
        <div className="space-y-4">
          {/* Available Quizzes */}
          {availableQuizzes.map((quiz) => (
            <div 
              key={quiz.id}
              className={`flex items-center p-4 border rounded-lg transition-all duration-200 cursor-pointer
                border-gray-200 hover:border-blue-500 hover:bg-blue-50`}
              onClick={() => handleSelectQuiz(quiz.id)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelectQuiz(quiz.id); }}
              aria-label={`Start quiz: ${quiz.name}`}
            >
              <div className="relative flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-100 mr-3" />
              </div>
              <label className="block text-lg cursor-pointer">
                <span className="font-medium text-gray-900">{quiz.name}</span>
                <span className="text-gray-500 block text-sm">{quiz.description}</span>
              </label>
            </div>
          ))}
          {/* Upload Custom Quiz Option */}
          <div 
            className={`flex items-center p-4 border rounded-lg transition-all duration-200 cursor-pointer
              border-gray-200 hover:border-blue-500 hover:bg-blue-50`}
            onClick={onUploadFile}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onUploadFile(); }}
            aria-label="Upload custom quiz"
          >
            <div className="relative flex items-center justify-center w-4 h-4">
              <div className="w-4 h-4 rounded-full border-2 border-blue-600 bg-blue-100 mr-3" />
            </div>
            <label className="block text-lg cursor-pointer">
              <span className="font-medium text-gray-900">Upload Custom Quiz</span>
              <span className="text-gray-500 block text-sm">Upload your own markdown file with quiz questions</span>
            </label>
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default QuizSelector; 