import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

export const OfflineFallback = ({ children }: { children: React.ReactNode }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in text-center p-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">ইন্টারনেট সংযোগ নেই</h1>
          <p className="text-gray-600 mb-8 text-lg">
            মনে হচ্ছে আপনার ইন্টারনেট সংযোগ বিচ্ছিন্ন হয়ে গেছে। দয়া করে আপনার কানেকশন চেক করুন।
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full h-14 text-lg rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            আবার চেষ্টা করুন
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
