import React, { useState, useCallback } from 'react';
import { Question, Answer } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

interface QuizProps {
  questions: Question[];
  onReturnToUpload: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onReturnToUpload }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState<string | null>(null);

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

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResult(false);
    setCurrentPage(1);
    setLanguage('en');
  }, []);

  const handleImageClick = useCallback((imagePath: string) => {
    setModalImage(imagePath);
  }, []);

  const closeModal = useCallback(() => {
    setModalImage(null);
  }, []);

  // Guard clause for empty questions array
  if (!questions || questions.length === 0) {
    return <div className="quiz-container">No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / pageSize);
  const score = calculateScore();

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en');
  };

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="quiz-header">
        <div className="quiz-controls">
          <button onClick={resetQuiz} className="control-button">
            Start Over
          </button>
          <button onClick={onReturnToUpload} className="control-button">
            Choose Different Quiz
          </button>
          <div className="language-toggle">
            <button
              onClick={() => setLanguage('en')}
              className={`language-button ${language === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`language-button ${language === 'ru' ? 'active' : ''}`}
            >
              RU
            </button>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-center mb-2">
            <span className="text-lg font-semibold">Total Score: {score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">Question {currentQuestion.id}</h2>
          {currentQuestion.hasTranslation && (
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-sm rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              {language === 'en' ? 'RU' : 'EN'}
            </button>
          )}
        </div>

        {/* Question Images */}
        {currentQuestion.images && currentQuestion.images.length > 0 && (
          <div className="mb-6 w-full flex flex-col items-center">
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              style={{ maxWidth: 420, width: '100%', margin: '0 auto', marginBottom: 24 }}
            >
              {currentQuestion.images.map((imagePath, index) => (
                <SwiperSlide key={index}>
                  <button
                    onClick={() => handleImageClick(imagePath)}
                    className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  >
                    <img
                      src={imagePath}
                      alt={`Question ${currentQuestion.id} - ${index + 1}`}
                      className="mx-auto w-full h-auto rounded-lg shadow-md cursor-zoom-in hover:opacity-90 transition-opacity object-contain max-h-[320px] bg-white"
                      loading="lazy"
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
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="max-w-full max-h-full relative" onClick={(e) => e.stopPropagation()}>
              <img
                src={modalImage}
                alt="Enlarged view"
                className="max-w-full max-h-[90vh] object-contain"
              />
              <button 
                onClick={closeModal}
                className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="prose max-w-none">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6">
            <p className="text-lg">
              {language === 'en' ? currentQuestion.text : (currentQuestion.textRu || currentQuestion.text)}
            </p>
            {currentQuestion.isMultipleChoice && (
              <p className="text-sm text-blue-600 mt-2 italic">
                Select all that apply
              </p>
            )}
          </div>

          {currentQuestion.isInformational ? (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-700">This is an informational question. Read and understand the content.</p>
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
                    className={`w-full text-left p-4 sm:p-5 rounded-lg border transition-colors ${
                      showResult
                        ? isCorrect
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : isSelected
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : 'border-gray-200 text-gray-600'
                        : isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="font-semibold mr-3 text-lg">{answer.label}.</span>
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
                    className={`px-6 py-3 rounded-lg text-white font-medium ${
                      (userAnswers[currentQuestion.id] as string[] || []).length
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex justify-between sm:justify-start gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } transition-colors flex-1 sm:flex-none`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className={`px-4 py-2 rounded-lg ${
              currentQuestionIndex === totalQuestions - 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } transition-colors flex-1 sm:flex-none`}
          >
            Next
          </button>
        </div>
      </div>

      {renderPagination()}

      <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => {
                setCurrentQuestionIndex(index);
                setShowResult(false);
              }}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                currentQuestionIndex === index
                  ? 'bg-blue-500 text-white'
                  : userAnswers[question.id]
                  ? userAnswers[question.id] === question.correctAnswer
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {question.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz; 