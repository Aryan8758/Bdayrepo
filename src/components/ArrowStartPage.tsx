import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, ArrowRight, Target } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ArrowStartPageProps {
  recipientName: string;
  senderName: string;
  age: number;
  onPopSuccess: () => void;
}

export const ArrowStartPage: React.FC<ArrowStartPageProps> = ({
  recipientName,
  senderName,
  age,
  onPopSuccess,
}) => {
  const [pullProgress, setPullProgress] = useState(0); // 0 to 100
  const [isPulling, setIsPulling] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [isPopped, setIsPopped] = useState(false);
  const [teaseMessage, setTeaseMessage] = useState<string>(
    'Dhyan se nishana lagao... kheencho aur release karo!'
  );
  const [missCount, setMissCount] = useState(0);

  const touchStartXRef = useRef<number>(0);

  const missQuotes = [
    'Tumhara aim sahi nahi hai baba, dhyan se dekho! 🎯😂',
    'Aur try karo... tum bel ho kya? Itna bada dil nahi dikh raha? 😂🐂',
    'Tumko nahi dikh raha hai kya mera dil? Seedhe samne hi toh hai! ❤️',
    'Lo mera dil ched do ab toh! Thoda zor se kheencho arrow! 💘',
    'Aise shoot karogi toh cake kaise milega? Ek baar aur try karo! 🎂',
  ];

  const handleShoot = (forceSuccess = false) => {
    if (isFlying || isPopped) return;

    // Check if shot is strong enough or forced
    const isGoodShot = forceSuccess || pullProgress >= 45;

    setIsFlying(true);
    soundEngine.playArrowRelease();

    if (!isGoodShot) {
      // Missed shot animation
      setTimeout(() => {
        soundEngine.playArrowMiss();
        setIsFlying(false);
        setPullProgress(0);
        const nextQuote = missQuotes[missCount % missQuotes.length];
        setTeaseMessage(nextQuote);
        setMissCount((prev) => prev + 1);
      }, 400);
      return;
    }

    // Direct Hit on the Heart!
    setTimeout(() => {
      soundEngine.playHeartPierce();
      setIsHit(true);

      // Arrow pierced through heart for 450ms, then explosive burst
      setTimeout(() => {
        soundEngine.playHeartExplosion();
        setIsPopped(true);
        setIsFlying(false);

        // Grand confetti burst
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#F43F5E', '#EC4899', '#F472B6', '#FB7185', '#FBBF24', '#C084FC'],
        });

        setTimeout(() => {
          soundEngine.playCelebratoryCheer();
        }, 300);
      }, 500);
    }, 450);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isPopped) return;
    setIsPulling(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartXRef.current = clientX;
    soundEngine.playBowPull();
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isPulling || isPopped) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = touchStartXRef.current - clientX;
    const progress = Math.min(100, Math.max(0, delta * 1.1));
    setPullProgress(progress);
  };

  const handleTouchEnd = () => {
    if (!isPulling || isPopped) return;
    setIsPulling(false);
    if (pullProgress > 15) {
      handleShoot();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center select-none">
      {/* Header Badge */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-3 border border-rose-200">
        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        <span>Cupid&apos;s Special Mission for {recipientName}</span>
      </div>

      <h1 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-rose-950 tracking-tight leading-tight mb-2">
        Pop My Heart To Enter ✨
      </h1>

      <p className="text-sm sm:text-base text-rose-800/80 max-w-md mx-auto mb-6">
        Arrow ko piche kheencho aur seedha mere dil par nishana lagao!
      </p>

      {/* Interactive Arena */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-rose-200 shadow-2xl shadow-rose-200/50 relative overflow-hidden">
        {!isPopped ? (
          <div>
            <div
              className="relative h-64 sm:h-76 w-full bg-gradient-to-r from-rose-100/60 via-pink-50/70 to-rose-100/60 rounded-2xl border border-rose-200 flex items-center justify-between px-6 overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Target Heart Balloon */}
              <div
                className={`absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300 ${
                  isHit ? 'scale-125 rotate-12 filter brightness-125' : 'animate-bounce'
                }`}
              >
                <div className="relative">
                  <div className="absolute -inset-3 bg-rose-400/30 rounded-full blur-md animate-pulse" />
                  
                  {/* Heart Shape */}
                  <div className="w-22 h-22 sm:w-26 sm:h-26 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-rose-400/60 relative">
                    <Heart className="w-12 h-12 sm:w-14 sm:h-14 fill-white text-rose-600 drop-shadow-md animate-pulse" />
                    
                    {/* Pierced arrow head if hit */}
                    {isHit && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                        <div className="w-24 h-2 bg-gradient-to-r from-amber-600 to-rose-700 -rotate-12 rounded shadow-lg flex items-center justify-end">
                          <div className="w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-rose-800" />
                        </div>
                      </div>
                    )}

                    <div className="absolute top-3 left-4 w-4 h-6 bg-white/40 rounded-full -rotate-45" />
                    <div className="absolute inset-0 border-2 border-dashed border-white/60 rounded-full animate-spin [animation-duration:8s]" />
                  </div>
                  
                  <div className="w-0.5 h-10 bg-rose-400 mx-auto -mt-1 opacity-70" />
                </div>
                <span className="text-xs font-bold text-rose-900 mt-1">
                  Mera Dil ❤️
                </span>
              </div>

              {/* Cupid's Bow on Left */}
              <div className="relative left-2 sm:left-6 flex items-center">
                <svg width="70" height="130" viewBox="0 0 70 130" className="overflow-visible">
                  {/* Bow Staves */}
                  <path
                    d={`M 15 10 Q ${45 - pullProgress * 0.28} 65 15 120`}
                    fill="none"
                    stroke="#E11D48"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {/* Bow String */}
                  <path
                    d={`M 15 10 L ${15 - pullProgress * 0.42} 65 L 15 120`}
                    fill="none"
                    stroke="#FB7185"
                    strokeWidth="2.5"
                    strokeDasharray="2 1"
                  />
                </svg>

                {/* Arrow */}
                <div
                  className={`absolute left-4 transition-all ${
                    isFlying
                      ? pullProgress >= 45
                        ? 'duration-500 translate-x-[240px] sm:translate-x-[360px] opacity-100'
                        : 'duration-300 translate-x-[110px] translate-y-16 opacity-30 rotate-45'
                      : ''
                  }`}
                  style={{
                    transform: isFlying
                      ? undefined
                      : `translateX(${-pullProgress * 0.38}px)`,
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-16 sm:w-22 h-1.5 bg-gradient-to-r from-amber-600 via-rose-500 to-rose-600 rounded-l shadow-sm" />
                    <div className="w-0 h-0 border-y-5 border-y-transparent border-l-10 border-l-rose-700" />
                    <div className="absolute -left-2 flex flex-col gap-0.5">
                      <div className="w-3.5 h-1.5 bg-pink-400 rotate-12 rounded-sm" />
                      <div className="w-3.5 h-1.5 bg-pink-400 -rotate-12 rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pull Tension Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-rose-800 bg-white/90 px-3.5 py-1 rounded-full border border-rose-200 shadow-xs flex items-center gap-1.5 font-medium">
                <Target className="w-3.5 h-3.5 text-rose-500" />
                <span>Pull Tension: {Math.round(pullProgress)}% {pullProgress < 45 ? '(Thoda aur kheencho!)' : '(Ready to fire!)'}</span>
              </div>
            </div>

            {/* Funny & Romantic Tease Banner */}
            <div className="mt-4 p-3 bg-rose-50 rounded-2xl border border-rose-200/80 text-xs sm:text-sm text-rose-900 font-semibold flex items-center justify-center gap-2 transition-all">
              <span>{teaseMessage}</span>
            </div>

            {/* Shoot Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleShoot(false)}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-700 font-bold text-sm shadow-xs active:scale-95 transition-all"
              >
                <span>Release Arrow 🏹</span>
              </button>

              <button
                type="button"
                onClick={() => handleShoot(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-base shadow-xl shadow-rose-300/60 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Perfect Bullseye! (Lo mera dil ched do) 💘</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-2">
              <Heart className="w-9 h-9 text-rose-500 fill-current animate-pulse" />
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-rose-950">
              Bullseye! Mera Dil Ched Diya Tumne! 💘🎉
            </h3>

            <p className="text-sm text-rose-800/90 max-w-sm mx-auto font-medium">
              Congratulations {recipientName}! Ab chalo sabse pehle birthday cake cut karte hain!
            </p>

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSparkle();
                  onPopSuccess();
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-semibold text-base shadow-xl shadow-rose-300/60 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 animate-bounce"
              >
                <span>Cake first. Obviously. 🎂</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
