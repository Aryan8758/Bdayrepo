import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, Wind, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CakeOption } from '../types';
import { DEFAULT_CAKES } from '../data/initialData';
import { soundEngine } from '../utils/audio';

interface Step2CakeSelectionProps {
  recipientName: string;
  age: number;
  selectedCakeId: string;
  onSelectCake: (cakeId: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2CakeSelection: React.FC<Step2CakeSelectionProps> = ({
  recipientName,
  age,
  selectedCakeId,
  onSelectCake,
  onNext,
  onPrev,
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [hasBlownCandles, setHasBlownCandles] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  const selectedCake = DEFAULT_CAKES.find((c) => c.id === selectedCakeId) || DEFAULT_CAKES[1];

  const handleCakeClick = (cake: CakeOption) => {
    soundEngine.playSparkle();
    onSelectCake(cake.id);
  };

  const handleBlowCandles = () => {
    soundEngine.playCandleBlow();
    setCandlesLit(false);
    setHasBlownCandles(true);
    setWishMade(true);

    // Fire celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F472B6', '#FB7185', '#FDE047', '#C084FC', '#FDA4AF'],
    });

    setTimeout(() => {
      soundEngine.playCelebratoryCheer();
    }, 400);
  };

  const handleRelight = () => {
    soundEngine.playSparkle();
    setCandlesLit(true);
    setHasBlownCandles(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-semibold mb-2.5 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Step 2 · The Birthday Cake</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-rose-950 tracking-tight">
          Choose a Cake for {recipientName}
        </h2>
        <p className="text-sm text-rose-800/80 mt-1 max-w-lg mx-auto">
          Every celebration begins with a decadent sweet confection. Pick your favorite, light the candles, and make a heartfelt wish!
        </p>
      </div>

      {/* Cake Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {DEFAULT_CAKES.map((cake) => {
          const isSelected = cake.id === selectedCake.id;

          return (
            <div
              key={cake.id}
              onClick={() => handleCakeClick(cake)}
              className={`group cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 relative flex flex-col bg-white/90 border ${
                isSelected
                  ? 'border-rose-400 ring-4 ring-rose-200/80 shadow-xl shadow-rose-200/60 scale-[1.02]'
                  : 'border-rose-100/90 hover:border-rose-300 hover:shadow-lg shadow-rose-100/50'
              }`}
            >
              {/* Image Container with Fallback */}
              <div className="relative aspect-[4/3] overflow-hidden bg-rose-100">
                <img
                  src={cake.image}
                  alt={cake.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Graceful fallback to styled visual placeholder
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-rose-900 border border-rose-200/80 shadow-xs">
                  {cake.badge}
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-rose-500 text-white p-1 rounded-full shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-rose-950 group-hover:text-rose-600 transition-colors">
                    {cake.name}
                  </h3>
                  <p className="text-xs font-semibold text-rose-600/90 mt-0.5 mb-2">
                    {cake.flavor}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cake.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{cake.tagline}</span>
                  <button
                    type="button"
                    className={`font-semibold transition-colors ${
                      isSelected ? 'text-rose-600' : 'text-slate-400 group-hover:text-rose-500'
                    }`}
                  >
                    {isSelected ? 'Selected ✓' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Candle Lighting & Make A Wish Ritual */}
      <div className="bg-gradient-to-br from-white/95 to-rose-50/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-xl shadow-rose-200/50 mb-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 text-amber-800 rounded-full text-xs font-semibold mb-3 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Interactive Candle Ceremony</span>
          </div>

          <h3 className="font-serif-luxury text-2xl font-bold text-rose-950 mb-2">
            Make A Wish for Year {age}!
          </h3>
          <p className="text-xs sm:text-sm text-rose-800/80 mb-6">
            Close your eyes, think of the happiest dream for {recipientName}, and blow out the birthday candles.
          </p>

          {/* Candle Stage View */}
          <div className="relative py-6 flex flex-col items-center justify-center">
            {/* Candle Sticks Container */}
            <div className="flex items-end justify-center gap-6 mb-2">
              {[0, 1].map((idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Flame */}
                  <div className="h-8 flex items-center justify-center mb-1">
                    {candlesLit ? (
                      <div className="relative flex flex-col items-center">
                        {/* Glow halo */}
                        <div className="absolute -inset-2 bg-amber-400/40 rounded-full blur-md animate-pulse" />
                        {/* Flame teardrop */}
                        <div className="w-3.5 h-6 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-flame shadow-lg shadow-amber-500/80" />
                        {/* Blue core */}
                        <div className="w-1.5 h-2 bg-sky-300 rounded-full -mt-2 opacity-80" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        {/* Smoke puff */}
                        <div className="w-1 h-3 bg-slate-400/50 rounded-full animate-ping" />
                        <span className="text-[10px] text-slate-400 font-serif-luxury italic">puff~</span>
                      </div>
                    )}
                  </div>

                  {/* Candle Wick */}
                  <div className="w-0.5 h-2 bg-slate-700" />

                  {/* Candle Body */}
                  <div className="w-5 h-16 rounded-t-sm bg-gradient-to-r from-rose-200 via-pink-100 to-rose-300 border border-rose-300/80 shadow-inner flex items-center justify-center relative overflow-hidden">
                    {/* Candle spiral stripes */}
                    <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,transparent_4px,transparent_8px)]" />
                    <span className="font-bold text-xs text-rose-800 relative z-10 tabular-nums">
                      {idx === 0 ? Math.floor(age / 10) : age % 10}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cake Stand Base */}
            <div className="w-52 h-4 bg-gradient-to-r from-rose-200 via-pink-200 to-rose-200 rounded-full shadow-md border border-rose-300/60" />
            <div className="w-24 h-3 bg-rose-100 rounded-b-lg border-x border-b border-rose-300/50 -mt-0.5" />
          </div>

          {/* Candle Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {candlesLit ? (
              <button
                type="button"
                onClick={handleBlowCandles}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-300/50 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Wind className="w-4 h-4" />
                <span>Make a Wish & Blow Out Candles ✨</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRelight}
                  className="px-4 py-2.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Relight Candles</span>
                </button>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                  ✨ Wish registered into the universe!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-800 font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSparkle();
            onNext();
          }}
          className="min-h-[44px] px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-semibold text-sm shadow-md shadow-rose-300/50 flex items-center gap-2 active:scale-98 transition-all"
        >
          <span>Continue to Balloon Pops 🎈</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
