import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileUpload: (content: string, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      setError('Please upload a markdown (.md) file');
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content || content.trim() === '') {
          throw new Error('The file is empty or contains no text');
        }
        onFileUpload(content, file.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error processing file');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
      setIsLoading(false);
    };

    reader.readAsText(file);
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      setError('Please upload a markdown (.md) file');
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content || content.trim() === '') {
          throw new Error('The file is empty or contains no text');
        }
        onFileUpload(content, file.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error processing file');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
      setIsLoading(false);
    };

    reader.readAsText(file);
  }, [onFileUpload]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-full max-w-xl p-8 text-center ${
          isDragActive ? 'bg-blue-50' : 'bg-white'
        } rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl ${
          isDragActive ? 'scale-105' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center space-y-4 cursor-pointer">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-medium text-gray-700">
              {isDragActive ? 'Drop your file here' : 'Upload your questions file'}
            </div>
            <p className="text-gray-500">or click to select</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".md"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </div>
      
      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading your questions...
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg max-w-xl w-full">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center max-w-xl">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <div className="bg-white p-4 rounded-lg shadow text-left">
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Upload your questions in markdown format</li>
            <li>File should have .md extension</li>
            <li>Questions should be formatted according to the template</li>
            <li>You can drag and drop the file or click to select</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 