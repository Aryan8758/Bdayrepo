import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Wind, ArrowRight, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface KoikoiCakeProps {
  recipientName: string;
  age: number;
  onNext: () => void;
}

export const KoikoiCake: React.FC<KoikoiCakeProps> = ({
  recipientName,
  age = 22,
  onNext,
}) => {
  // Staged building animation:
  // 0: "Baking something sweet..."
  // 1: Tier 1 (bottom) drops in
  // 2: Tier 2 (middle) drops in
  // 3: Tier 3 (top) drops in
  // 4: Tall Candle drops in & lights up with bright flame!
  const [dropStage, setDropStage] = useState(0);
  const [candleLit, setCandleLit] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [hasBlown, setHasBlown] = useState(false);
  const [isCut, setIsCut] = useState(false);

  useEffect(() => {
    runAssemblyAnimation();
  }, []);

  const runAssemblyAnimation = () => {
    setDropStage(0);
    setCandleLit(true);
    setHasBlown(false);
    setIsCut(false);

    const t1 = setTimeout(() => {
      setDropStage(1);
      soundEngine.playSparkle();
    }, 400);

    const t2 = setTimeout(() => {
      setDropStage(2);
      soundEngine.playSparkle();
    }, 1000);

    const t3 = setTimeout(() => {
      setDropStage(3);
      soundEngine.playSparkle();
    }, 1600);

    const t4 = setTimeout(() => {
      setDropStage(4);
      soundEngine.playSparkle();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  };

  const handleBlowCandle = () => {
    if (isBlowing || !candleLit) return;
    setIsBlowing(true);
    soundEngine.playCandleBlow();

    // After 850ms of "Fooooh! 💨", candle extinguishes
    setTimeout(() => {
      setCandleLit(false);
      setIsBlowing(false);
      setHasBlown(true);

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#F43F5E', '#EC4899', '#F472B6', '#FDE047', '#C084FC', '#FDA4AF'],
      });

      setTimeout(() => {
        soundEngine.playCelebratoryCheer();
      }, 300);
    }, 850);
  };

  const handleCutCake = () => {
    soundEngine.playSparkle();
    setIsCut(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 text-center select-none">
      {/* Exact Header matching Video Frame 00:06: "First things first 🎂" */}
      <div className="mb-4">
        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <span>First things first</span>
          <span className="text-3xl">🎂</span>
        </h2>
        <p className="text-xs text-rose-200/80 mt-1.5">
          {dropStage < 4
            ? 'Baking something sweet... ✨'
            : candleLit
            ? `Make a wish for your ${age}nd birthday & blow out the candle! 🕯️`
            : isCut
            ? 'First sweet slice cut for Shreya with pure love 🍰❤️'
            : 'Wish accepted! Ab cake cut karo meri jaan 🎂'}
        </p>
      </div>

      {/* Dark Plum Cake Stage Card matching Video */}
      <div
        onClick={() => {
          if (dropStage >= 4 && candleLit && !isBlowing) {
            handleBlowCandle();
          }
        }}
        className="cursor-pointer bg-gradient-to-b from-[#2B1425] via-[#220E1C] to-[#160712] rounded-3xl p-6 sm:p-8 border border-rose-900/60 shadow-2xl relative overflow-hidden text-white min-h-[500px] flex flex-col justify-between items-center"
      >
        {/* Floating Fairy Lights & Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-200/40 rounded-full animate-ping"
              style={{
                top: `${12 * i}%`,
                left: `${(i * 17) % 85}%`,
                animationDuration: `${2 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Wind Breeze Animation Overlay (Hawa Chale: Fooooh! 💨) */}
        {isBlowing && (
          <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-center items-center overflow-hidden bg-sky-500/20 backdrop-blur-xs transition-all duration-300">
            <div className="w-full flex flex-col gap-6 animate-pulse">
              <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent w-full -translate-x-14 animate-[floatSlow_0.35s_infinite]" />
              <div className="h-1.5 bg-gradient-to-r from-transparent via-sky-300 to-transparent w-full translate-x-14 animate-[floatSlow_0.4s_infinite]" />
            </div>

            <div className="flex items-center gap-2 text-yellow-300 text-3xl font-handwriting font-bold drop-shadow-[0_0_12px_rgba(253,224,71,0.8)] animate-bounce mt-4">
              <span className="text-3xl">🌬️</span>
              <span>Fooooh! 💨</span>
            </div>
          </div>
        )}

        {/* Cake + Candle Arena */}
        <div className="relative py-2 w-full flex flex-col items-center justify-end min-h-[360px]">
          {/* TALL PROMINENT CANDLE (Matching Video Frame 00:07) */}
          <div
            className={`transition-all duration-700 transform flex flex-col items-center z-40 mb-[-4px] ${
              dropStage >= 4
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-16 scale-50 pointer-events-none'
            }`}
          >
            {/* Realistic Candle Flame with Halo */}
            <div className="h-12 flex items-center justify-center mb-0.5 relative">
              {candleLit ? (
                <div
                  className={`relative flex flex-col items-center transition-all ${
                    isBlowing ? 'scale-75 -rotate-25 opacity-35' : ''
                  }`}
                >
                  {/* Warm Glowing Halo */}
                  <div className="absolute -inset-4 bg-amber-400/50 rounded-full blur-md animate-pulse" />
                  
                  {/* Outer Flame Teardrop */}
                  <div className="w-4.5 h-8 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-full animate-flame shadow-2xl shadow-amber-500" />
                  
                  {/* Inner Blue Core */}
                  <div className="w-2 h-3 bg-sky-300 rounded-full -mt-2.5 opacity-90" />
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in fade-in duration-300">
                  <div className="w-2 h-6 bg-slate-300/80 rounded-full blur-xs animate-ping" />
                  <span className="text-[10px] text-slate-300 font-serif-luxury italic drop-shadow-md">
                    smoke~
                  </span>
                </div>
              )}
            </div>

            {/* Candle Wick */}
            <div className="w-0.5 h-3 bg-amber-200" />

            {/* Tall Birthday Candle Body with Spiral Stripes */}
            <div className="w-4 h-16 rounded-t-sm bg-gradient-to-r from-pink-100 via-white to-pink-100 border border-rose-300 shadow-xl relative overflow-hidden flex flex-col justify-center items-center">
              {/* Pink candy cane spiral stripes */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#F43F5E,#F43F5E_4px,transparent_4px,transparent_9px)] opacity-60" />
            </div>

            {/* Candle Base Ring */}
            <div className="w-6 h-1.5 bg-yellow-300 rounded-full -mt-0.5 shadow-sm border border-yellow-400 z-10" />
          </div>

          {/* SVG 3-Tier Isometric Pink Cake with White/Yellow Icing Drips */}
          <div className="relative w-72 sm:w-80 h-64 flex items-center justify-center">
            <svg
              viewBox="0 0 320 260"
              className="w-full h-full overflow-visible drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
            >
              <defs>
                <linearGradient id="pinkFront" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#DB2777" />
                </linearGradient>

                <linearGradient id="pinkTop" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FBCFE8" />
                  <stop offset="100%" stopColor="#F472B6" />
                </linearGradient>

                <linearGradient id="yellowDrip" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFF" />
                  <stop offset="100%" stopColor="#FEF08A" />
                </linearGradient>

                <filter id="shadowDrip" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#9D174D" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* TIER 1 (Bottom, Wide Tier) */}
              <g
                className={`transition-all duration-700 ease-out ${
                  dropStage >= 1
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-20 pointer-events-none'
                }`}
                style={{ transformOrigin: 'center bottom' }}
              >
                <ellipse cx="160" cy="245" rx="130" ry="18" fill="rgba(0,0,0,0.4)" />
                <ellipse cx="160" cy="235" rx="122" ry="15" fill="#FCE7F3" opacity="0.3" />

                <path
                  d="M 45 175
                     A 115 26 0 0 0 275 175
                     L 275 225
                     A 115 26 0 0 1 45 225
                     Z"
                  fill="url(#pinkFront)"
                />
                <ellipse cx="160" cy="175" rx="115" ry="26" fill="url(#pinkTop)" />

                {/* White Drips Tier 1 */}
                <path
                  d="M 45 175
                     A 115 26 0 0 0 275 175
                     C 270 188, 260 198, 250 188
                     C 242 180, 235 205, 225 205
                     C 215 205, 210 185, 200 185
                     C 190 185, 185 210, 175 210
                     C 165 210, 160 185, 150 185
                     C 140 185, 135 205, 125 205
                     C 115 205, 110 185, 100 185
                     C 90 185, 80 202, 70 202
                     C 60 202, 52 185, 45 175 Z"
                  fill="url(#yellowDrip)"
                  filter="url(#shadowDrip)"
                />
              </g>

              {/* TIER 2 (Middle Tier) */}
              <g
                className={`transition-all duration-700 ease-out ${
                  dropStage >= 2
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-24 pointer-events-none'
                }`}
                style={{ transformOrigin: 'center bottom' }}
              >
                <path
                  d="M 70 115
                     A 90 22 0 0 0 250 115
                     L 250 160
                     A 90 22 0 0 1 70 160 Z"
                  fill="url(#pinkFront)"
                />
                <ellipse cx="160" cy="115" rx="90" ry="22" fill="url(#pinkTop)" />

                {/* White Drips Tier 2 */}
                <path
                  d="M 70 115
                     A 90 22 0 0 0 250 115
                     C 245 128, 235 138, 225 128
                     C 218 120, 210 145, 200 145
                     C 190 145, 185 125, 175 125
                     C 165 125, 158 148, 145 148
                     C 135 148, 130 125, 120 125
                     C 110 125, 102 142, 92 142
                     C 82 142, 75 125, 70 115 Z"
                  fill="url(#yellowDrip)"
                  filter="url(#shadowDrip)"
                />
              </g>

              {/* TIER 3 (Top Tier) */}
              <g
                className={`transition-all duration-700 ease-out ${
                  dropStage >= 3
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-28 pointer-events-none'
                }`}
                style={{ transformOrigin: 'center bottom' }}
              >
                <path
                  d="M 100 65
                     A 60 16 0 0 0 220 65
                     L 220 105
                     A 60 16 0 0 1 100 105 Z"
                  fill="url(#pinkFront)"
                />
                <ellipse cx="160" cy="65" rx="60" ry="16" fill="url(#pinkTop)" />

                {/* White Drips Tier 3 */}
                <path
                  d="M 100 65
                     A 60 16 0 0 0 220 65
                     C 215 76, 208 85, 198 76
                     C 192 70, 185 92, 175 92
                     C 165 92, 160 75, 150 75
                     C 140 75, 132 94, 122 94
                     C 112 94, 105 75, 100 65 Z"
                  fill="url(#yellowDrip)"
                  filter="url(#shadowDrip)"
                />

                {/* White Cream Pearls on Top Tier */}
                <circle cx="108" cy="65" r="4.5" fill="#FFF" />
                <circle cx="128" cy="74" r="5" fill="#FFF" />
                <circle cx="150" cy="78" r="5.5" fill="#FFF" />
                <circle cx="170" cy="78" r="5.5" fill="#FFF" />
                <circle cx="192" cy="74" r="5" fill="#FFF" />
                <circle cx="212" cy="65" r="4.5" fill="#FFF" />
              </g>

              {/* Cut line if cut */}
              {isCut && (
                <line
                  x1="160"
                  y1="50"
                  x2="160"
                  y2="225"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>

          {/* Subtitle from Video */}
          <div className="mt-2 text-center">
            <span className="text-xs text-amber-200/90 font-medium tracking-wide bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
              {dropStage < 4 ? 'Baking something sweet...' : 'Tap anywhere & make a wish 🕯️'}
            </span>
          </div>

          {/* Slice Cut Banner */}
          {isCut && (
            <div className="mt-3 bg-rose-500/95 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-xl border border-rose-300 animate-bounce">
              🍰 22nd Birthday Cake Cut With Love!
            </div>
          )}
        </div>

        {/* Buttons / Controls */}
        <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-3 relative z-30">
          {dropStage < 4 ? (
            <div className="text-xs text-amber-200 bg-white/10 px-4 py-2 rounded-xl animate-pulse">
              Baking layer by layer... ✨
            </div>
          ) : candleLit ? (
            <button
              type="button"
              disabled={isBlowing}
              onClick={(e) => {
                e.stopPropagation();
                handleBlowCandle();
              }}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-400 via-rose-500 to-pink-500 text-white font-extrabold text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Wind className="w-4 h-4 animate-pulse" />
              <span>Blow the Candle 💨 (Hawa Chale)</span>
            </button>
          ) : !isCut ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCutCake();
              }}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-extrabold text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Cut the Birthday Cake 🍰</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playSparkle();
                onNext();
              }}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 animate-bounce"
            >
              <span>Pop the Balloons Next! 🎈</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {dropStage >= 4 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                runAssemblyAnimation();
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
              title="Replay Cake Falling Animation"
              aria-label="Replay Cake Falling Animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
