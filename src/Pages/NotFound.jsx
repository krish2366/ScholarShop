import React from 'react';
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react';

export default function NotFoundPage() {
  const handleGoHome = () => {
    // Replace with your routing logic
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FFF4DC' }}>
      <div className="max-w-2xl mx-auto text-center">
        
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold mb-4" style={{ color: '#F47C26' }}>
            404
          </h1>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#F47C26' }}></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#333333' }}>
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl mb-6" style={{ color: '#333333', opacity: 0.7 }}>
            Oops! The page you're looking for seems to have wandered off. 
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-12">
          <div className="w-64 h-64 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F47C26', opacity: 0.1 }}>
                <Search size={48} style={{ color: '#F47C26' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#333333', opacity: 0.6 }}>
                Looking everywhere...
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#F47C26' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#F47C26'}
          >
            <Home size={20} />
            Go Home
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
            style={{ 
              color: '#333333', 
              borderColor: '#F47C26',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F47C26';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#333333';
            }}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

