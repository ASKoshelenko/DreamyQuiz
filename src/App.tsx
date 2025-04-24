import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Quiz from './components/Quiz';
import QuizSelector from './components/QuizSelector';
import { Question, parseQuestions } from './utils/questionParser';
import './App.css';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showQuizSelector, setShowQuizSelector] = useState(true);

  const handleFileUpload = (content: string, fileName: string) => {
    const parsedQuestions = parseQuestions(content);
    setQuestions(parsedQuestions);
    setFileName(fileName);
    setIsFileUploaded(true);
    setShowQuizSelector(false);
  };

  const handleQuizSelect = (selectedQuestions: Question[], quizName: string) => {
    setQuestions(selectedQuestions);
    setFileName(quizName);
    setIsFileUploaded(true);
    setShowQuizSelector(false);
  };

  const handleReturnToUpload = () => {
    setIsFileUploaded(false);
    setQuestions([]);
    setFileName('');
    setShowQuizSelector(true);
  };

  const handleReturnHome = () => {
    setIsFileUploaded(false);
    setQuestions([]);
    setFileName('');
    setShowQuizSelector(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 
          onClick={handleReturnHome}
          className="cursor-pointer hover:text-blue-600 transition-colors duration-200 flex items-center justify-center"
        >
          <span>Dreamy Quiz</span>
          {isFileUploaded && (
            <svg 
              className="ml-2 w-6 h-6 text-gray-500 hover:text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )}
        </h1>
        {isFileUploaded && <h2>Current quiz: {fileName}</h2>}
      </header>
      
      <main className="app-content">
        {showQuizSelector ? (
          <QuizSelector 
            onSelectQuiz={handleQuizSelect} 
            onUploadFile={() => setShowQuizSelector(false)} 
          />
        ) : !isFileUploaded ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : (
          <Quiz questions={questions} onReturnToUpload={handleReturnToUpload} />
        )}
      </main>
    </div>
  );
}

export default App; 