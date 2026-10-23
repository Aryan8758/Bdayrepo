import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, PartyPopper, RotateCcw, Volume2, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface GrandCelebrationProps {
  recipientName: string;
  senderName: string;
  age: number;
  onRestart: () => void;
}

export const GrandCelebration: React.FC<GrandCelebrationProps> = ({
  recipientName,
  senderName,
  age,
  onRestart,
}) => {
  useEffect(() => {
    // Start birthday melody & cheer fanfare immediately
    soundEngine.startHappyBirthdayMusic();
    soundEngine.playCelebratoryCheer();

    // Fire initial confetti
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#F43F5E', '#EC4899', '#F472B6', '#FB7185', '#FBBF24', '#C084FC'],
    });
  }, []);

  const fireMoreConfetti = () => {
    soundEngine.playVoiceCheer(recipientName, age);
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#EC4899', '#F472B6', '#FB7185', '#FBBF24', '#C084FC'],
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/95 backdrop-blur-md rounded-3xl p-6 sm:p-12 border border-rose-200 shadow-2xl shadow-rose-200/50 relative overflow-hidden">
        {/* Soft floating background hearts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="absolute text-rose-300/40 text-2xl animate-float-slow"
              style={{
                top: `${14 * idx}%`,
                left: `${(idx * 16) % 85}%`,
                animationDelay: `${idx * 0.6}s`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-md shadow-rose-300">
          <PartyPopper className="w-4 h-4" />
          <span>Official Birthday Celebration</span>
        </div>

        {/* Greeting Text as specified */}
        <div className="max-w-2xl mx-auto my-4">
          <p className="font-serif-luxury text-lg sm:text-2xl text-rose-800 font-medium italic mb-2 tracking-wide">
            it&apos;s officially your day —
          </p>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 tracking-tight leading-tight my-3">
            Happy Birthday, {recipientName}!
          </h1>

          <p className="font-handwriting text-2xl sm:text-4xl text-rose-900 font-bold mt-3">
            and somehow, you are {age} already ✨
          </p>
        </div>

        {/* Visual Showcase: Real Couple Memory & Flower Bouquet */}
        <div className="my-8 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Couple Photo Card */}
          <div className="relative rounded-3xl overflow-hidden p-2 bg-gradient-to-tr from-rose-400 via-pink-300 to-amber-200 shadow-xl shadow-rose-200/60 transform hover:scale-102 transition-transform">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-rose-100">
              <img
                src="/assets/photos/shreya_aryan_together.jpg"
                alt="Aryan and Shreya"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md rounded-xl p-2 text-center border border-rose-200/70 shadow-xs">
                <p className="font-handwriting text-base font-bold text-rose-950">
                  Forever Together ❤️
                </p>
                <p className="text-[10px] text-rose-700">
                  Aryan & Shreya
                </p>
              </div>
            </div>
          </div>

          {/* Cute Dudu Giving Flowers Card (Emoji Gift requested by user) */}
          <div
            onClick={() => {
              soundEngine.playSparkle();
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { x: 0.65, y: 0.6 },
                colors: ['#F472B6', '#FDA4AF', '#FB7185', '#FEF08A'],
              });
            }}
            className="cursor-pointer relative rounded-3xl overflow-hidden p-2 bg-gradient-to-tr from-pink-300 via-rose-200 to-amber-200 shadow-xl shadow-rose-200/60 transform hover:scale-105 active:scale-95 transition-all"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white flex flex-col items-center justify-between p-2">
              {/* Cute Floating Hearts Header */}
              <div className="absolute top-2 left-2 bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-xs">
                <span>Dudu & Flowers 🌸</span>
              </div>

              {/* Dudu Giving Flowers Image */}
              <img
                src="/assets/images/dudu_flowers.png"
                alt="Dudu giving flowers to Shreya"
                className="w-full h-full object-contain animate-float-slow py-1"
              />

              {/* Sweet Caption */}
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-xl p-2 text-center border border-rose-200/70 shadow-sm z-10">
                <p className="font-handwriting text-base font-bold text-rose-950 leading-tight">
                  For My Shreya 🐻🌸
                </p>
                <p className="text-[10px] text-rose-700 font-medium">
                  &ldquo;Ye lo dher saare phool aur dher saara pyaar!&rdquo; 🌹
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Music Playing Notification */}
        <div className="bg-rose-100/70 rounded-2xl p-4 max-w-md mx-auto border border-rose-200/80 flex items-center justify-between gap-3 text-left mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950">
                Birthday Music Box Playing ♪
              </h4>
              <p className="text-[11px] text-rose-800">
                Audio is looping. You can pause or adjust volume below.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fireMoreConfetti}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 shrink-0 transition-colors shadow-xs"
          >
            Yayy! 🎉
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={fireMoreConfetti}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <PartyPopper className="w-4 h-4" />
            <span>Blast Confetti 🎊</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="px-5 py-3.5 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-sm shadow-xs transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Experience Again</span>
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-rose-100 text-xs text-rose-700/80">
          <span>Crafted with boundless devotion by {senderName} for {recipientName} ❤️</span>
        </div>
      </div>
    </div>
  );
};
