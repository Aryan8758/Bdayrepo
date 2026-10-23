import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Volume2, RotateCcw, Share2, PartyPopper, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface Step6SurpriseRevealProps {
  recipientName: string;
  senderName: string;
  age: number;
  hasPoppedHeartBalloon: boolean;
  onBalloonPopped: () => void;
  onRestart: () => void;
}

export const Step6SurpriseReveal: React.FC<Step6SurpriseRevealProps> = ({
  recipientName,
  senderName,
  age,
  hasPoppedHeartBalloon,
  onBalloonPopped,
  onRestart,
}) => {
  const [isPopped, setIsPopped] = useState(hasPoppedHeartBalloon);
  const [pullProgress, setPullProgress] = useState(0); // 0 to 100
  const [isPulling, setIsPulling] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const touchStartXRef = useRef<number>(0);

  // Auto-trigger audio when the celebration screen appears
  useEffect(() => {
    if (isPopped) {
      soundEngine.startHappyBirthdayMusic();
      soundEngine.playCelebratoryCheer();
      launchGrandConfetti();
    }
  }, [isPopped]);

  const launchGrandConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#F43F5E', '#EC4899', '#F472B6', '#FB7185', '#FBBF24', '#C084FC'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const executeShot = () => {
    if (isFlying || isPopped) return;
    setIsFlying(true);
    soundEngine.playArrowRelease();

    setTimeout(() => {
      // Pop balloon
      soundEngine.playHeartExplosion();
      setIsPopped(true);
      setIsFlying(false);
      onBalloonPopped();
    }, 600);
  };

  // Touch and drag handlers for pulling the bow
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsPulling(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartXRef.current = clientX;
    soundEngine.playBowPull();
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isPulling) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = touchStartXRef.current - clientX;
    const progress = Math.min(100, Math.max(0, delta * 0.9));
    setPullProgress(progress);
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;
    setIsPulling(false);
    if (pullProgress > 30) {
      executeShot();
    }
    setPullProgress(0);
  };

  const handleCopyGreeting = () => {
    soundEngine.playSparkle();
    const text = `✨ Happy 23rd Birthday, ${recipientName}! May your year be as bright and beautiful as you are. All my love, ${senderName} ❤️`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 2500);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {!isPopped ? (
        // STAGE 1: Interactive Bow & Arrow Pull Experience
        <div className="bg-gradient-to-b from-white/95 to-rose-50/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-rose-200 shadow-2xl shadow-rose-200/50 text-center relative overflow-hidden">
          {/* Header */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-3 border border-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Interactive Grand Finale</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-rose-950 mb-2">
            Pop the Heart Balloon for {recipientName}!
          </h2>
          <p className="text-xs sm:text-sm text-rose-800/80 max-w-md mx-auto mb-8">
            Pull back Cupid&apos;s arrow and release to pop the giant heart balloon and unlock your grand birthday surprise.
          </p>

          {/* Shooting Range Arena */}
          <div
            className="relative h-64 sm:h-72 w-full max-w-lg mx-auto bg-gradient-to-r from-rose-100/40 via-pink-50/50 to-rose-100/40 rounded-3xl border border-rose-200/80 flex items-center justify-between px-6 overflow-hidden select-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Target Heart Balloon */}
            <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative animate-bounce">
                {/* Glow ring */}
                <div className="absolute -inset-3 bg-rose-400/30 rounded-full blur-md animate-pulse" />

                {/* Beating Heart Balloon */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-rose-400/60 relative">
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-white text-rose-600 drop-shadow-md animate-pulse" />
                  
                  {/* Glare */}
                  <div className="absolute top-3 left-4 w-4 h-6 bg-white/40 rounded-full -rotate-45" />

                  {/* Crosshair Lock */}
                  <div className="absolute inset-0 border-2 border-dashed border-white/60 rounded-full animate-spin [animation-duration:8s]" />
                </div>

                {/* Balloon string */}
                <div className="w-0.5 h-10 bg-rose-400 mx-auto -mt-1 opacity-70" />
              </div>
              <span className="text-[11px] font-bold text-rose-800 mt-1">
                Target: {recipientName}&apos;s Heart
              </span>
            </div>

            {/* Cupid's Bow & Arrow on the left */}
            <div className="relative left-2 sm:left-6 flex items-center">
              {/* Bow Arc */}
              <svg
                width="70"
                height="120"
                viewBox="0 0 70 120"
                className="overflow-visible"
              >
                {/* Bow Limbs */}
                <path
                  d={`M 15 10 Q ${45 - pullProgress * 0.25} 60 15 110`}
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Bow String */}
                <path
                  d={`M 15 10 L ${15 - pullProgress * 0.4} 60 L 15 110`}
                  fill="none"
                  stroke="#FB7185"
                  strokeWidth="2"
                  strokeDasharray="2 1"
                />
              </svg>

              {/* Arrow */}
              <div
                className={`absolute left-4 transition-all ${
                  isFlying
                    ? 'duration-500 translate-x-[260px] sm:translate-x-[360px] opacity-100'
                    : ''
                }`}
                style={{
                  transform: isFlying
                    ? undefined
                    : `translateX(${-pullProgress * 0.35}px)`,
                }}
              >
                {/* Arrow Shaft & Tip */}
                <div className="flex items-center">
                  <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-amber-600 via-rose-500 to-rose-600 rounded-l" />
                  {/* Arrowhead */}
                  <div className="w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-rose-600" />
                  {/* Arrow Fletching Feather */}
                  <div className="absolute -left-2 flex flex-col gap-0.5">
                    <div className="w-3 h-1 bg-pink-400 rotate-12 rounded-sm" />
                    <div className="w-3 h-1 bg-pink-400 -rotate-12 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hint instruction overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-xs text-rose-700/80 bg-white/80 px-3 py-1 rounded-full border border-rose-200">
              Drag left to draw tension ({Math.round(pullProgress)}%) or click Release
            </div>
          </div>

          {/* Quick Shoot Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={executeShot}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-semibold text-base shadow-xl shadow-rose-300/60 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Release Arrow & Pop! 🏹💥</span>
            </button>
          </div>
        </div>
      ) : (
        // STAGE 2: "Happy Birthday, Shreya" Animation Page
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
          {/* Animated Greeting Card */}
          <div className="bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/95 backdrop-blur-md rounded-3xl p-6 sm:p-12 border border-rose-200 shadow-2xl shadow-rose-200/50 text-center relative overflow-hidden">
            {/* Soft floating background hearts */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="absolute text-rose-300/40 text-2xl animate-float-slow"
                  style={{
                    top: `${15 * idx}%`,
                    left: `${(idx * 16) % 85}%`,
                    animationDelay: `${idx * 0.7}s`,
                  }}
                >
                  ❤️
                </div>
              ))}
            </div>

            {/* Sparkle Header */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-md shadow-rose-300">
              <PartyPopper className="w-4 h-4" />
              <span>Official Birthday Celebration</span>
            </div>

            {/* Animated Greeting Text Required:
                "it's officially your day - Happy Birthday, Shreya and somehow, you are 23 already ✨" */}
            <div className="max-w-2xl mx-auto my-4">
              <p className="font-serif-luxury text-lg sm:text-2xl text-rose-800 font-medium italic mb-2 tracking-wide">
                it&apos;s officially your day —
              </p>
              
              <h1 className="font-serif-luxury text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 tracking-tight leading-tight sm:leading-none my-3">
                Happy Birthday, {recipientName}!
              </h1>

              <p className="font-handwriting text-2xl sm:text-4xl text-rose-900 font-bold mt-3">
                and somehow, you are {age} already ✨
              </p>
            </div>

            {/* Animated Flowers / Bouquet Section */}
            <div className="my-8 max-w-sm mx-auto">
              <div className="relative group rounded-3xl overflow-hidden p-2 bg-gradient-to-tr from-rose-300 via-pink-200 to-amber-200 shadow-xl shadow-rose-200/60">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-rose-100">
                  <img
                    src="/src/assets/images/romantic_flower_bouquet_1792678862607.jpg"
                    alt={`Romantic birthday bouquet for ${recipientName}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover animate-float-slow"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  
                  {/* Floating rose petals banner */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-xl p-2.5 text-center border border-rose-200/70 shadow-sm">
                    <p className="font-serif-luxury text-xs sm:text-sm font-bold text-rose-950">
                      A Forever Bouquet for {recipientName} 🌸
                    </p>
                    <p className="text-[11px] text-rose-700">
                      May your 23rd year blossom with unending joy & love
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Celebration Callout */}
            <div className="bg-rose-100/70 rounded-2xl p-4 max-w-md mx-auto border border-rose-200/80 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950">
                    Birthday Melody Playing ♪
                  </h4>
                  <p className="text-[11px] text-rose-800">
                    Background music looping. Control audio anytime using the bar below!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playCelebratoryCheer();
                  launchGrandConfetti();
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 shrink-0 transition-colors shadow-xs"
              >
                Yayy! 🎉
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={launchGrandConfetti}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Blast More Confetti! 🎊</span>
              </button>

              <button
                type="button"
                onClick={handleCopyGreeting}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-sm shadow-xs transition-colors flex items-center gap-2"
              >
                {copiedCard ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Wish Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-rose-500" />
                    <span>Copy Birthday Wish</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playSparkle();
                  setIsPopped(false);
                }}
                className="px-4 py-3 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-slate-600 font-medium text-xs transition-colors flex items-center gap-1.5"
                title="Shoot Bow & Arrow Again"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Shoot Bow Again</span>
              </button>
            </div>
          </div>

          {/* Birthday Summary Card from Sender */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-lg text-center max-w-xl mx-auto">
            <h3 className="font-serif-luxury text-xl font-bold text-rose-950 mb-2">
              With Endless Love & Admiration
            </h3>
            <p className="font-handwriting text-2xl text-rose-600 mb-4">
              Here&apos;s to making year {age} your happiest, brightest chapter yet!
            </p>
            <div className="pt-4 border-t border-rose-100 flex items-center justify-between text-xs text-rose-800 font-medium">
              <span>Celebrated by {senderName}</span>
              <button
                type="button"
                onClick={onRestart}
                className="text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Experience Journey Again</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
