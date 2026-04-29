import { useState, useRef, useEffect } from 'react';
import { Bell, BellRing, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { Link } from 'react-router-dom';

const typeIcon = (type: Notification['type']) => {
  const icons: Record<Notification['type'], string> = {
    achievement: '🏆', attendance: '📋', quiz: '📝', lesson: '📚', system: '🔔'
  };
  return icons[type] || '🔔';
};

const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'এইমাত্র';
  if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ঘন্টা আগে`;
  return `${Math.floor(diff / 86400)} দিন আগে`;
};

const NotificationBell = () => {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        {unreadCount > 0
          ? <BellRing className="w-6 h-6 text-yellow-400 animate-swing" />
          : <Bell className="w-6 h-6 text-gray-500 dark:text-gray-300" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-96 max-w-[92vw] z-50 rounded-2xl shadow-2xl overflow-hidden border border-white/10
          bg-white dark:bg-slate-900">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5" />
              <span className="font-bold">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{unreadCount} new</span>
              )}
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} title="Mark all read" className="hover:bg-white/10 p-1.5 rounded-lg transition">
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button onClick={clearAll} title="Clear all" className="hover:bg-white/10 p-1.5 rounded-lg transition">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">কোনো notification নেই</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                    ${n.read
                      ? 'bg-white dark:bg-slate-900'
                      : 'bg-indigo-50 dark:bg-indigo-950/40'}
                    hover:bg-gray-50 dark:hover:bg-slate-800`}
                >
                  <span className="text-2xl flex-shrink-0">{typeIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-indigo-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800/50 text-center">
              <span className="text-xs text-gray-400">{notifications.length} total notifications</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
