import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ArrowLeft, Heart, Check, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface BalloonItem {
  id: number;
  label: string;
  color: string;
  note: string;
  popped: boolean;
}

interface FourBalloonsPopProps {
  recipientName: string;
  onNext: () => void;
  onPrev: () => void;
}

export const FourBalloonsPop: React.FC<FourBalloonsPopProps> = ({
  recipientName,
  onNext,
  onPrev,
}) => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([
    {
      id: 1,
      label: 'Balloon #1',
      color: 'from-pink-400 to-rose-500',
      note: 'Main bohut khush hu ki tum meri life me ho... sach me agar tum nahi hoti toh shayad mujhe kabhi malum hi nahi chalta what is true love ✨❤️',
      popped: false,
    },
    {
      id: 2,
      label: 'Balloon #2',
      color: 'from-rose-400 to-pink-500',
      note: 'Tumhari ek smile dekh kar mera poora din ban jata hai. Duniya me sabse peaceful aur best feeling tumhare sath rehna hai 🌸',
      popped: false,
    },
    {
      id: 3,
      label: 'Balloon #3',
      color: 'from-fuchsia-400 to-rose-500',
      note: 'Chahe hum kitne bi door kyu na ho, mera dil aur meri har ek heartbeat hamesha sirf tumhare paas hi rahti hai meri jaan 💌',
      popped: false,
    },
    {
      id: 4,
      label: 'Balloon #4',
      color: 'from-rose-500 to-red-500',
      note: 'Happy 22nd Birthday my dearest babe! Tum meri best friend bhi ho aur meri poori duniya bhi. I love you to the moon and back! 💖',
      popped: false,
    },
  ]);

  const poppedCount = balloons.filter((b) => b.popped).length;

  const handlePop = (id: number, e: React.MouseEvent) => {
    const target = balloons.find((b) => b.id === id);
    if (!target || target.popped) return;

    soundEngine.playBalloonPop();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 55,
      spread: 70,
      origin: { x, y },
      colors: ['#F43F5E', '#FB7185', '#F472B6', '#FBBF24', '#C084FC'],
    });

    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
  };

  const handleReset = () => {
    soundEngine.playSparkle();
    setBalloons((prev) => prev.map((b) => ({ ...b, popped: false })));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2.5 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>4 Dil Se Nikli Baatein</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-rose-950 tracking-tight">
          Pop the 4 Balloons, {recipientName}!
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/80 mt-1 max-w-md mx-auto">
          Har ek balloon par tap karo aur dekho Aryan ne aapke liye kya likha hai ✨
        </p>

        {/* Counter and Reset */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="bg-white/90 px-4 py-1.5 rounded-full border border-rose-200 text-xs font-semibold text-rose-900 shadow-xs flex items-center gap-2">
            <span>Popped</span>
            <span className="bg-rose-500 text-white rounded-full px-2 py-0.5 text-[11px] tabular-nums font-bold">
              {poppedCount} / 4
            </span>
          </div>

          {poppedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 transition-colors"
              title="Reset Balloons"
              aria-label="Reset Balloons"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Balloons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {balloons.map((balloon, index) => {
          return (
            <div
              key={balloon.id}
              className="min-h-[220px] flex flex-col items-center justify-center relative select-none"
            >
              {!balloon.popped ? (
                // Unpopped Floating Balloon
                <div
                  onClick={(e) => handlePop(balloon.id, e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handlePop(balloon.id, e as unknown as React.MouseEvent);
                    }
                  }}
                  className="cursor-pointer group flex flex-col items-center animate-float-slow transform transition-transform hover:scale-105 active:scale-95"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div
                    className={`w-28 h-36 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${balloon.color} shadow-lg shadow-rose-300/60 relative flex flex-col items-center justify-center p-3 border-t border-white/40`}
                  >
                    <div className="absolute top-3 left-4 w-5 h-8 bg-white/45 rounded-full rotate-[-25deg] filter blur-[0.5px]" />
                    <div className="absolute top-4 left-6 w-1.5 h-3 bg-white/60 rounded-full rotate-[-25deg]" />

                    <span className="font-serif-luxury text-white text-xs font-bold tracking-wider drop-shadow-sm group-hover:scale-110 transition-transform flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>TAP TO POP</span>
                    </span>

                    <div className="absolute -bottom-1.5 w-3.5 h-2.5 bg-rose-700 rounded-b-sm" />
                  </div>

                  <div className="w-0.5 h-12 bg-gradient-to-b from-rose-400 via-rose-300 to-transparent relative -mt-0.5 opacity-70">
                    <div className="absolute top-2 -left-1 w-2.5 h-2.5 border-l border-b border-rose-300 rounded-bl-full" />
                  </div>

                  <span className="text-[11px] font-semibold text-rose-800 mt-1">
                    {balloon.label}
                  </span>
                </div>
              ) : (
                // Revealed Hinglish Note Card
                <div className="w-full h-full bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-rose-200/90 shadow-lg shadow-rose-200/40 flex flex-col justify-between transition-all animate-in fade-in zoom-in-90 duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{balloon.label}</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Revealed
                    </span>
                  </div>

                  <div className="my-auto py-3">
                    <p className="font-serif-luxury text-base sm:text-lg text-rose-950 leading-relaxed font-semibold">
                      &ldquo;{balloon.note}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 text-right">
                    <span className="font-serif-luxury text-[11px] text-rose-700/70 italic">
                      — Aryan ki taraf se ❤️
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-rose-100/80">
        <button
          type="button"
          onClick={onPrev}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-800 font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cake</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSparkle();
            onNext();
          }}
          className="min-h-[44px] px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-semibold text-sm shadow-md shadow-rose-300/50 flex items-center gap-2 active:scale-98 transition-all"
        >
          <span>See Photo Memories 📸</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
