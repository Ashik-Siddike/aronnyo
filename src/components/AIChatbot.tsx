import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, Minimize2, Mic, MicOff, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LangContext';
import { playNarration, stopNarration } from '@/services/audioService';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const quickReplies = [
  { en: "Teach me math 🔢", bn: "গণিত শেখাও 🔢" },
  { en: "Teach me English 📖", bn: "ইংরেজি শেখাও 📖" },
  { en: "Tell a fun fact 🤩", bn: "মজার তথ্য বলো 🤩" },
  { en: "Give me a riddle 🧩", bn: "একটা ধাঁধা দাও 🧩" },
  { en: "Teach me science 🔬", bn: "বিজ্ঞান শেখাও 🔬" },
];

const AIChatbot: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const isBn = lang === 'bn';

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice Agent State
  const [isListening, setIsListening] = useState(false);
  const [speakResponses, setSpeakResponses] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: isBn 
        ? "আসসালামু আলাইকুম! 👋 আমি টুটু টিচার — তোমার AI শিক্ষা সহকারী! 🦉\n\nআমাকে যেকোনো প্রশ্ন করো — গণিত, ইংরেজি, বিজ্ঞান, বা মজার ধাঁধা! 🎓"
        : "Hello! 👋 I am Teacher Tutu — your AI education assistant! 🦉\n\nAsk me any question — Math, English, Science, or fun riddles! 🎓",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  // Handle Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'bn' ? 'bn-BD' : 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          // Auto send after voice input
          setTimeout(() => handleSend(transcript), 600);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  // Speak bot response text helper
  const speakText = async (text: string, messageId: number) => {
    if (speakingMessageId === messageId) {
      stopNarration();
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(messageId);
    await playNarration(text);
    setSpeakingMessageId(null);
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(isBn ? 'দুঃখিত, আপনার ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়।' : 'Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopNarration();
      recognitionRef.current.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
      recognitionRef.current.start();
    }
  };

  // Main chatbot send handler
  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    stopNarration();

    try {
      // Package student profile context
      const studentContext = {
        id: user?.id,
        name: user?.full_name || 'Friend',
        grade: user?.grade_id ? `${user.grade_id} Standard` : 'Nursery',
        stars: user?.total_stars || 0,
        streak: user?.streak || 0
      };

      // Call API Endpoint
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          // Send last 6 messages as history memory
          history: messages.slice(-6).map(m => ({ text: m.text, sender: m.sender })),
          studentContext
        })
      });

      if (!res.ok) throw new Error('Failed to fetch chatbot response');

      const data = await res.json();
      
      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.text || 'Error',
        sender: 'bot',
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);

      // If speakResponses is enabled or input was given via voice, read response aloud
      if (speakResponses || messageText) {
        speakText(botMsg.text, botMsg.id);
      }

    } catch (error) {
      console.error('Chatbot request error:', error);
      setIsTyping(false);

      const errorMsg: Message = {
        id: Date.now() + 1,
        text: isBn 
          ? 'দুঃখিত, সংযোগে কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো! 🤖' 
          : 'Sorry, I am having trouble connecting right now. Please try again! 🤖',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isOpen ? (isMinimized ? 'w-72' : 'w-85 sm:w-96') : 'w-auto'} transition-all duration-300`}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce-gentle group flex items-center justify-center relative"
          title="AI Assistant"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          <span className="absolute -top-9 right-0 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
            🦉 Tutu AI
          </span>
        </button>
      ) : (
        <div 
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-3xl shadow-2xl border border-purple-200/30 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-300"
          style={{ height: isMinimized ? '68px' : '520px' }}
        >
          {/* Header */}
          <div 
            className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue p-4 flex items-center justify-between cursor-pointer select-none"
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl select-none">
                  🦉
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm">Tutu Teacher AI</h3>
                <p className="text-white/80 text-[10px] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {isTyping ? (isBn ? 'ভাবছে...' : 'Thinking...') : (isBn ? 'অনলাইন' : 'Online')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Speak Responses toggle */}
              <button 
                onClick={(e) => { e.stopPropagation(); setSpeakResponses(!speakResponses); }} 
                className={`p-2 rounded-xl transition-all ${speakResponses ? 'bg-white/25 text-yellow-300' : 'text-white/60 hover:bg-white/10'}`}
                title={isBn ? 'অটো অডিও রিড-আউট' : 'Read responses aloud'}
              >
                {speakResponses ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
                className="p-2 text-white/70 hover:bg-white/10 rounded-xl transition-all"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); stopNarration(); setIsOpen(false); }} 
                className="p-2 text-white/70 hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Message Logs */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/20 via-white to-pink-50/10 dark:from-slate-950 dark:to-slate-900 custom-scrollbar">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}>
                    
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm shadow-sm select-none">
                        🦉
                      </div>
                    )}
                    
                    <div className="max-w-[75%] relative group">
                      <div className={`rounded-2xl px-4 py-2.5 shadow-sm leading-relaxed text-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-eduplay-purple to-eduplay-blue text-white rounded-br-none font-bold'
                          : 'bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                        
                        <div className="flex items-center justify-between mt-1 text-[9px] opacity-65 font-bold">
                          <span>
                            {msg.timestamp.toLocaleTimeString(isBn ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          
                          {/* Audio button inside bubble for Bot */}
                          {msg.sender === 'bot' && (
                            <button
                              onClick={() => speakText(msg.text, msg.id)}
                              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition ml-2 ${
                                speakingMessageId === msg.id ? 'text-eduplay-purple animate-pulse' : 'text-slate-400'
                              }`}
                              title={isBn ? 'শুনুন' : 'Listen'}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-end gap-2 justify-start animate-scale-in">
                    <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm shadow-sm">
                      🦉
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center justify-center">
                      <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 bg-eduplay-purple rounded-full animate-bounce" />
                        <div className="w-2.5 h-2.5 bg-eduplay-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2.5 h-2.5 bg-eduplay-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Suggestions */}
              <div className="px-3 py-2.5 border-t border-purple-100/30 dark:border-slate-800 bg-purple-50/10 dark:bg-slate-950/20">
                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide">
                  {quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(isBn ? reply.bn : reply.en)}
                      className="flex-shrink-0 text-[11px] font-black px-3.5 py-2 bg-white dark:bg-slate-800 border border-purple-200/50 dark:border-slate-700 text-eduplay-purple dark:text-purple-400 rounded-full hover:bg-eduplay-purple/10 active:scale-95 transition-all shadow-sm whitespace-nowrap"
                    >
                      {isBn ? reply.bn : reply.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Field Controls */}
              <div className="p-3 border-t border-purple-100/30 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
                
                {/* Voice Record Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-red-500/30 shadow-lg' 
                      : 'bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                  title={isListening ? (isBn ? 'শোনা বন্ধ করুন' : 'Stop listening') : (isBn ? 'ভয়েস ইনপুট' : 'Voice Input')}
                >
                  {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
                </button>

                <div className="flex-1 flex gap-2 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isListening}
                    placeholder={isListening ? (isBn ? 'শুনছি... বলো...' : 'Listening... Speak...') : (isBn ? 'তোমার প্রশ্ন লেখো...' : 'Ask your question...')}
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-eduplay-purple/30 focus:border-eduplay-purple/50 transition-all font-semibold disabled:opacity-50"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isListening}
                    className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue hover:shadow-lg rounded-2xl w-11 h-11 p-0 flex items-center justify-center active:scale-95 transform transition-transform disabled:opacity-40"
                  >
                    <Send className="w-4.5 h-4.5 text-white" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
