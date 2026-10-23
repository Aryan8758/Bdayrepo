import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Wind, Sparkles, ArrowRight, Heart, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface VirtualCakeProps {
  recipientName: string;
  age: number;
  onNext: () => void;
}

export const VirtualCake: React.FC<VirtualCakeProps> = ({
  recipientName,
  age = 22,
  onNext,
}) => {
  // Staged building animation for the 3 floors: 0 = building, 1 = Floor 1, 2 = Floor 2, 3 = Floor 3, 4 = Candles placed
  const [buildStep, setBuildStep] = useState(0);
  const [candlesLit, setCandlesLit] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [hasBlown, setHasBlown] = useState(false);
  const [isCut, setIsCut] = useState(false);

  // Trigger smooth step-by-step assembly of the 3 floors and candles
  useEffect(() => {
    setBuildStep(0);
    const t1 = setTimeout(() => {
      setBuildStep(1); // Floor 1
      soundEngine.playSparkle();
    }, 300);

    const t2 = setTimeout(() => {
      setBuildStep(2); // Floor 2
      soundEngine.playSparkle();
    }, 900);

    const t3 = setTimeout(() => {
      setBuildStep(3); // Floor 3
      soundEngine.playSparkle();
    }, 1500);

    const t4 = setTimeout(() => {
      setBuildStep(4); // Candles placed on top
      soundEngine.playSparkle();
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleRebuild = () => {
    soundEngine.playSparkle();
    setBuildStep(0);
    setCandlesLit(true);
    setHasBlown(false);
    setIsCut(false);

    setTimeout(() => setBuildStep(1), 300);
    setTimeout(() => setBuildStep(2), 900);
    setTimeout(() => setBuildStep(3), 1500);
    setTimeout(() => setBuildStep(4), 2100);
  };

  const handleBlow = () => {
    if (isBlowing || !candlesLit) return;
    setIsBlowing(true);
    soundEngine.playCandleBlow();

    // After 900ms of hawa blowing, candles extinguish
    setTimeout(() => {
      setCandlesLit(false);
      setIsBlowing(false);
      setHasBlown(true);

      // Confetti shower
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#F43F5E', '#EC4899', '#F472B6', '#FB7185', '#FBBF24', '#C084FC'],
      });

      setTimeout(() => {
        soundEngine.playCelebratoryCheer();
      }, 350);
    }, 950);
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

  const digit1 = Math.floor(age / 10); // 2
  const digit2 = age % 10;            // 2 (for 22)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 text-center select-none">
      {/* Title */}
      <div className="mb-4">
        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-rose-950 tracking-tight flex items-center justify-center gap-2">
          <span>Cake first. Obviously.</span>
          <span className="text-3xl sm:text-4xl">🎂</span>
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/85 mt-2">
          {buildStep < 4
            ? 'Baking your 3-floor chocolate & cream cake live... 🎂✨'
            : candlesLit
            ? `Make a wish for your ${age}nd birthday (Born 2004) & blow out the candles! 🕯️`
            : isCut
            ? `Happy ${age}nd Birthday Shreya! Pehla slice Aryan ki taraf se 🍰❤️`
            : 'Wish accepted by the universe! Ab cake cut karo meri jaan 🎂'}
        </p>
      </div>

      {/* Virtual 3-Tier Cake Stage Card */}
      <div className="bg-gradient-to-b from-[#1F111B] via-[#160A13] to-[#0D040A] rounded-3xl p-6 sm:p-10 border border-rose-900/50 shadow-2xl relative overflow-hidden text-white min-h-[460px] flex flex-col justify-between items-center">
        {/* Wind Breeze Animation Overlay (Hawa Chale: 🌬️) */}
        {isBlowing && (
          <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-center items-center overflow-hidden bg-sky-500/20 backdrop-blur-xs transition-all duration-300">
            {/* Dynamic Swirling Wind Particles */}
            <div className="w-full flex flex-col gap-6 animate-pulse">
              <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent w-full -translate-x-14 animate-[floatSlow_0.35s_infinite]" />
              <div className="h-1.5 bg-gradient-to-r from-transparent via-sky-300 to-transparent w-full translate-x-14 animate-[floatSlow_0.4s_infinite]" />
              <div className="h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent w-full -translate-x-8 animate-[floatSlow_0.3s_infinite]" />
            </div>

            {/* Visual wind icon and text */}
            <div className="flex items-center gap-2 text-sky-900 text-sm sm:text-base font-extrabold bg-white/95 px-6 py-2.5 rounded-full shadow-2xl border-2 border-sky-300 animate-bounce mt-4">
              <span className="text-2xl animate-spin [animation-duration:1.5s]">🌬️</span>
              <span>Fooooh... Hawa chal rahi hai! 💨</span>
            </div>
          </div>
        )}

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* The 3-Floor Black & White Cream Cake */}
        <div className="relative py-4 w-full flex flex-col items-center justify-end min-h-[340px]">
          {/* STEP 4: Glowing Candles "2" & "2" on top of Floor 3 */}
          <div
            className={`transition-all duration-700 transform flex items-end justify-center gap-6 z-40 mb-[-6px] ${
              buildStep >= 4
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-8 scale-75 pointer-events-none'
            }`}
          >
            {/* Candle 1 (Digit 2) */}
            <div className="flex flex-col items-center">
              {/* Flame */}
              <div className="h-10 flex items-center justify-center mb-0.5">
                {candlesLit ? (
                  <div
                    className={`relative flex flex-col items-center transition-all ${
                      isBlowing ? 'scale-75 -rotate-20 opacity-40' : ''
                    }`}
                  >
                    <div className="absolute -inset-3 bg-amber-400/60 rounded-full blur-md animate-pulse" />
                    <div className="w-4 h-7 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-full animate-flame shadow-xl shadow-amber-500" />
                    <div className="w-1.5 h-2.5 bg-sky-300 rounded-full -mt-2 opacity-80" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center animate-in fade-in duration-300">
                    <div className="w-2 h-5 bg-slate-300/80 rounded-full blur-xs animate-ping" />
                    <span className="text-[10px] text-slate-300 font-serif-luxury italic drop-shadow-md">
                      smoke~
                    </span>
                  </div>
                )}
              </div>
              <div className="w-0.5 h-3 bg-amber-100" />
              {/* Golden Candle 2 */}
              <div className="w-8 h-13 rounded-t-lg bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 border-2 border-amber-300 shadow-xl flex items-center justify-center font-extrabold text-base text-amber-950 tabular-nums">
                {digit1}
              </div>
            </div>

            {/* Candle 2 (Digit 2) */}
            <div className="flex flex-col items-center">
              {/* Flame */}
              <div className="h-10 flex items-center justify-center mb-0.5">
                {candlesLit ? (
                  <div
                    className={`relative flex flex-col items-center transition-all ${
                      isBlowing ? 'scale-75 -rotate-20 opacity-40' : ''
                    }`}
                  >
                    <div className="absolute -inset-3 bg-amber-400/60 rounded-full blur-md animate-pulse" />
                    <div className="w-4 h-7 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-full animate-flame shadow-xl shadow-amber-500" />
                    <div className="w-1.5 h-2.5 bg-sky-300 rounded-full -mt-2 opacity-80" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center animate-in fade-in duration-300">
                    <div className="w-2 h-5 bg-slate-300/80 rounded-full blur-xs animate-ping" />
                    <span className="text-[10px] text-slate-300 font-serif-luxury italic drop-shadow-md">
                      smoke~
                    </span>
                  </div>
                )}
              </div>
              <div className="w-0.5 h-3 bg-amber-100" />
              {/* Golden Candle 2 */}
              <div className="w-8 h-13 rounded-t-lg bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 border-2 border-amber-300 shadow-xl flex items-center justify-center font-extrabold text-base text-amber-950 tabular-nums">
                {digit2}
              </div>
            </div>
          </div>

          {/* STEP 3: FLOOR 3 (Top Tier - Deep Dark Chocolate with White Vanilla Cream Swirls) */}
          <div
            className={`transition-all duration-700 transform z-30 relative ${
              buildStep >= 3
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-12 scale-90 pointer-events-none'
            }`}
          >
            {/* White Cream Rosettes on top rim */}
            <div className="flex justify-around px-3 mb-[-6px] relative z-20">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-5 h-5 bg-gradient-to-b from-white via-[#FFF8F0] to-[#E6DACB] rounded-full shadow-md border border-white/80"
                />
              ))}
            </div>

            {/* Floor 3 Cylinder */}
            <div className="w-40 sm:w-44 h-16 rounded-t-2xl bg-gradient-to-b from-[#1C0E17] via-[#2A1522] to-[#12070E] border-t-2 border-x-2 border-amber-900/60 shadow-xl relative overflow-hidden flex flex-col justify-between p-2">
              {/* Vanilla White Frosting Drips */}
              <div className="flex justify-around w-full">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-3.5 h-4 bg-white/95 rounded-b-full -mt-2 shadow-xs"
                  />
                ))}
              </div>
              <div className="text-center pb-1">
                <span className="text-[10px] font-bold text-amber-200/90 tracking-widest uppercase">
                  Floor 3 · Shreya
                </span>
              </div>
            </div>
          </div>

          {/* White Cream Divider Ribbon between Floor 3 & 2 */}
          {buildStep >= 3 && (
            <div className="w-48 sm:w-52 h-2.5 bg-gradient-to-r from-[#FFF5EA] via-white to-[#FFF5EA] rounded-full border border-amber-200/40 shadow-md z-25 -my-1" />
          )}

          {/* STEP 2: FLOOR 2 (Middle Tier - Ivory White Cream with Rich Dark Chocolate Ganache Drips) */}
          <div
            className={`transition-all duration-700 transform z-20 relative ${
              buildStep >= 2
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-12 scale-90 pointer-events-none'
            }`}
          >
            {/* Floor 2 Cylinder */}
            <div className="w-56 sm:w-60 h-20 rounded-t-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FDF6ED] to-[#F5E8D7] border-t-2 border-x-2 border-amber-200/70 shadow-2xl relative overflow-hidden flex flex-col justify-between p-2 text-slate-800">
              {/* Dark Black-Chocolate Ganache Drips */}
              <div className="flex justify-around w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-6 bg-gradient-to-b from-[#12070E] to-[#2E1625] rounded-b-full -mt-2 shadow-sm"
                  />
                ))}
              </div>

              {/* Gold & Chocolate Plaque */}
              <div className="bg-[#1C0E17] border border-amber-400/80 rounded-xl px-3 py-1 mx-auto shadow-md">
                <span className="text-[11px] font-bold text-amber-200 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>22nd Birthday · Born 2004</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </span>
              </div>
            </div>
          </div>

          {/* White Pearls Divider Ribbon between Floor 2 & 1 */}
          {buildStep >= 2 && (
            <div className="w-64 sm:w-70 h-3 bg-gradient-to-r from-[#FFF5EA] via-white to-[#FFF5EA] rounded-full border border-amber-200/50 shadow-md z-15 -my-1.5" />
          )}

          {/* STEP 1: FLOOR 1 (Base Tier - Bold Dark Black Truffle Sponge with Cream Rosettes) */}
          <div
            className={`transition-all duration-700 transform z-10 relative ${
              buildStep >= 1
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-12 scale-90 pointer-events-none'
            }`}
          >
            <div className="w-72 sm:w-80 h-24 rounded-t-2xl bg-gradient-to-b from-[#140810] via-[#240E1D] to-[#0A0308] border-t-2 border-x-2 border-amber-900/60 shadow-2xl relative overflow-hidden flex flex-col justify-between p-3">
              {/* White Cream Drips */}
              <div className="flex justify-around w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-5 bg-gradient-to-b from-white to-[#F2E4D2] rounded-b-full -mt-3 shadow-xs"
                  />
                ))}
              </div>

              {/* Cut slice line if cut */}
              {isCut && (
                <div className="absolute inset-0 flex items-center justify-center z-30">
                  <div className="bg-rose-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-xl border border-rose-300 animate-bounce">
                    🍰 22nd Birthday Cake Cut With Love!
                  </div>
                </div>
              )}

              <div className="text-center pb-1">
                <span className="font-handwriting text-xl text-rose-300 font-bold tracking-wide">
                  Baked with all my love for Shreya ❤️
                </span>
              </div>
            </div>
          </div>

          {/* Gold Ceramic Pedestal / Cake Stand */}
          <div className="w-80 sm:w-92 h-4 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-full border border-amber-300 shadow-2xl relative z-10" />
          <div className="w-32 h-6 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 rounded-b-2xl border-x border-b border-amber-500 shadow-md" />
        </div>

        {/* Buttons / Interaction */}
        <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-3 relative z-30">
          {buildStep < 4 ? (
            <div className="text-xs text-amber-200/90 bg-white/10 px-4 py-2 rounded-xl animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Building Floor {buildStep + 1} of 3...</span>
            </div>
          ) : candlesLit ? (
            <button
              type="button"
              disabled={isBlowing}
              onClick={handleBlow}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-rose-500 to-pink-500 text-white font-extrabold text-base shadow-xl shadow-rose-900/60 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl">🌬️</span>
              <span>Blow the Candles 💨 (Hawa Chale)</span>
            </button>
          ) : !isCut ? (
            <button
              type="button"
              onClick={handleCutCake}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-extrabold text-base shadow-xl shadow-amber-900/60 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Cut the 22nd Birthday Cake 🍰</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundEngine.playSparkle();
                onNext();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold text-base shadow-xl shadow-rose-900/60 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 animate-bounce"
            >
              <span>Pop 4 Birthday Balloons Next! 🎈</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {/* Replay Assembly Button */}
          {buildStep >= 4 && (
            <button
              type="button"
              onClick={handleRebuild}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
              title="Replay Cake Assembly Animation"
              aria-label="Replay Cake Assembly Animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
