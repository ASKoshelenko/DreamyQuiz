import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Question, Answer } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { AnimatePresence, motion } from 'framer-motion';

interface QuizProps {
  questions: Question[];
  onReturnToUpload: () => void;
  language: 'en' | 'ru';
  setLanguage: (lang: 'en' | 'ru') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  resetQuiz: () => void;
  onShuffle: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onReturnToUpload, language, setLanguage, darkMode, setDarkMode, resetQuiz, onShuffle }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const questionBlockRef = useRef<HTMLDivElement>(null);

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

  const handleAnswer = useCallback((answer: string) => {
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
  }, [currentQuestionIndex, questions, userAnswers]);

  const handleSubmitMultipleChoice = useCallback(() => {
    setShowResult(true);
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResult(false);
    }
  }, [currentQuestionIndex, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowResult(false);
    }
  }, [currentQuestionIndex]);

  const calculateScore = useCallback(() => {
    const answeredQuestions = Object.keys(userAnswers).length;
    if (answeredQuestions === 0) return 0;

    let correctAnswers = 0;
    
    Object.entries(userAnswers).forEach(([id, answer]) => {
      const question = questions.find(q => q.id === id);
      if (!question) return;
      
      if (question.isMultipleChoice) {
        // For multiple choice, all correct answers must be selected and no incorrect ones
        const userAnswerArray = answer as string[];
        const correctAnswerArray = question.correctAnswer as string[];
        
        if (userAnswerArray.length === correctAnswerArray.length && 
            userAnswerArray.every(a => correctAnswerArray.includes(a))) {
          correctAnswers++;
        }
      } else {
        // For single choice, just check if the answer matches
        if (question.correctAnswer === answer) {
          correctAnswers++;
        }
      }
    });

    return Math.round((correctAnswers / answeredQuestions) * 100);
  }, [userAnswers, questions]);

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

  // Горячие клавиши: A/B/C/D, стрелки, Enter
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalImage) return; // Не реагировать, если открыта модалка
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const answers = questions[currentQuestionIndex].answers;
      // A/B/C/D
      if (/^[a-dA-D]$/.test(e.key)) {
        const idx = e.key.toUpperCase().charCodeAt(0) - 65;
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
                <div className="w-full flex items-center justify-center mt-4 mb-2">
                  <div className="flex gap-1 sm:gap-2 w-full max-w-xl">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-2 rounded-full transition-all duration-300
                          ${idx < currentQuestionIndex ? 'bg-blue-400 dark:bg-blue-700' : idx === currentQuestionIndex ? 'bg-pink-400 dark:bg-pink-600' : 'bg-gray-300 dark:bg-gray-800'}`}
                      ></div>
                    ))}
                  </div>
                  <span className="ml-3 text-xs sm:text-sm text-white font-semibold">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-white font-semibold text-base">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <button
                    onClick={onShuffle}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 flex items-center justify-center"
                    aria-label="Shuffle Questions"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356-2A9 9 0 106.097 19.423M20 9V4h-5" />
                    </svg>
                  </button>
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
                          disabled={showResult && !currentQuestion.isMultipleChoice}
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
                    
                    {currentQuestion.isMultipleChoice && !showResult && (
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
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white/95 dark:from-gray-900/95 via-white/60 dark:via-gray-900/60 to-transparent px-4 py-4 sm:static sm:bg-none sm:p-0 flex justify-center gap-4 sm:gap-8">
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
          </div>
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
    </div>
  );
};

export default Quiz; 