import React, { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import Quiz from './components/Quiz';
import QuizSelector from './components/QuizSelector';
import ModeSelector from './components/ModeSelector';
import { Question, parseQuestions } from './utils/questionParser';
import MinimalHeader from './components/MinimalHeader';
import { shuffleArray } from './utils/shuffle';
import Footer from './components/Footer';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showQuizSelector, setShowQuizSelector] = useState(true);
  const [currentQuizName, setCurrentQuizName] = useState<string>('');
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

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    handleReturnToQuizSelector();
  };

  const handleFileUpload = (content: string, fileName: string) => {
    const parsedQuestions = parseQuestions(content);
    setQuestions(parsedQuestions);
    setShuffledQuestions(parsedQuestions);
    setIsFileUploaded(true);
    setShowFileUpload(false);
    setShowQuizSelector(false);
    setCurrentQuizName('Custom Quiz');
    setShowModeSelector(true);
  };

  const handleQuizSelect = (selectedQuestions: Question[], quizName: string) => {
    setQuestions(selectedQuestions);
    setShuffledQuestions(selectedQuestions);
    setIsFileUploaded(true);
    setShowQuizSelector(false);
    setCurrentQuizName(quizName);
    setShowModeSelector(true);
  };

  const handleReturnToQuizSelector = () => {
    setIsFileUploaded(false);
    setQuestions([]);
    setShuffledQuestions([]);
    setShowQuizSelector(true);
    setShowFileUpload(false);
    setQuizMode(null);
    setShowModeSelector(false);
    setCurrentQuizName('');
  };

  const handleShowFileUpload = () => {
    setShowQuizSelector(false);
    setShowFileUpload(true);
  };

  const handleShuffleQuestions = () => {
    setShuffledQuestions(shuffleArray(questions));
  };

  const handleModeSelect = (mode: 'quiz' | 'learn') => {
    setQuizMode(mode);
    setShowModeSelector(false);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MinimalHeader
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onReset={isFileUploaded ? handleReturnToQuizSelector : undefined}
        isLearnMode={quizMode === 'learn'}
        currentQuizName={currentQuizName}
        onLogout={handleLogout}
      />
      <main className="flex-1 app-content">
        {showQuizSelector ? (
          <QuizSelector 
            onSelectQuiz={handleQuizSelect} 
            onUploadFile={handleShowFileUpload} 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        ) : showFileUpload ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : showModeSelector ? (
          <ModeSelector 
            onSelectMode={handleModeSelect} 
            language={language}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        ) : (
          <Quiz 
            questions={shuffledQuestions} 
            onReturnToUpload={handleReturnToQuizSelector}
            language={language}
            setLanguage={setLanguage}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            resetQuiz={handleReturnToQuizSelector}
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