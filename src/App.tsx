import React, { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import Quiz from './components/Quiz';
import QuizSelector from './components/QuizSelector';
import ModeSelector from './components/ModeSelector';
import { Question, parseQuestions } from './utils/questionParser';
import MinimalHeader from './components/MinimalHeader';
import { shuffleArray } from './utils/shuffle';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showQuizSelector, setShowQuizSelector] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (localStorage.getItem('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [quizMode, setQuizMode] = useState<'quiz' | 'learn' | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  const handleFileUpload = (content: string, fileName: string) => {
    const parsedQuestions = parseQuestions(content);
    setQuestions(parsedQuestions);
    setShuffledQuestions(parsedQuestions);
    setIsFileUploaded(true);
    setShowQuizSelector(false);
    setShowModeSelector(true);
  };

  const handleQuizSelect = (selectedQuestions: Question[], quizName: string) => {
    setQuestions(selectedQuestions);
    setShuffledQuestions(selectedQuestions);
    setIsFileUploaded(true);
    setShowQuizSelector(false);
    setShowModeSelector(true);
  };

  const handleReturnToUpload = () => {
    setIsFileUploaded(false);
    setQuestions([]);
    setShuffledQuestions([]);
    setShowQuizSelector(true);
    setQuizMode(null);
    setShowModeSelector(false);
  };

  const handleShuffleQuestions = () => {
    setShuffledQuestions(shuffleArray(questions));
  };

  const handleModeSelect = (mode: 'quiz' | 'learn') => {
    setQuizMode(mode);
    setShowModeSelector(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MinimalHeader
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onReset={isFileUploaded ? handleReturnToUpload : undefined}
        isLearnMode={quizMode === 'learn'}
      />
      <main className="flex-1 app-content">
        {showQuizSelector ? (
          <QuizSelector 
            onSelectQuiz={handleQuizSelect} 
            onUploadFile={() => setShowQuizSelector(false)} 
          />
        ) : !isFileUploaded ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : showModeSelector ? (
          <ModeSelector 
            onSelectMode={handleModeSelect} 
            language={language} 
          />
        ) : (
          <Quiz 
            questions={shuffledQuestions} 
            onReturnToUpload={handleReturnToUpload}
            language={language}
            setLanguage={setLanguage}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            resetQuiz={handleReturnToUpload}
            onShuffle={handleShuffleQuestions}
            footerRef={footerRef}
            isLearnMode={quizMode === 'learn'}
          />
        )}
      </main>
      <Footer ref={footerRef} />
    </div>
  );
}

export default App; 