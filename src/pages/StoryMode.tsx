import { useState, useEffect } from 'react';
import { Star, Lock, Play, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { storyProgressApi } from '@/services/api';

const LEVELS = [
  { id:1, emoji:'🔤', title:'Alphabet Island', sub:'Learn A–Z',      color:'#8b5cf6', bg:'#f5f3ff', darkBg:'#2d1b69', route:'/lessons/nursery-english' },
  { id:2, emoji:'🔢', title:'Number Forest',   sub:'Count 1–20',     color:'#3b82f6', bg:'#eff6ff', darkBg:'#1e3a5f', route:'/counting-game' },
  { id:3, emoji:'🧙', title:'Word Wizard',     sub:'Spell words',    color:'#ec4899', bg:'#fdf2f8', darkBg:'#4a1942', route:'/spelling-wizard' },
  { id:4, emoji:'➕', title:'Math Arena',      sub:'Add & subtract', color:'#10b981', bg:'#f0fdf4', darkBg:'#064e3b', route:'/addition-game' },
  { id:5, emoji:'🦁', title:'Animal Kingdom', sub:'Wild animals',    color:'#f59e0b', bg:'#fffbeb', darkBg:'#451a03', route:'/animal-quiz' },
  { id:6, emoji:'🧠', title:'Memory Palace',  sub:'Train memory',    color:'#06b6d4', bg:'#ecfeff', darkBg:'#083344', route:'/memory-match' },
  { id:7, emoji:'🏰', title:'Magic Castle',   sub:'Final boss!',     color:'#f43f5e', bg:'#fff1f2', darkBg:'#4c0519', route:'/multiplication-game' },
];

const W = 320, H = 1380;

const NODES = [
  { id:1, x:230, y:110 }, { id:2, x:90,  y:300 }, { id:3, x:230, y:490 },
  { id:4, x:90,  y:680 }, { id:5, x:230, y:870 }, { id:6, x:90,  y:1060 },
  { id:7, x:160, y:1270 },
];

const SEGMENTS = [
  { to:2, d:'M 230 110 C 230 205, 90 205, 90 300' },
  { to:3, d:'M 90 300 C 90 395, 230 395, 230 490' },
  { to:4, d:'M 230 490 C 230 585, 90 585, 90 680' },
  { to:5, d:'M 90 680 C 90 775, 230 775, 230 870' },
  { to:6, d:'M 230 870 C 230 965, 90 965, 90 1060' },
  { to:7, d:'M 90 1060 C 90 1168, 160 1168, 160 1270' },
];

const DECOS: [number, number, string, number][] = [
  [18,60,'⭐',0.35],[290,80,'🌟',0.3],[10,200,'☁️',0.25],[295,240,'☁️',0.2],
  [15,400,'🌿',0.3],[295,440,'🌿',0.25],[10,600,'🍀',0.3],[300,630,'🌸',0.25],
  [15,800,'⭐',0.3],[290,850,'✨',0.35],[10,1000,'🌙',0.3],[295,1050,'💫',0.3],
  [20,1180,'👑',0.35],[285,1200,'✨',0.3],
];

// localStorage fallback key
const LS_KEY = 'story_progress';
const PEND   = 'story_pending';

type LP   = { stars: number; done: boolean };
type Prog = Record<number, LP>;

const fromLS   = (): Prog => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } };
const isOpen   = (id: number, p: Prog) => id === 1 || !!p[id - 1]?.done;
const totalEarned = (p: Prog) => Object.values(p).reduce((s, v) => s + (v.stars || 0), 0);

// Convert DB levels record (string keys) to numeric Prog
const fromDB = (levels: Record<string, LP>): Prog =>
  Object.fromEntries(Object.entries(levels).map(([k, v]) => [Number(k), v])) as Prog;

// ── Star rating modal ──────────────────────────────────────────────
function StarModal({ lvl, onDone }: { lvl: typeof LEVELS[0]; onDone: (s: number) => void }) {
  const { t }      = useLang();
  const { isDark } = useTheme();
  const [pick, setPick] = useState(0), [hov, setHov] = useState(0);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center"
        style={{ background: isDark ? 'linear-gradient(145deg,#1e1b4b,#0f172a)' : 'white', border: isDark ? '1px solid rgba(139,92,246,0.3)' : 'none' }}>
        <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl"
          style={{ background: isDark ? lvl.darkBg : lvl.bg }}>{lvl.emoji}</div>
        <h2 className="text-2xl font-black mb-1" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{t.wellDone} 🎉</h2>
        <p className="text-sm mb-7" style={{ color: isDark ? '#94a3b8' : '#94a3b8' }}>
          {t.ratePrompt} <b style={{ color: isDark ? '#cbd5e1' : '#475569' }}>{lvl.title}</b>
        </p>
        <div className="flex justify-center gap-4 mb-8">
          {[1,2,3].map(s => (
            <button key={s} onMouseEnter={()=>setHov(s)} onMouseLeave={()=>setHov(0)} onClick={()=>setPick(s)}
              className="transition-all hover:scale-125 active:scale-90">
              <Star className={`w-12 h-12 transition-all ${s<=(hov||pick)?'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_#fbbf24]':isDark?'fill-slate-700 text-slate-600':'fill-slate-100 text-slate-200'}`} />
            </button>
          ))}
        </div>
        <button onClick={()=>pick&&onDone(pick)} disabled={!pick}
          className="w-full py-3.5 rounded-2xl font-black text-white text-base transition-all disabled:opacity-25 active:scale-95"
          style={{ background: pick ? lvl.color : isDark?'#334155':'#94a3b8' }}>
          {t.saveContinue}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function StoryMode() {
  const { t }      = useLang();
  const { isDark } = useTheme();
  const { user }   = useAuth();
  const nav        = useNavigate();

  const [prog,  setProg]  = useState<Prog>({});
  const [sel,   setSel]   = useState<number | null>(null);
  const [modal, setModal] = useState<typeof LEVELS[0] | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Load progress: DB first, fallback to localStorage ──
  useEffect(() => {
    const loadProgress = async () => {
      let p: Prog = fromLS(); // start with local

      if (user?.id) {
        try {
          const dbData = await storyProgressApi.load(user.id);
          if (dbData?.levels && Object.keys(dbData.levels).length > 0) {
            p = fromDB(dbData.levels as Record<string, LP>);
            // Sync to localStorage so offline works too
            localStorage.setItem(LS_KEY, JSON.stringify(p));
          }
        } catch {
          // server offline — use localStorage silently
        }
      }

      setProg(p);

      // Handle pending level rating (returned from a game)
      const raw = localStorage.getItem(PEND);
      if (raw) {
        localStorage.removeItem(PEND);
        const id  = +raw;
        const lvl = LEVELS.find(l => l.id === id);
        if (lvl && !p[id]?.done) { setModal(lvl); setSel(id); return; }
      }

      const first = LEVELS.find(l => isOpen(l.id, p) && !p[l.id]?.done);
      setSel(first?.id ?? 1);
    };

    loadProgress();
  }, [user]);

  // ── Save rating: DB + localStorage ──
  const rate = async (stars: number) => {
    if (!modal) return;
    const levelData: LP = { stars, done: true };
    const u = { ...prog, [modal.id]: levelData };
    setProg(u);
    localStorage.setItem(LS_KEY, JSON.stringify(u));
    setModal(null);

    // Save to DB (non-blocking)
    if (user?.id) {
      setSaving(true);
      try {
        await storyProgressApi.saveLevel(user.id, modal.id, levelData);
      } catch {
        // DB save failed — localStorage already updated, user won't lose progress
        console.warn('Story progress DB save failed, kept in localStorage');
      } finally {
        setSaving(false);
      }
    }

    const nxt = LEVELS.find(l => l.id > modal.id && !u[l.id]?.done);
    setSel(nxt?.id ?? modal.id);
  };

  const selLvl = LEVELS.find(l => l.id === sel);
  const selLP  = sel ? prog[sel] : null;
  const earned = totalEarned(prog);
  const total  = LEVELS.length * 3;

  // ── Theme tokens ──
  const pageBg          = isDark ? 'linear-gradient(160deg,#0f172a 0%,#1e1b4b 50%,#0f0a1e 100%)' : 'linear-gradient(160deg,#f0f4ff 0%,#faf5ff 50%,#fff7ed 100%)';
  const topBarBg        = isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.8)';
  const topBarBorder    = isDark ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.6)';
  const backColor       = isDark ? '#94a3b8' : '#64748b';
  const subColor        = isDark ? '#64748b' : '#94a3b8';
  const trackColor      = isDark ? '#1e293b' : '#f1f5f9';
  const bottomBg        = isDark ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.9)';
  const bottomBorder    = isDark ? 'rgba(139,92,246,0.2)' : 'rgba(241,245,249,1)';
  const levelTitleColor = isDark ? '#f1f5f9' : '#1e293b';
  const levelSubColor   = isDark ? '#64748b' : '#94a3b8';
  const lockedBg        = isDark ? 'rgba(30,41,59,0.8)' : '#f1f5f9';
  const lockedText      = isDark ? '#475569' : '#94a3b8';
  const emptyColor      = isDark ? '#475569' : '#94a3b8';
  const nodeLocked      = isDark ? '#1e293b' : '#f1f5f9';
  const nodeBorderLocked= isDark ? '#334155' : '#e2e8f0';
  const lockedTagColor  = isDark ? '#475569' : '#94a3b8';

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden" style={{ background: pageBg }}>
      {modal && <StarModal lvl={modal} onDone={rate} />}

      {/* ── Top Bar ── */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 backdrop-blur-md shadow-sm"
        style={{ background: topBarBg, borderBottom: `1px solid ${topBarBorder}` }}>
        <Link to="/dashboard">
          <button className="flex items-center gap-1 font-semibold text-sm transition-colors active:scale-95"
            style={{ color: backColor }}>
            <ArrowLeft className="w-5 h-5" /> {t.back}
          </button>
        </Link>
        <div className="text-center">
          <span className="font-black text-base" style={{
            background:'linear-gradient(90deg,#fbbf24,#f97316)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>🗺️ {t.adventureMapTitle}</span>
          <p className="text-[11px] font-medium" style={{ color: subColor }}>
            {earned}/{total} ⭐ {saving && <span className="opacity-60">· saving…</span>}
          </p>
        </div>
        {/* Circular progress */}
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke={trackColor} strokeWidth="4"/>
            <circle cx="20" cy="20" r="16" fill="none" stroke="#f59e0b" strokeWidth="4"
              strokeDasharray={`${(earned/total)*100.5} 100.5`} strokeLinecap="round"/>
          </svg>
          <Star className="absolute inset-0 m-auto w-4 h-4 fill-amber-400 text-amber-400"/>
        </div>
      </div>

      {/* ── Map ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth:'none' }}>
        <div className="relative mx-auto" style={{ width:'100%', maxWidth:`${W}px`, height:`${H}px` }}>
          <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            {DECOS.map(([x,y,d,op],i)=>(
              <text key={i} x={x} y={y} fontSize="22" opacity={isDark?op*0.6:op} fontFamily="system-ui" textAnchor="middle">{d}</text>
            ))}
            {SEGMENTS.map((seg,i)=>{
              const lvl  = LEVELS.find(l=>l.id===seg.to)!;
              const open = isOpen(seg.to,prog);
              const done = !!prog[seg.to]?.done;
              const col  = done||open ? lvl.color : (isDark?'#334155':'#cbd5e1');
              return (
                <g key={i}>
                  {open&&<path d={seg.d} fill="none" stroke={lvl.color} strokeWidth="10" strokeLinecap="round" opacity={isDark?0.15:0.08}/>}
                  <path d={seg.d} fill="none" stroke={col} strokeWidth="5" strokeDasharray="1 14" strokeLinecap="round" opacity={open?1:0.35}/>
                </g>
              );
            })}
          </svg>

          {NODES.map(node=>{
            const lvl    = LEVELS.find(l=>l.id===node.id)!;
            const open   = isOpen(node.id,prog);
            const lp     = prog[node.id];
            const done   = !!lp?.done;
            const current= open&&!done;
            const isSel  = sel===node.id;
            const left   = `${(node.x/W)*100}%`;
            const top    = `${(node.y/H)*100}%`;

            return (
              <button key={node.id} onClick={()=>open&&setSel(node.id)}
                className="absolute flex flex-col items-center transition-all duration-200"
                style={{ left, top, transform:`translate(-50%,-50%) scale(${isSel?1.12:1})`, zIndex:10, cursor:open?'pointer':'not-allowed' }}>

                {current&&(
                  <div className="absolute rounded-full animate-ping pointer-events-none"
                    style={{ width:84,height:84,top:-4,left:-4,background:`${lvl.color}18`,border:`2px solid ${lvl.color}55` }}/>
                )}

                <div className="relative flex items-center justify-center rounded-full"
                  style={{
                    width:76,height:76,
                    background: open ? (isDark ? `radial-gradient(circle at 36% 30%,${lvl.darkBg} 0%,${lvl.darkBg} 40%,${lvl.color}40 100%)` : `radial-gradient(circle at 36% 30%,white 0%,${lvl.bg} 35%,${lvl.color}30 100%)`) : nodeLocked,
                    border:`3.5px solid ${open?lvl.color:nodeBorderLocked}`,
                    boxShadow: isSel ? `0 0 0 5px ${lvl.color}30,0 10px 28px ${lvl.color}50` : done ? `0 4px 16px ${lvl.color}40` : isDark?'0 2px 8px rgba(0,0,0,0.4)':'0 2px 8px rgba(0,0,0,0.05)',
                    opacity: !open?(isDark?0.4:0.5):1,
                    transition:'all 0.25s ease',
                  }}>
                  <div className="absolute rounded-full pointer-events-none"
                    style={{ width:28,height:14,top:9,left:12,background:isDark?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.65)',transform:'rotate(-10deg)' }}/>
                  <span style={{ fontSize:28,lineHeight:1 }}>{open?lvl.emoji:'🔒'}</span>
                  <div className="absolute flex items-center justify-center rounded-full text-white font-black"
                    style={{ fontSize:10,width:22,height:22,top:-5,left:-5,background:open?lvl.color:(isDark?'#334155':'#94a3b8'),border:`2.5px solid ${isDark?'#1e293b':'white'}`,boxShadow:'0 2px 5px rgba(0,0,0,0.3)' }}>
                    {node.id}
                  </div>
                  {done&&(
                    <div className="absolute flex items-center justify-center rounded-full"
                      style={{ width:22,height:22,top:-5,right:-5,background:'#22c55e',border:`2.5px solid ${isDark?'#1e293b':'white'}`,boxShadow:'0 2px 5px rgba(0,0,0,0.2)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3}/>
                    </div>
                  )}
                </div>

                <div className="flex gap-1 mt-2">
                  {[1,2,3].map(s=>(
                    <Star key={s} className={`w-3.5 h-3.5 ${s<=(lp?.stars??0)?'fill-amber-400 text-amber-400':isDark?'fill-slate-700 text-slate-700':'fill-slate-200 text-slate-200'}`}
                      style={{ filter:s<=(lp?.stars??0)?'drop-shadow(0 0 3px #fbbf24)':undefined }}/>
                  ))}
                </div>

                <div className="mt-1.5 px-3 py-1 rounded-xl text-center font-black"
                  style={{ fontSize:9.5,maxWidth:90,lineHeight:1.3,color:open?lvl.color:lockedTagColor,
                    background:isSel?`${lvl.color}22`:(isDark?'rgba(15,23,42,0.75)':'rgba(255,255,255,0.75)'),
                    border:`1px solid ${isSel?`${lvl.color}50`:(isDark?'rgba(139,92,246,0.15)':'rgba(0,0,0,0.05)')}`,
                    backdropFilter:'blur(4px)',boxShadow:isDark?'0 1px 4px rgba(0,0,0,0.3)':'0 1px 4px rgba(0,0,0,0.05)' }}>
                  {lvl.title}
                </div>
                {isSel && (
                  <button
                    onClick={(e)=>{ e.stopPropagation(); localStorage.setItem(PEND, String(lvl.id)); nav(lvl.route); }}
                    className="mt-2 flex items-center gap-1.5 px-5 py-2.5 rounded-full font-black text-white text-xs transition-all active:scale-95 animate-bounce shadow-lg"
                    style={{ background:lvl.color, boxShadow:`0 4px 12px ${lvl.color}60` }}>
                    <Play className="w-3.5 h-3.5 fill-white"/>
                    {lp?.done ? t.playAgainBtn : t.playBtn}
                  </button>
                )}
              </button>
            );
          })}

          <div className="absolute text-center" style={{ left:'50%',bottom:24,transform:'translateX(-50%)' }}>
            <div style={{ fontSize:28,opacity:0.4 }}>🏁</div>
          </div>
        </div>
      </div>


      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
