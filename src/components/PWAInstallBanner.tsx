import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallBanner = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show after 3 seconds so user can see the app first
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowBanner(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    setShowBanner(false);
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (installed || !showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 lg:bottom-6 left-4 right-4 z-50 max-w-sm mx-auto lg:left-auto lg:right-6 lg:mx-0"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-100 dark:border-indigo-900 overflow-hidden">
            {/* Gradient Top Bar */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* App Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <img
                    src="/icon-192.png"
                    alt="247School"
                    className="w-10 h-10 object-contain rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <Smartphone className="w-7 h-7 text-white hidden" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                        অ্যাপ ইন্সটল করুন!
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        247School আপনার ডিভাইসে অ্যাপ হিসেবে ব্যবহার করুন
                      </p>
                    </div>
                    <button
                      onClick={handleDismiss}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ml-2 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      onClick={handleInstall}
                      size="sm"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs px-4 rounded-xl h-8 font-bold shadow-md flex-1"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      ইন্সটল করুন
                    </Button>
                    <button
                      onClick={handleDismiss}
                      className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2"
                    >
                      পরে
                    </button>
                  </div>
                </div>
              </div>

              {/* Features row */}
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                {[
                  { emoji: '⚡', label: 'দ্রুত' },
                  { emoji: '📴', label: 'অফলাইন' },
                  { emoji: '🔔', label: 'নোটিফিকেশন' },
                ].map(({ emoji, label }) => (
                  <div key={label} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{emoji}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallBanner;
