import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Question, Answer } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { AnimatePresence, motion } from 'framer-motion';
import MinimalHeader from './MinimalHeader';

interface QuizProps {
  questions: Question[];
  onReturnToUpload: () => void;
  language: 'en' | 'ru';
  setLanguage: (lang: 'en' | 'ru') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  resetQuiz: () => void;
  onShuffle: () => void;
  footerRef?: React.RefObject<HTMLElement>;
}

const Quiz: React.FC<QuizProps> = ({ questions, onReturnToUpload, language, setLanguage, darkMode, setDarkMode, resetQuiz, onShuffle, footerRef }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(true);
  const [learnMode] = useState(true);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const questionBlockRef = useRef<HTMLDivElement>(null);

  // Ключ для localStorage (можно доработать для уникальности по quizId)
  const storageKey = `quiz-progress-${questions.length}`;

  // Ключ для истории
  const historyKey = `quiz-history-${questions.length}`;
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Флаг для ручного завершения попытки
  const [finished, setFinished] = useState(false);

  // Флаг для показа модалки статистики после Finish Attempt
  const [showStats, setShowStats] = useState(false);

  // --- Sticky nav buttons logic ---
  const [navAboveFooter, setNavAboveFooter] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef?.current || !navRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setNavAboveFooter(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.01,
      }
    );
    observer.observe(footerRef.current);
    // Обновляем isMobile при ресайзе
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [footerRef]);

  const calculateScore = useCallback(() => {
    const answeredQuestions = Object.keys(userAnswers).length;
    if (answeredQuestions === 0) return 0;

    let correctAnswers = 0;
    Object.entries(userAnswers).forEach(([id, answer]) => {
      const question = questions.find(q => q.id === id);
      if (!question) return;
      if (question.isMultipleChoice) {
        const userAnswerArray = answer as string[];
        const correctAnswerArray = question.correctAnswer as string[];
        if (userAnswerArray.length === correctAnswerArray.length && userAnswerArray.every(a => correctAnswerArray.includes(a))) {
          correctAnswers++;
        }
      } else {
        if (question.correctAnswer === answer) {
          correctAnswers++;
        }
      }
    });
    return Math.round((correctAnswers / answeredQuestions) * 100);
  }, [userAnswers, questions]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Восстановление прогресса при загрузке
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (parsed.userAnswers) setUserAnswers(parsed.userAnswers);
          if (typeof parsed.currentQuestionIndex === 'number') setCurrentQuestionIndex(parsed.currentQuestionIndex);
        }
      } catch {}
    }
    // eslint-disable-next-line
  }, [storageKey]);

  // Сохраняем прогресс при изменениях
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ userAnswers, currentQuestionIndex }));
  }, [userAnswers, currentQuestionIndex, storageKey]);

  // Загрузка истории при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(historyKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch {}
    }
    // eslint-disable-next-line
  }, [historyKey]);

  // Сохраняем попытку в историю при ручном завершении или полном прохождении
  useEffect(() => {
    const allAnswered = questions.length > 0 && questions.every(q => userAnswers[q.id]);
    if ((allAnswered || finished) && Object.keys(userAnswers).length > 0) {
      const score = calculateScore();
      const attempt = {
        date: new Date().toISOString(),
        score,
        total: questions.length,
        correct: Math.round((score / 100) * questions.length),
        answers: userAnswers,
        partial: !allAnswered,
      };
      const updated = [attempt, ...history].slice(0, 20); // максимум 20 попыток
      setHistory(updated);
      localStorage.setItem(historyKey, JSON.stringify(updated));
      setFinished(false); // сбрасываем флаг после сохранения
    }
    // eslint-disable-next-line
  }, [userAnswers, questions, calculateScore, finished]);

  // Показываем статистику после ручного завершения попытки
  useEffect(() => {
    if (finished) {
      setShowStats(true);
    }
  }, [finished]);

  const handleAnswer = useCallback((answer: string) => {
    if (learnMode) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion.isMultipleChoice) {
      // Handle multiple choice answers
      const currentAnswers = userAnswers[currentQuestion.id] as string[] || [];
      
      if (currentAnswers.includes(answer)) {
        // Remove answer if already selected
        setUserAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: currentAnswers.filter(a => a !== answer)
        }));
      } else {
        // Add answer if not selected
        setUserAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: [...currentAnswers, answer]
        }));
      }
    } else {
      // Handle single choice answers
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer
      }));
      setShowResult(true);
    }
  }, [currentQuestionIndex, questions, userAnswers, learnMode]);

  const handleSubmitMultipleChoice = useCallback(() => {
    setShowResult(true);
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      if (!learnMode) {
        setShowResult(false);
      }
    }
  }, [currentQuestionIndex, questions.length, learnMode]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      if (!learnMode) {
        setShowResult(false);
      }
    }
  }, [currentQuestionIndex, learnMode]);

  const handleImageClick = useCallback((imagePath: string) => {
    setModalImage(imagePath);
  }, []);

  const closeModal = useCallback(() => {
    setModalImage(null);
  }, []);

  // Закрытие модального окна по Escape
  React.useEffect(() => {
    if (!modalImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalImage, closeModal]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Функция для скролла к вопросу
  const scrollToQuestion = () => {
    if (questionBlockRef.current) {
      questionBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Горячие клавиши: A-Z, 1-9, стрелки, Enter
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalImage) return; // Не реагировать, если открыта модалка
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      const answers = questions[currentQuestionIndex].answers;
      // A-Z
      if (/^[a-zA-Z]$/.test(e.key)) {
        const idx = e.key.toUpperCase().charCodeAt(0) - 65;
        if (answers[idx]) {
          handleAnswer(answers[idx].label);
        }
      }
      // 1-9
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (answers[idx]) {
          handleAnswer(answers[idx].label);
        }
      }
      // Стрелки
      if (e.key === 'ArrowRight') {
        handleNext();
      }
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
      // Enter для мультивыбора
      if (e.key === 'Enter' && questions[currentQuestionIndex].isMultipleChoice && !showResult) {
        handleSubmitMultipleChoice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, handleAnswer, handleNext, handlePrevious, handleSubmitMultipleChoice, modalImage, showResult, questions]);

  // Guard clause for empty questions array
  if (!questions || questions.length === 0) {
    return <div className="quiz-container">No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / pageSize);
  const score = calculateScore();

  // Вычисляем количество правильных и процент среди отвеченных
  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  Object.entries(userAnswers).forEach(([id, answer]) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;
    if (question.isMultipleChoice) {
      const userAnswerArray = answer as string[];
      const correctAnswerArray = question.correctAnswer as string[];
      if (userAnswerArray.length === correctAnswerArray.length && userAnswerArray.every(a => correctAnswerArray.includes(a))) {
        correctCount++;
      }
    } else {
      if (question.correctAnswer === answer) {
        correctCount++;
      }
    }
  });
  const scorePercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setCurrentQuestionIndex((page - 1) * pageSize);
      setShowResult(false);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      pages.push(
        <button
          key="first"
          onClick={() => goToPage(1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2">...</span>
        );
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2">...</span>
        );
      }
      
      pages.push(
        <button
          key="last"
          onClick={() => goToPage(totalPages)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          {totalPages}
        </button>
      );
    }
    
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {pages}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-gray-900 to-pink-900 flex flex-col items-center justify-center transition-colors duration-500">
      <MinimalHeader
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onReset={onReturnToUpload}
        onShowHistory={() => setShowHistory(true)}
        onShuffle={onShuffle}
        onFinishAttempt={() => setFinished(true)}
        disableFinish={Object.keys(userAnswers).length === 0}
      />
      <div className="w-full max-w-5xl flex-1 flex flex-col justify-center items-center px-2 sm:px-6 py-8">
        <div ref={questionBlockRef} className="w-full flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full rounded-2xl shadow-2xl p-8 sm:p-12 bg-white/10 dark:bg-gray-900/70 backdrop-blur-xl transition-all duration-500 max-w-3xl mx-auto"
            >
              <div className="mb-6">
                {learnMode && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-4 py-2 bg-green-500 text-white font-bold rounded-full">Режим обучения</span>
                  </div>
                )}
                <div className="text-center mb-2">
                  <span className="text-lg font-semibold text-white">Total Score: {score}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                {/* Stepper progress bar */}
                <div className="w-full flex flex-col items-center justify-center mt-4 mb-2 relative">
                  <div className="flex gap-1 sm:gap-2 w-full max-w-xl">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-2 rounded-full transition-all duration-300
                          ${idx < currentQuestionIndex ? 'bg-blue-400 dark:bg-blue-700' : idx === currentQuestionIndex ? 'bg-pink-400 dark:bg-pink-600' : 'bg-gray-300 dark:bg-gray-800'}`}
                      ></div>
                    ))}
                  </div>
                  {/* Счетчик вопросов: на мобильных в одну строку и под прогресс-баром */}
                  <span className="block text-xs sm:hidden text-white font-semibold mt-2 text-center">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>
                  <span className="ml-3 text-xs sm:text-sm text-white font-semibold hidden sm:inline-block">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  {/* Удаляю Question 1 of 553 */}
                </div>
              </div>

              {/* Question Images */}
              {currentQuestion.images && currentQuestion.images.length > 0 && (
                <div className="mb-6 w-full flex flex-col items-center">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="w-full max-w-3xl"
                    style={{ margin: '0 auto', marginBottom: 24 }}
                  >
                    {currentQuestion.images.map((imagePath, index) => (
                      <SwiperSlide key={index}>
                        <button
                          onClick={() => handleImageClick(imagePath)}
                          className="w-full focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 bg-white dark:bg-gray-900"
                          style={{ display: 'block' }}
                        >
                          <img
                            src={imagePath}
                            alt={`Question ${currentQuestion.id} - ${index + 1}`}
                            className="mx-auto w-full h-auto rounded-xl shadow-md cursor-zoom-in hover:opacity-90 transition-opacity object-contain max-h-[320px] bg-white"
                            loading="lazy"
                            style={{ maxHeight: '320px', objectFit: 'contain' }}
                          />
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
              
              {/* Modal for enlarged image */}
              {modalImage && (
                <div 
                  className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
                  onClick={closeModal}
                >
                  <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-4 relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                    <img
                      src={modalImage}
                      alt="Enlarged view"
                      className="max-w-full max-h-[90vh] object-contain bg-white dark:bg-gray-900 rounded-xl"
                    />
                    <button 
                      onClick={closeModal}
                      className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-lg"
                      aria-label="Close"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="prose max-w-none dark:prose-invert text-gray-900 dark:text-white">
                <div className="bg-gray-50/80 dark:bg-gray-800/80 p-4 sm:p-6 rounded-xl mb-6 transition-colors duration-300 shadow-sm">
                  <p className="text-lg dark:text-white">
                    {language === 'en' ? currentQuestion.text : (currentQuestion.textRu || currentQuestion.text)}
                  </p>
                  {currentQuestion.isMultipleChoice && (
                    <p className="text-sm text-pink-600 mt-2 italic font-semibold">
                      Select all that apply
                    </p>
                  )}
                </div>

                {currentQuestion.isInformational ? (
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <p className="text-blue-700 dark:text-blue-200">This is an informational question. Read and understand the content.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.answers.map((answer: Answer) => {
                      const isSelected = currentQuestion.isMultipleChoice
                        ? (userAnswers[currentQuestion.id] as string[] || []).includes(answer.label)
                        : userAnswers[currentQuestion.id] === answer.label;
                      const isCorrect = currentQuestion.isMultipleChoice
                        ? (currentQuestion.correctAnswer as string[] || []).includes(answer.label)
                        : currentQuestion.correctAnswer === answer.label;
                      return (
                        <button
                          key={answer.label}
                          onClick={() => handleAnswer(answer.label)}
                          disabled={learnMode || (showResult && !currentQuestion.isMultipleChoice)}
                          className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 font-semibold text-lg shadow-sm transition-all duration-200 min-h-[56px] sm:min-h-[64px] active:scale-95
                          ${showResult
                            ? isCorrect
                              ? 'bg-green-500 border-green-600 text-white font-bold shadow-lg'
                              : isSelected
                              ? 'bg-pink-500 border-pink-600 text-white font-bold shadow-lg'
                              : 'border-gray-200 text-gray-600 bg-white dark:bg-transparent'
                            : isSelected
                            ? 'bg-blue-600 border-blue-700 text-white font-bold scale-105 shadow-lg'
                            : 'border-gray-200 text-gray-900 dark:text-white bg-white dark:bg-transparent hover:bg-pink-100 dark:hover:bg-gradient-to-r dark:hover:from-blue-500 dark:hover:to-pink-500 hover:text-blue-900 dark:hover:text-white hover:font-bold'}
                          `}
                        >
                          <div className="flex items-center">
                            <span className="font-bold mr-3 text-xl">{answer.label}.</span>
                            <span className="text-base sm:text-lg">{answer.text}</span>
                          </div>
                        </button>
                      );
                    })}
                    
                    {currentQuestion.isMultipleChoice && !showResult && !learnMode && (
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={handleSubmitMultipleChoice}
                          disabled={!(userAnswers[currentQuestion.id] as string[] || []).length}
                          className={`px-8 py-3 rounded-full text-white font-bold shadow-lg text-lg transition-all duration-200
                            ${(userAnswers[currentQuestion.id] as string[] || []).length
                              ? 'bg-gradient-to-r from-blue-500 to-pink-500 hover:scale-105 hover:shadow-xl'
                              : 'bg-gray-400 cursor-not-allowed'}
                          `}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sticky navigation for mobile, centered for desktop */}
        <div className="mt-8 w-full flex flex-col items-center">
          <AnimatePresence>
            {!(isMobile && navAboveFooter) && (
              <motion.div
                ref={navRef}
                className={
                  `z-30 bg-gradient-to-t from-white/95 dark:from-gray-900/95 via-white/60 dark:via-gray-900/60 to-transparent px-4 py-4 flex justify-center gap-4 sm:gap-8 fixed left-0 right-0 sm:static sm:bg-none sm:p-0`
                }
                style={{
                  bottom: 0
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4,0,0.2,1] } }}
                exit={{ opacity: 0, y: 24, transition: { duration: 0.18, ease: [0.4,0,0.2,1] } }}
              >
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex-1 px-8 py-5 sm:py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 sm:w-auto min-h-[56px] active:scale-95
                    ${currentQuestionIndex === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-400 to-pink-400 text-white hover:scale-105 hover:shadow-xl'}
                  `}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className={`flex-1 px-8 py-5 sm:py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 sm:w-auto min-h-[56px] active:scale-95
                    ${currentQuestionIndex === totalQuestions - 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-400 to-blue-400 text-white hover:scale-105 hover:shadow-xl'}
                  `}
                >
                  Next
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {renderPagination()}

        <div className="mt-8 bg-white/10 dark:bg-gray-900/70 rounded-2xl shadow-lg p-4 transition-all duration-500 max-w-3xl w-full mx-auto">
          <h3 className="text-lg font-bold mb-4 text-white">Question Navigator</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setShowResult(false);
                  setTimeout(scrollToQuestion, 100); // плавный скролл к вопросу
                }}
                className={`aspect-square rounded-xl flex items-center justify-center text-base font-bold shadow-sm transition-all duration-200
                  ${currentQuestionIndex === index
                    ? 'bg-gradient-to-br from-blue-400 to-pink-400 text-white scale-110 shadow-lg'
                    : learnMode
                    ? 'bg-green-400 text-white'
                    : userAnswers[question.id]
                      ? userAnswers[question.id] === question.correctAnswer
                        ? 'bg-green-400 text-white'
                        : 'bg-pink-400 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-pink-200 dark:hover:bg-pink-700'}
                `}
              >
                {question.id}
              </button>
            ))}
          </div>
        </div>

        {/* Модалка статистики после Finish Attempt */}
        {showStats && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md w-full shadow-2xl relative flex flex-col items-center">
              <button onClick={() => setShowStats(false)} className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-200">✕</button>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Attempt Statistics</h2>
              <div className="text-lg text-gray-900 dark:text-white mb-2">Answered: <span className="font-bold text-blue-600">{answeredCount}</span> / {questions.length}</div>
              <div className="text-lg text-gray-900 dark:text-white mb-2">Correct: <span className="font-bold text-pink-500">{correctCount} / {answeredCount}</span></div>
              <div className="text-lg text-gray-900 dark:text-white mb-2">Score: <span className="font-bold text-pink-500">{scorePercent}%</span></div>
              <button onClick={() => setShowStats(false)} className="mt-6 px-6 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold">Close</button>
            </div>
          </div>
        )}
      </div>
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-50 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200 flex items-center justify-center"
          style={{ width: 32, height: 32 }}
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
      {/* Модалка истории */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setShowHistory(false)} className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-200">✕</button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Quiz History</h2>
            <table className="w-full text-sm mb-4">
              <thead><tr>
                <th className="text-white">Date</th>
                <th className="text-white">Score</th>
                <th className="text-white">Correct</th>
                <th className="text-white">Status</th>
              </tr></thead>
              <tbody>
                {history.length === 0 && (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-4">No attempts yet</td></tr>
                )}
                {history.map((h, i) => (
                  <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                    <td>{new Date(h.date).toLocaleString()}</td>
                    <td>{h.score}%</td>
                    <td>{h.correct}/{h.total}</td>
                    <td>{h.partial ? <span className="text-pink-500 font-semibold">Partial</span> : <span className="text-blue-600 font-semibold">Full</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => { setHistory([]); localStorage.removeItem(historyKey); }} className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white font-semibold">Clear History</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz; 