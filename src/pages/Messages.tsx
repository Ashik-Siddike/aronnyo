import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LangContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, ArrowLeft, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

export default function Messages() {
  const { user } = useAuth();
  const { t } = useLang();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // In a real app we would use Socket.io, here we use polling for simplicity
  const fetchMessages = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API}/messages?userId=${user.id}&role=${user.role}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Simple polling every 5s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    // Optimistic update
    const tempMsg = {
      _id: Date.now().toString(),
      sender_id: user.id,
      sender_name: user.name,
      sender_role: user.role,
      receiver_id: 'admin-1', // Defaulting to an admin/teacher for this prototype
      text: inputText,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setInputText('');

    try {
      await fetch(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempMsg)
      });
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  const isMe = (senderId: string) => senderId === user?.id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-12">
      <div className="bg-eduplay-green text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-2">
            <Link to={user?.role === 'admin' ? "/admin" : (user?.role === 'parent' ? "/parent" : "/dashboard")}>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6" /> {t.messagesTitle}
            </h1>
          </div>
          <p className="opacity-90 ml-14">Chat directly with {user?.role === 'admin' ? 'Parents' : 'Teachers'}.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="border-0 shadow-xl overflow-hidden flex flex-col h-[600px] max-h-[80vh] bg-white dark:bg-slate-900">
          
          <CardHeader className="bg-gray-50 dark:bg-slate-800 border-b">
            <div className="flex items-center gap-3">
              <UserCircle2 className="w-10 h-10 text-gray-400" />
              <div>
                <CardTitle className="text-lg">
                  {user?.role === 'admin' ? 'Parent Support' : 'Teacher / Admin'}
                </CardTitle>
                <p className="text-xs text-green-500 font-bold">{t.online}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-4 overflow-y-auto bg-[url('https://i.pinimg.com/originals/8f/ba/cb/8fbacbd464e996966eb9d4a6b7a9c21e.jpg')] bg-cover bg-center bg-opacity-10 dark:bg-none">
            <div className="space-y-4 flex flex-col">
              {loading && messages.length === 0 ? (
                <div className="text-center text-gray-500 my-auto">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 my-auto bg-white/80 p-4 rounded-xl">
                  {t.noInbox} 👋
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg._id} 
                    className={`flex flex-col max-w-[75%] ${isMe(msg.sender_id) ? 'self-end' : 'self-start'}`}
                  >
                    {!isMe(msg.sender_id) && (
                      <span className="text-[10px] text-gray-500 ml-1 mb-1 font-bold">
                        {msg.sender_name} ({msg.sender_role})
                      </span>
                    )}
                    <div 
                      className={`px-4 py-2 rounded-2xl ${
                        isMe(msg.sender_id) 
                          ? 'bg-eduplay-green text-white rounded-br-none' 
                          : 'bg-white dark:bg-slate-800 border shadow-sm text-gray-800 dark:text-gray-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-[10px] text-gray-400 mt-1 ${isMe(msg.sender_id) ? 'text-right mr-1' : 'ml-1'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <div className="p-4 bg-white dark:bg-slate-800 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.typeMessage} 
                className="flex-1 rounded-full bg-gray-100 dark:bg-slate-700 border-transparent focus-visible:ring-eduplay-green"
              />
              <Button type="submit" className="rounded-full w-10 h-10 p-0 bg-eduplay-green hover:bg-green-600 text-white shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </Card>
      </div>
    </div>
  );
}
