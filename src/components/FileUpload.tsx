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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-pink-900 flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full">
        <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-xl shadow-2xl p-8 sm:p-12">
          <div
            className={`w-full p-8 text-center ${
              isDragActive ? 'bg-blue-900/30' : 'bg-white/5'
            } rounded-xl border-2 ${
              isDragActive ? 'border-blue-400' : 'border-white/20'
            } transition-all duration-300 ease-in-out transform hover:shadow-xl ${
              isDragActive ? 'scale-105' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className="flex flex-col items-center space-y-6 cursor-pointer">
              <div className="w-20 h-20 bg-blue-500/20 border border-blue-400/40 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="space-y-3">
                <div className="text-2xl font-medium text-white">
                  {isDragActive ? 'Drop your file here' : 'Upload your questions file'}
                </div>
                <p className="text-blue-200">or click to select</p>
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
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg">Loading your questions...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-6 bg-red-900/20 text-red-300 rounded-xl border border-red-500/30">
              <div className="flex items-center">
                <svg className="w-7 h-7 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">{error}</span>
              </div>
            </div>
          )}
          
          <div className="mt-10 text-center">
            <h3 className="text-xl font-semibold mb-4 text-white">Instructions</h3>
            <div className="bg-white/10 p-6 rounded-xl shadow border border-white/10 text-left">
              <ul className="list-disc list-inside space-y-3 text-blue-100">
                <li>Upload your questions in markdown format</li>
                <li>File should have .md extension</li>
                <li>Questions should be formatted according to the template</li>
                <li>You can drag and drop the file or click to select</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 