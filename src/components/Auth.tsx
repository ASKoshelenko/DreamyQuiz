import React from 'react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to DreamyQuiz</h2>
            <p className="text-gray-400">Your personalized learning experience</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c770f0] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c770f0] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={onLogin}
              className="w-full py-3 px-4 bg-[#c770f0] hover:bg-[#b35fd8] text-white font-medium rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#c770f0] focus:ring-opacity-50"
            >
              Sign In
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                For demo purposes, click Sign In to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 