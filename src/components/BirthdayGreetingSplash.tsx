import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface BirthdayGreetingSplashProps {
  recipientName: string;
  age: number;
  onNext: () => void;
}

export const BirthdayGreetingSplash: React.FC<BirthdayGreetingSplashProps> = ({
  recipientName,
  age = 22,
  onNext,
}) => {
  useEffect(() => {
    soundEngine.playSparkle();

    // Gentle celebratory pastel confetti burst like in video
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#F43F5E', '#EC4899', '#F472B6', '#FBBF24', '#C084FC', '#FDA4AF'],
    });
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-10 text-center select-none animate-in fade-in duration-700">
      {/* Light aesthetic card matching Koikoi video frame 00:01 */}
      <div className="bg-gradient-to-b from-[#FFF0F5] via-white to-[#FFE4E1] rounded-3xl p-8 sm:p-12 border border-rose-200/90 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between items-center text-slate-800">
        {/* Soft floating background hearts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="absolute text-rose-300/40 text-lg animate-float-slow"
              style={{
                top: `${14 * i}%`,
                left: `${(i * 18) % 85}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        {/* Top Text from Video */}
        <div className="pt-6">
          <p className="font-serif-luxury text-sm sm:text-base text-rose-700/80 font-medium tracking-wide">
            it&apos;s officially your day
          </p>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 tracking-tight leading-tight my-4">
            Happy Birthday, <br />
            {recipientName}
          </h1>

          <p className="font-serif-luxury text-sm sm:text-base text-rose-800/80 mt-2">
            and somehow, you are <span className="font-bold text-rose-950 font-sans">{age}</span> already ✨
          </p>
        </div>

        {/* Cute Flower Bouquet in Corner like in Video */}
        <div className="my-6 relative">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-rose-200/80 bg-rose-50 transform hover:scale-105 transition-transform">
            <img
              src="/src/assets/images/romantic_flower_bouquet_1792678862607.jpg"
              alt="Birthday flower bouquet"
              className="w-full h-full object-cover animate-float-slow"
            />
          </div>
          <span className="text-2xl absolute -bottom-2 -right-2">🌸</span>
        </div>

        {/* Next Button */}
        <div className="w-full pb-2 z-10">
          <button
            type="button"
            onClick={() => {
              soundEngine.playSparkle();
              onNext();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-300/50 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Cake first. Obviously. 🎂</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
