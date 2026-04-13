
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, Users, Trash2, Trees, Sprout, Waves, Hash, List, Flower } from 'lucide-react';
import { Duck, RaceResult } from '../types';

const DUCK_IMAGE = "https://img.icons8.com/color/96/rubber-duck.png";
const BUSH_IMAGE = "https://pngimg.com/uploads/bush/bush_PNG7214.png";

const DuckRace: React.FC = () => {
  const [inputType, setInputType] = useState<'list' | 'number'>('list');
  const [namesInput, setNamesInput] = useState('');
  const [duckCount, setDuckCount] = useState<number>(10);
  const [trackLength, setTrackLength] = useState<number>(4000);
  const [ducks, setDucks] = useState<(Duck & { duration: number })[]>([]);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<Duck | null>(null);
  const [history, setHistory] = useState<RaceResult[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTournament, setIsTournament] = useState(false);
  const [tournamentRounds, setTournamentRounds] = useState<{ matches: { id: string; participants: string[]; winner?: string }[] }[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sound effects
  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const sounds = {
    start: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    finish: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    quack: 'https://assets.mixkit.co/active_storage/sfx/1006/1006-preview.mp3'
  };

  const startTournament = () => {
    let names: string[] = [];
    if (inputType === 'list') {
      names = namesInput.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
    } else {
      names = Array.from({ length: duckCount }, (_, i) => `Vịt #${i + 1}`);
    }

    if (names.length < 2) {
      alert('Cần ít nhất 2 đấu thủ để tạo bảng đấu!');
      return;
    }

    // Create first round
    const matches = [];
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length; i += 4) {
      matches.push({
        id: Math.random().toString(36).substr(2, 9),
        participants: shuffled.slice(i, i + 4)
      });
    }

    setTournamentRounds([{ matches }]);
    setCurrentRoundIndex(0);
    setCurrentMatchIndex(0);
    setIsTournament(true);
    setWinner(null);
  };

  const startMatch = (participants: string[]) => {
    const newDucks = participants.map((name) => {
      const duration = 8 + Math.random() * 7; 
      
      // Randomly assign a speed profile for excitement
      const rand = Math.random();
      let speedProfile = 'linear';
      if (rand < 0.15) speedProfile = 'miracle'; // Sudden burst at the end
      else if (rand < 0.30) speedProfile = 'slowStart'; // Starts slow, then speeds up
      else if (rand < 0.45) speedProfile = 'fastStart'; // Starts fast, then tires out

      return {
        id: Math.random().toString(36).substr(2, 9),
        name,
        color: '',
        position: 0,
        isWinner: false,
        duration,
        speedProfile,
        visuals: {
          hue: Math.floor(Math.random() * 360),
          scale: 0.8 + Math.random() * 0.4,
          brightness: 90 + Math.random() * 40,
        }
      };
    });

    setDucks(newDucks);
    setWinner(null);
    setIsRacing(true);
    setStartTime(Date.now());
    playSound(sounds.start);
  };

  const handleDuckFinish = (duck: Duck) => {
    if (!isRacing || winner) return;

    setWinner(duck);
    setIsRacing(false);
    setStartTime(null);
    playSound(sounds.finish);

    if (isTournament) {
      const updatedRounds = [...tournamentRounds];
      updatedRounds[currentRoundIndex].matches[currentMatchIndex].winner = duck.name;
      setTournamentRounds(updatedRounds);
    } else {
      setHistory(prev => [{
        id: Date.now().toString(),
        winner: duck.name,
        participants: ducks.map(d => d.name),
        timestamp: Date.now()
      }, ...prev].slice(0, 10));
    }
  };

  const nextTournamentStep = () => {
    const currentRound = tournamentRounds[currentRoundIndex];
    const allMatchesFinished = currentRound.matches.every(m => m.winner);

    if (allMatchesFinished) {
      if (currentRound.matches.length === 1) {
        // Tournament finished
        alert(`Chúc mừng ${currentRound.matches[0].winner} đã vô địch giải đấu!`);
        setIsTournament(false);
        setWinner(null);
        return;
      }

      // Create next round
      const winners = currentRound.matches.map(m => m.winner!);
      const nextMatches = [];
      for (let i = 0; i < winners.length; i += 4) {
        nextMatches.push({
          id: Math.random().toString(36).substr(2, 9),
          participants: winners.slice(i, i + 4)
        });
      }
      setTournamentRounds([...tournamentRounds, { matches: nextMatches }]);
      setCurrentRoundIndex(currentRoundIndex + 1);
      setCurrentMatchIndex(0);
    } else {
      // Move to next match in current round
      setCurrentMatchIndex(currentMatchIndex + 1);
    }
    setWinner(null);
  };

  const startRace = () => {
    let names: string[] = [];
    if (inputType === 'list') {
      names = namesInput.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
    } else {
      names = Array.from({ length: duckCount }, (_, i) => `Vịt #${i + 1}`);
    }

    if (names.length < 2) {
      alert('Vui lòng nhập ít nhất 2 tên hoặc chọn ít nhất 2 con vịt!');
      return;
    }

    startMatch(names);
  };

  const resetRace = () => {
    setDucks([]);
    setWinner(null);
    setIsRacing(false);
  };

  useEffect(() => {
    let animationFrameId: number;
    
    const updateCamera = () => {
      if (isRacing && startTime && scrollContainerRef.current && ducks.length > 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const minDuration = Math.min(...ducks.map(d => d.duration));
        
        // Calculate leading duck position
        const leaderX = 60 + (trackLength - 150 - 60) * Math.min(1, elapsed / minDuration);
        
        // Center the camera on the leader
        const viewportWidth = scrollContainerRef.current.clientWidth;
        const targetScroll = leaderX - viewportWidth / 2;
        
        scrollContainerRef.current.scrollLeft = Math.max(0, targetScroll);
        
        animationFrameId = requestAnimationFrame(updateCamera);
      }
    };

    if (isRacing) {
      animationFrameId = requestAnimationFrame(updateCamera);
      
      // Random quack sounds
      const quackInterval = setInterval(() => {
        if (Math.random() < 0.2) {
          playSound(sounds.quack);
        }
      }, 3000);

      return () => {
        cancelAnimationFrame(animationFrameId);
        clearInterval(quackInterval);
      };
    }
  }, [isRacing, startTime, ducks]);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 space-y-6 overflow-y-auto">
      {/* Input Section */}
      {!isRacing && !winner && !isTournament && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto w-full space-y-6 cute-card p-8 rounded-[50px] z-20 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-4 bg-yellow-100 rounded-full float-animation">
                <Waves className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Duck Race Arena</h2>
                <p className="text-xs text-slate-500 font-medium">Đường đua vịt chuyên nghiệp</p>
              </div>
            </div>
            
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button 
                onClick={() => setInputType('list')}
                className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cute-button ${inputType === 'list' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-4 h-4" /> Tên vịt
              </button>
              <button 
                onClick={() => setInputType('number')}
                className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cute-button ${inputType === 'number' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Hash className="w-4 h-4" /> Số lượng
              </button>
            </div>
          </div>
          
          {inputType === 'list' ? (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 ml-2">Nhập tên các đấu thủ</label>
              <textarea
                value={namesInput}
                onChange={(e) => setNamesInput(e.target.value)}
                placeholder="Ví dụ: Tèo, Tý, Hùng, Dũng..."
                className="w-full h-32 bg-white border-2 border-slate-100 rounded-[25px] p-6 text-slate-700 focus:outline-none focus:border-yellow-300 transition-all resize-none font-medium placeholder:text-slate-300 shadow-inner"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-600 ml-2">Số lượng vịt tham gia</label>
              <div className="flex items-center gap-8">
                <input 
                  type="range" 
                  min="2" 
                  max="100" 
                  value={duckCount}
                  onChange={(e) => setDuckCount(parseInt(e.target.value))}
                  className="flex-1 h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-yellow-500"
                />
                <div className="w-20 h-20 rounded-[25px] bg-slate-50 border-2 border-slate-100 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-yellow-600">{duckCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Con</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-600 ml-2">Độ dài đường đua: {trackLength}m</label>
            <div className="flex items-center gap-8">
              <input 
                type="range" 
                min="2000" 
                max="10000" 
                step="500"
                value={trackLength}
                onChange={(e) => setTrackLength(parseInt(e.target.value))}
                className="flex-1 h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="w-20 h-20 rounded-[25px] bg-slate-50 border-2 border-slate-100 flex flex-col items-center justify-center shadow-sm">
                <span className="text-xl font-bold text-blue-600">{trackLength/1000}km</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 pt-2">
            <button
              onClick={startRace}
              className="bg-gradient-to-br from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 py-6 rounded-[30px] text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-yellow-100 cute-button"
            >
              <Play className="w-6 h-6 fill-current" />
              Bắt đầu đua
            </button>
            <button
              onClick={startTournament}
              className="bg-gradient-to-br from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 py-6 rounded-[30px] text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-100 cute-button"
            >
              <Trophy className="w-6 h-6" />
              Giải đấu
            </button>
          </div>
          <button
            onClick={() => { setNamesInput(''); setDuckCount(10); setTrackLength(4000); }}
            className="w-full py-4 bg-white hover:bg-slate-50 rounded-[25px] text-slate-400 transition-all border-2 border-slate-50 flex items-center justify-center gap-2 text-sm font-bold cute-button"
          >
            <Trash2 className="w-4 h-4" /> Làm mới cài đặt
          </button>
        </motion.div>
      )}
      {/* Tournament Bracket Section */}
      {isTournament && !isRacing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto w-full space-y-12 pb-20"
        >
          <div className="flex items-center justify-between cute-card p-10 rounded-[60px] shadow-2xl">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-yellow-100 rounded-[35px] float-animation">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Giải Đấu Vịt Con</h2>
                <p className="text-sm text-slate-500 font-medium">Tìm kiếm nhà vô địch tốc độ</p>
              </div>
            </div>
            <button 
              onClick={() => setIsTournament(false)}
              className="px-10 py-5 bg-white hover:bg-slate-50 rounded-[30px] text-slate-400 text-sm font-bold border-2 border-slate-100 transition-all cute-button"
            >
              Thoát giải đấu
            </button>
          </div>

          <div className="flex gap-10 overflow-x-auto pb-12 no-scrollbar px-4">
            {tournamentRounds.map((round, rIdx) => (
              <div key={rIdx} className="flex-1 min-w-[360px] space-y-10">
                <div className="flex items-center gap-4 px-6">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center border-2 border-sky-200">
                    <span className="text-sm font-bold text-sky-600">{rIdx + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-sky-500">
                    {rIdx === tournamentRounds.length - 1 && round.matches.length === 1 ? '✨ Chung Kết ✨' : `Vòng ${rIdx + 1}`}
                  </h3>
                </div>

                <div className="space-y-8">
                  {round.matches.map((match, mIdx) => (
                    <div 
                      key={match.id}
                      className={`relative p-8 rounded-[45px] border-4 transition-all ${rIdx === currentRoundIndex && mIdx === currentMatchIndex ? 'bg-white border-sky-300 shadow-2xl shadow-sky-100 scale-105' : 'bg-white/60 border-white opacity-60'}`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-bold text-sky-300 uppercase tracking-widest">Trận {mIdx + 1}</span>
                        {match.winner && (
                          <div className="flex items-center gap-2 px-4 py-1.5 bg-yellow-100 rounded-full border-2 border-yellow-200">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs font-bold text-yellow-600">{match.winner}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {match.participants.map((p, pIdx) => (
                          <div 
                            key={pIdx} 
                            className={`flex items-center justify-between p-4 rounded-[25px] border-2 transition-all ${p === match.winner ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-sky-50'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full ${p === match.winner ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-sky-100'}`} />
                              <span className={`text-sm font-bold ${p === match.winner ? 'text-yellow-600' : 'text-sky-700'}`}>{p}</span>
                            </div>
                            {p === match.winner && <Trophy className="w-4 h-4 text-yellow-500" />}
                          </div>
                        ))}
                      </div>

                      {rIdx === currentRoundIndex && mIdx === currentMatchIndex && !match.winner && (
                        <button
                          onClick={() => startMatch(match.participants)}
                          className="w-full mt-8 py-5 bg-gradient-to-br from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-[30px] transition-all shadow-lg shadow-sky-200 cute-button flex items-center justify-center gap-3"
                        >
                          <Play className="w-5 h-5 fill-current" />
                          Bắt đầu đua thôi!
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {/* Race Track Section */}
      {(isRacing || winner) && (
        <div className="flex-1 flex flex-col space-y-6 min-h-0">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[25px] bg-blue-100 flex items-center justify-center float-animation">
                <Waves className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Đường Đua Xanh</h2>
                <p className="text-sm text-slate-500 font-medium">{ducks.length} đấu thủ đang thi đấu</p>
              </div>
            </div>
            {winner && (
              <button
                onClick={resetRace}
                className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 rounded-[25px] text-slate-600 text-sm font-bold transition-all border-2 border-slate-100 cute-button shadow-sm"
              >
                <RotateCcw className="w-5 h-5" />
                Đua lại
              </button>
            )}
          </div>

            <div 
              ref={scrollContainerRef}
              className="flex-1 bg-white rounded-[60px] border-4 border-sky-50 overflow-x-auto overflow-y-hidden relative scroll-smooth no-scrollbar shadow-inner"
            >
              {/* The actual long track */}
              <div 
                className="h-full relative flex flex-col"
                style={{ width: `${trackLength}px` }}
              >
                {/* Upper Bank */}
                <div className="h-24 grass-pattern border-b-4 border-sky-100 flex items-end px-4 gap-0 sticky top-0 z-20 overflow-hidden">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="shrink-0 -ml-4 first:ml-0"
                      style={{ 
                        transform: `translateY(${Math.sin(i * 0.8) * 12}px) scale(${0.8 + Math.random() * 0.5})`,
                        opacity: 0.9,
                        zIndex: 25 + Math.floor(Math.random() * 10)
                      }}
                    >
                      <img 
                        src={BUSH_IMAGE} 
                        alt="Bush" 
                        className="w-20 h-20 object-contain drop-shadow-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>

                {/* Water Track */}
                <div className="flex-1 water-pattern relative min-h-0">
                  {/* Start Line (Full Height) */}
                  <div className="absolute left-40 top-0 bottom-0 w-16 bg-white/40 backdrop-blur-sm border-x-4 border-white/60 flex flex-col items-center justify-center gap-2 py-4 z-10">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className={`w-8 h-8 ${i % 2 === 0 ? 'bg-pink-100' : 'bg-white'} rounded-lg shrink-0 shadow-sm`} />
                    ))}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-20 -rotate-90 bg-white/80 px-6 py-2 rounded-full border-2 border-pink-100 shadow-sm">
                      <span className="font-bold text-pink-400 uppercase tracking-widest text-xs">Xuất Phát</span>
                    </div>
                  </div>

                  {/* Finish Line (Full Height) */}
                  <div 
                    className="absolute top-0 bottom-0 w-16 bg-white/40 backdrop-blur-sm border-x-4 border-white/60 flex flex-col items-center justify-center gap-2 py-4 z-10"
                    style={{ left: `${trackLength - 150}px` }}
                  >
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className={`w-8 h-8 ${i % 2 === 0 ? 'bg-slate-800' : 'bg-white'} rounded-lg shrink-0 shadow-sm`} />
                    ))}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-20 rotate-90 bg-white/80 px-6 py-2 rounded-full border-2 border-slate-200 shadow-sm">
                      <span className="font-bold text-slate-800 uppercase tracking-widest text-xs">Đích Đến</span>
                    </div>
                  </div>

                  {/* Lanes */}
                  <div className="absolute inset-0 flex flex-col">
                    {ducks.map((_, i) => (
                      <div key={i} className="flex-1 border-b-2 border-white/30 last:border-0 relative" />
                    ))}
                  </div>

                  {/* Ducks */}
                  <div className="relative h-full flex flex-col justify-around py-4 z-30">
                    {ducks.map((duck) => (
                      <motion.div
                        key={duck.id}
                        initial={{ x: 60 }}
                        animate={{ 
                          x: isRacing ? trackLength - 150 : (winner?.id === duck.id ? trackLength - 150 : trackLength - 300 + Math.random() * 100),
                        }}
                        onAnimationComplete={() => handleDuckFinish(duck)}
                        transition={{ 
                          duration: duck.duration,
                          ease: (duck as any).speedProfile === 'miracle' ? [0.9, 0.1, 1, 0.2] : 
                                (duck as any).speedProfile === 'slowStart' ? "easeIn" :
                                (duck as any).speedProfile === 'fastStart' ? "easeOut" : "linear"
                        }}
                        className="relative flex items-center gap-4 z-40 flex-1 min-h-0"
                      >
                        <div className={`flex flex-col items-center justify-center h-full ${isRacing ? 'duck-waddle' : ''}`}>
                          <span className="mb-2 text-[11px] font-bold text-slate-700 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border-2 border-slate-100 whitespace-nowrap shadow-lg z-50">
                            {duck.name}
                          </span>
                          <div className="relative group flex items-center justify-center">
                            <img 
                              src={DUCK_IMAGE} 
                              alt="Duck" 
                              style={{ 
                                height: ducks.length > 20 ? `${Math.max(10, 80 / ducks.length * 4)}vh` : `${4 * (duck.visuals?.scale || 1)}rem`,
                                width: 'auto',
                                filter: `hue-rotate(${duck.visuals?.hue || 0}deg) brightness(${duck.visuals?.brightness || 100}%)`,
                                transform: `scale(${duck.visuals?.scale || 1})`
                              }}
                              className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] object-contain"
                              referrerPolicy="no-referrer"
                            />
                            
                            {winner?.id === duck.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-6 -right-6 z-50"
                              >
                                <Trophy className="w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Lower Bank */}
                <div className="h-24 grass-pattern border-t-4 border-sky-100 flex items-start px-4 gap-0 sticky bottom-0 z-20 overflow-hidden">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="shrink-0 -ml-4 first:ml-0"
                      style={{ 
                        transform: `translateY(${Math.cos(i * 0.8) * 12}px) scale(${0.8 + Math.random() * 0.5})`,
                        opacity: 0.9,
                        zIndex: 25 + Math.floor(Math.random() * 10)
                      }}
                    >
                      <img 
                        src={BUSH_IMAGE} 
                        alt="Bush" 
                        className="w-20 h-20 object-contain drop-shadow-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      )}

      {/* Winner Modal */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border-4 border-slate-50 p-12 rounded-[60px] text-center space-y-10 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300" />
              
              <div className="relative inline-block">
                <img src={DUCK_IMAGE} className="w-40 h-40 mx-auto duck-waddle" alt="Winner" referrerPolicy="no-referrer" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-dashed border-yellow-200 rounded-full -m-12 opacity-50"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-lg font-bold text-yellow-600 uppercase tracking-widest">Người thắng cuộc</h3>
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-7xl font-bold text-slate-800 tracking-tighter leading-none">
                  {winner.name}
                </h2>
              </div>
              
              <p className="text-slate-500 text-lg font-medium">
                Chúc mừng <span className="text-yellow-600 font-bold">{winner.name}</span> đã cán đích đầu tiên!
              </p>
              
              <button
                onClick={isTournament ? nextTournamentStep : resetRace}
                className="w-full py-6 bg-gradient-to-br from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold text-xl rounded-[35px] transition-all shadow-xl shadow-yellow-200 cute-button"
              >
                {isTournament ? 'Tiếp tục giải đấu' : 'Chơi tiếp'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Section */}
      {!isRacing && history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto w-full space-y-8"
        >
          <div className="flex items-center gap-4 ml-4">
            <div className="p-3 bg-yellow-100 rounded-2xl">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">Lịch Sử Đua</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6 bg-white rounded-[40px] border-2 border-slate-50 hover:border-yellow-200 transition-all group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[25px] bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img src={DUCK_IMAGE} className="w-10 h-10" alt="Duck" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-700 tracking-tight leading-none mb-1">{item.winner}</p>
                    <p className="text-xs text-slate-400 font-medium uppercase">{item.participants.length} đấu thủ</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-300 font-bold">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DuckRace;
