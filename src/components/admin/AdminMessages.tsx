import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, RefreshCw, Megaphone, UserCircle2, Users, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

export default function AdminMessages() {
  const { user } = useAuth();

  const [messages,   setMessages]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [inputText,  setInputText]  = useState('');
  const [sending,    setSending]    = useState(false);
  const [tab,        setTab]        = useState<'inbox' | 'broadcast'>('inbox');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcasting, setBroadcasting]  = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res  = await fetch(`${API}/messages?role=admin`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const iv = setInterval(fetchMessages, 6000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message as admin reply
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;
    setSending(true);
    const msg = {
      sender_id:   user.id,
      sender_name: user.name || 'Admin',
      sender_role: 'admin',
      receiver_id: 'all',
      text:        inputText,
      timestamp:   new Date().toISOString(),
    };
    setMessages(prev => [...prev, { ...msg, _id: Date.now().toString() }]);
    setInputText('');
    try {
      await fetch(`${API}/messages`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(msg),
      });
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Broadcast to all students/parents
  const handleBroadcast = async () => {
    if (!broadcastText.trim()) { toast.error('Enter a broadcast message'); return; }
    setBroadcasting(true);
    try {
      const res = await fetch(`${API}/messages`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id:   user?.id || 'admin',
          sender_name: user?.name || 'Admin',
          sender_role: 'admin',
          receiver_id: 'broadcast',
          text:        `📢 ANNOUNCEMENT: ${broadcastText}`,
          timestamp:   new Date().toISOString(),
          is_broadcast: true,
        }),
      });
      if (res.ok) {
        toast.success('📢 Broadcast sent to all users!');
        setBroadcastText('');
        await fetchMessages();
      } else {
        toast.error('Failed to broadcast');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setBroadcasting(false);
    }
  };

  const isMe = (senderId: string) => senderId === user?.id;

  // Separate broadcast vs normal messages
  const broadcasts = messages.filter(m => m.is_broadcast);
  const inbox      = messages.filter(m => !m.is_broadcast);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 rounded-xl text-white">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Messages & Broadcast</h2>
            <p className="text-sm text-slate-400">{inbox.length} messages • {broadcasts.length} broadcasts</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'inbox',     label: `💬 Inbox (${inbox.length})` },
            { key: 'broadcast', label: `📢 Broadcast` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key as any)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === key ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-emerald-400'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'inbox' && (
          <Card className="border border-slate-700 shadow-xl rounded-2xl overflow-hidden bg-slate-800/60 flex flex-col h-[600px]">
            <CardHeader className="bg-slate-800/80 border-b border-slate-700 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-100">
                  <Users className="w-4 h-4 text-emerald-400" /> All Conversations
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={fetchMessages} className="text-slate-400 hover:text-white gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-y-auto space-y-3">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <MessageCircle className="w-16 h-16 mb-3 opacity-20" />
                  <p className="font-semibold">No messages yet</p>
                  <p className="text-xs mt-1">Messages from parents/students will appear here</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg._id}
                    className={`flex flex-col max-w-[80%] ${isMe(msg.sender_id) ? 'self-end ml-auto' : 'self-start'}`}>
                    {!isMe(msg.sender_id) && (
                      <div className="flex items-center gap-2 mb-1">
                        <UserCircle2 className="w-5 h-5 text-slate-500" />
                        <span className="text-xs font-bold text-slate-400">
                          {msg.sender_name || msg.sender_id}
                          <span className="ml-1 text-slate-500 font-normal">({msg.sender_role})</span>
                        </span>
                      </div>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.is_broadcast
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isMe(msg.sender_id)
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[10px] text-slate-500 mt-1 ${isMe(msg.sender_id) ? 'text-right' : ''}`}>
                      <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                      {new Date(msg.timestamp).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </CardContent>

            <div className="shrink-0 p-4 border-t border-slate-700 bg-slate-800">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Reply as Admin…"
                  className="flex-1 rounded-full bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                />
                <Button type="submit" disabled={sending || !inputText.trim()}
                  className="rounded-full w-10 h-10 p-0 bg-emerald-500 hover:bg-emerald-600 text-white shrink-0">
                  {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          </Card>
        )}

        {tab === 'broadcast' && (
          <div className="space-y-6">
            <Card className="border-2 border-amber-500/30 shadow-xl rounded-2xl overflow-hidden bg-slate-800/60">
              <CardHeader className="bg-slate-700/50 border-b border-slate-700">
                <CardTitle className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <Megaphone className="w-5 h-5" /> Send Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-slate-400 mb-4">
                  📢 This message will be sent to <strong className="text-slate-200">all students and parents</strong> as an announcement.
                </p>
                <textarea rows={4}
                  placeholder="Type your announcement here…"
                  value={broadcastText}
                  onChange={e => setBroadcastText(e.target.value)}
                  className="w-full border-2 border-amber-500/30 rounded-xl px-4 py-3 text-sm bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
                <Button onClick={handleBroadcast} disabled={broadcasting || !broadcastText.trim()}
                  className="mt-4 bg-amber-500 hover:bg-amber-600 text-white gap-2 px-6">
                  {broadcasting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                  {broadcasting ? 'Sending…' : 'Send Broadcast'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-slate-700 shadow-xl rounded-2xl overflow-hidden bg-slate-800/60">
              <CardHeader className="bg-slate-800/80 border-b border-slate-700">
                <CardTitle className="text-base font-bold text-slate-100">📋 Broadcast History ({broadcasts.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {broadcasts.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <Megaphone className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p>No broadcasts sent yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/50">
                    {broadcasts.slice().reverse().map(b => (
                      <div key={b._id} className="p-5 flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                          <Megaphone className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-200 font-medium">{b.text}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(b.timestamp).toLocaleString()}
                            {b.sender_name && ` · by ${b.sender_name}`}
                          </p>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-400 border-0 shrink-0">Broadcast</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
