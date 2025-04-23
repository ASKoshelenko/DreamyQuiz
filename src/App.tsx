import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Quiz from './components/Quiz';
import { Question, parseQuestions } from './utils/questionParser';
import './App.css';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileUpload = (content: string, fileName: string) => {
    const parsedQuestions = parseQuestions(content);
    setQuestions(parsedQuestions);
    setFileName(fileName);
    setIsFileUploaded(true);
  };

  const handleReturnToUpload = () => {
    setIsFileUploaded(false);
    setQuestions([]);
    setFileName('');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dreamy Quiz</h1>
        {isFileUploaded && <h2>Current file: {fileName}</h2>}
      </header>
      
      <main className="app-content">
        {!isFileUploaded ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : (
          <Quiz questions={questions} onReturnToUpload={handleReturnToUpload} />
        )}
      </main>
    </div>
  );
}

export default App; 