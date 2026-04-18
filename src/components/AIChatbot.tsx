import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const quickReplies = [
  "গণিত শেখাও 🔢",
  "ইংরেজি শেখাও 📖",
  "মজার তথ্য বলো 🤩",
  "একটা ধাঁধা দাও 🧩",
  "বিজ্ঞান শেখাও 🔬",
];

// Smart AI-like responses in Bangla
const getAIResponse = (input: string): string => {
  const lower = input.toLowerCase();
  
  if (lower.includes('গণিত') || lower.includes('math') || lower.includes('যোগ') || lower.includes('বিয়োগ')) {
    const mathFacts = [
      "🔢 তুমি কি জানো? ১ থেকে ১০০ পর্যন্ত সব সংখ্যা যোগ করলে ৫০৫০ হয়! গাউস নামের একজন গণিতবিদ মাত্র ৮ বছর বয়সে এটা আবিষ্কার করেছিলেন! 🧒",
      "➕ চলো একটা মজার যোগ করি! ৩ + ৪ = ৭। এবার তুমি বলো, ৫ + ৬ = কত? আমাদের Addition Game খেলে দেখো! 🎮",
      "📐 তুমি কি জানো ত্রিভুজের তিন কোণের সমষ্টি সবসময় ১৮০°? এটা প্রকৃতিতেও দেখা যায় — মৌমাছির চাক ষড়ভুজ আকৃতির হয়! 🐝",
      "🔢 মজার সংখ্যা তথ্য: ১১ x ১১ = ১২১, ১১১ x ১১১ = ১২৩২১। দেখো কী সুন্দর প্যাটার্ন! ✨"
    ];
    return mathFacts[Math.floor(Math.random() * mathFacts.length)];
  }
  
  if (lower.includes('ইংরেজি') || lower.includes('english') || lower.includes('abc')) {
    const englishFacts = [
      "📖 Did you know? The word 'set' has the most definitions in English — over 430! চলো আমাদের Spelling Wizard গেম খেলো! ✨",
      "🔤 The most common letter in English is 'E'. তোমার নামে কি 'E' আছে? The quick brown fox jumps over the lazy dog — এই বাক্যে A-Z সব letter আছে! 🦊",
      "📚 'Rhythm' is the longest English word without a vowel (a, e, i, o, u)! মজার তাই না? 🎵",
      "🌟 Fun fact: 'Go' is the shortest complete sentence in English! এবার তুমি একটা ছোট sentence বলো! 💬"
    ];
    return englishFacts[Math.floor(Math.random() * englishFacts.length)];
  }
  
  if (lower.includes('বিজ্ঞান') || lower.includes('science') || lower.includes('পৃথিবী')) {
    const scienceFacts = [
      "🔬 তুমি কি জানো? একটি বজ্রপাত সূর্যের পৃষ্ঠের চেয়ে ৫ গুণ বেশি গরম! তাপমাত্রা প্রায় ৩০,০০০ ডিগ্রি! ⚡",
      "🌍 পৃথিবী প্রতি ঘণ্টায় ১,৬৭০ কিলোমিটার বেগে ঘুরছে! কিন্তু আমরা টের পাই না কারণ সবকিছু একসাথে ঘুরছে! 🌎",
      "🦕 ডাইনোসররা ৬.৫ কোটি বছর আগে বিলুপ্ত হয়ে গেছে! কিন্তু মুরগি আসলে ডাইনোসরের বংশধর! 🐔",
      "💧 মানুষের শরীরের ৬০% জল! তাই পানি খাওয়া এত জরুরি। তোমার মস্তিষ্কের ৭৫% ও জল! 🧠"
    ];
    return scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
  }
  
  if (lower.includes('ধাঁধা') || lower.includes('puzzle') || lower.includes('riddle')) {
    const riddles = [
      "🧩 ধাঁধা: আমার রং আছে, কিন্তু ওজন নেই। আমি কে?\n\n💡 উত্তর: ছায়া! 😄",
      "🧩 ধাঁধা: যে যত বড় হয়, তত ছোট হয় — সে কে?\n\n💡 উত্তর: মোমবাতি! 🕯️",
      "🧩 ধাঁধা: ১০০টা পাখি একটা গাছে বসে আছে, একজন শিকারি একটি পাখি মারলো, কয়টা রইলো?\n\n💡 উত্তর: একটিও না! বাকিরা উড়ে গেছে! 🐦",
      "🧩 ধাঁধা: কোন জিনিসটা বাড়লেও কমে?\n\n💡 উত্তর: গর্ত! 🕳️"
    ];
    return riddles[Math.floor(Math.random() * riddles.length)];
  }
  
  if (lower.includes('মজা') || lower.includes('তথ্য') || lower.includes('fun') || lower.includes('fact')) {
    const funFacts = [
      "🤩 মজার তথ্য: একটি অক্টোপাসের ৩টি হৃদপিণ্ড আর নীল রক্ত আছে! 🐙💙",
      "🦒 জিরাফের জিহ্বা ২১ ইঞ্চি লম্বা — তারা নিজের কান পরিষ্কার করতে পারে জিহ্বা দিয়ে! 👅",
      "🍯 মধু কখনো নষ্ট হয় না! ৩,০০০ বছরের পুরনো মধু পাওয়া গেছে যা এখনও খাওয়া যায়! 🐝",
      "🌈 রংধনুতে আসলে ৭টি রং নেই — এটা একটা অবিচ্ছিন্ন বর্ণালী! কিন্তু আমরা ৭টি প্রধান রং দেখি! 🎨",
      "🦋 প্রজাপতি তার পা দিয়ে স্বাদ গ্রহণ করে! 🦶😮"
    ];
    return funFacts[Math.floor(Math.random() * funFacts.length)];
  }
  
  if (lower.includes('হ্যালো') || lower.includes('hello') || lower.includes('হাই') || lower.includes('hi') || lower.includes('hey')) {
    return "হ্যালো! 👋 আমি 247School AI Assistant! আমি তোমাকে গণিত, ইংরেজি, বাংলা আর বিজ্ঞান শেখাতে পারি! কী শিখতে চাও? 🎓✨";
  }
  
  if (lower.includes('নাম') || lower.includes('name') || lower.includes('কে তুমি') || lower.includes('who')) {
    return "আমার নাম 247Bot! 🤖 আমি 247School এর AI Assistant। আমি তোমাকে পড়ালেখায় সাহায্য করি, মজার তথ্য বলি, আর ধাঁধাও দিতে পারি! কী জানতে চাও? 💡";
  }
  
  if (lower.includes('ধন্যবাদ') || lower.includes('thanks') || lower.includes('thank')) {
    return "তোমাকেও ধন্যবাদ! 🙏 তুমি খুব ভালো ছাত্র! প্রতিদিন কিছু নতুন শেখো — এটাই সফলতার চাবি! 🔑✨ আর কিছু জানতে চাইলে বলো!";
  }

  // Default responses
  const defaults = [
    "দারুণ প্রশ্ন! 🌟 আমি তোমাকে গণিত, ইংরেজি, বিজ্ঞান শেখাতে পারি। নিচের বাটন থেকে একটি বিষয় বেছে নাও! 👇",
    "চমৎকার! 😊 247School এ আমরা খেলতে খেলতে শিখি! কোন বিষয়ে তুমি আগ্রহী — গণিত, ইংরেজি নাকি বিজ্ঞান? 📚",
    "তুমি কি জানো যে 247School এ ৪০+ মজার lesson আর ৮টা interactive game আছে? 🎮 চলো একসাথে শিখি!"
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
};

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "আসসালামু আলাইকুম! 👋 আমি 247Bot — তোমার AI শিক্ষা সহকারী! 🤖\n\nআমাকে যেকোনো প্রশ্ন করো — গণিত, ইংরেজি, বিজ্ঞান, বা মজার ধাঁধা! 🎓",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

    const botResponse: Message = {
      id: Date.now() + 1,
      text: getAIResponse(userInput),
      sender: 'bot',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botResponse]);
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now(),
        text: reply,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: getAIResponse(reply),
          sender: 'bot',
          timestamp: new Date(),
        };
        setIsTyping(false);
        setMessages(prev => [...prev, botResponse]);
      }, 800 + Math.random() * 1200);

      setInput('');
    }, 100);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-eduplay-purple to-eduplay-blue p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce-gentle group"
        title="AI Chat Assistant"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          🤖 AI Assistant
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-72' : 'w-80 sm:w-96'} transition-all duration-300`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col" style={{ maxHeight: isMinimized ? '60px' : '520px' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue p-4 flex items-center justify-between cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">247Bot AI Assistant</h3>
              <p className="text-white/70 text-xs flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> 
                {isTyping ? 'টাইপ করছে...' : 'অনলাইন'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <Minimize2 className="w-4 h-4 text-white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white" style={{ maxHeight: '320px', minHeight: '250px' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-eduplay-purple to-eduplay-blue text-white rounded-br-md'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-eduplay-purple rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-eduplay-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-eduplay-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/50">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(reply)}
                    className="flex-shrink-0 text-xs px-3 py-1.5 bg-white border border-eduplay-purple/20 text-eduplay-purple rounded-full hover:bg-eduplay-purple/10 transition-colors whitespace-nowrap"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="তোমার প্রশ্ন লেখো..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-eduplay-purple/30 focus:border-eduplay-purple/50 transition-all"
                />
                <Button
                  onClick={handleSend}
                  size="sm"
                  disabled={!input.trim()}
                  className="bg-gradient-to-r from-eduplay-purple to-eduplay-blue hover:shadow-lg rounded-xl px-3 py-2.5 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatbot;
