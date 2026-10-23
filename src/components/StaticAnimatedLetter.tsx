import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface StaticAnimatedLetterProps {
  recipientName: string;
  senderName: string;
  age: number;
  onNext: () => void;
  onPrev: () => void;
}

export const StaticAnimatedLetter: React.FC<StaticAnimatedLetterProps> = ({
  recipientName,
  senderName,
  age,
  onNext,
  onPrev,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenEnvelope = () => {
    soundEngine.playSparkle();
    setIsOpened(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2.5 border border-rose-200">
          <Mail className="w-3.5 h-3.5 text-rose-500" />
          <span>Aryan Ka Personal Birthday Letter</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-rose-950 tracking-tight">
          A Letter for {recipientName} 💌
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/80 mt-1 max-w-md mx-auto">
          Dil se likhi hui baatein jo sirf aur sirf aapke liye hain...
        </p>
      </div>

      {/* Envelope / Parchment Reveal Container */}
      {!isOpened ? (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-rose-200 text-center shadow-2xl shadow-rose-200/50 relative overflow-hidden">
          {/* Animated Envelope Graphic */}
          <div
            className="relative w-36 h-28 mx-auto mb-6 bg-gradient-to-br from-rose-200 via-pink-100 to-rose-200 rounded-2xl border-2 border-rose-300 shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer"
            onClick={handleOpenEnvelope}
          >
            <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-rose-300 to-rose-200 rounded-t-xl [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-xs" />
            <div className="absolute top-8 z-10 w-12 h-12 rounded-full bg-rose-600 text-rose-100 flex items-center justify-center shadow-lg border-2 border-rose-400 animate-pulse">
              <Heart className="w-6 h-6 fill-current" />
            </div>
          </div>

          <h3 className="font-serif-luxury text-2xl font-bold text-rose-950 mb-2">
            An Unopened Letter for {recipientName}
          </h3>
          <p className="text-sm text-rose-800/80 mb-6">
            Sealed with a rose wax seal by {senderName}. Tap below to read Aryan&apos;s message.
          </p>

          <button
            type="button"
            onClick={handleOpenEnvelope}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-semibold text-sm shadow-xl shadow-rose-300/60 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Break Wax Seal & Read Letter 💌</span>
          </button>
        </div>
      ) : (
        <div className="relative bg-[#FFFBF7] rounded-3xl p-6 sm:p-10 border border-amber-200/90 shadow-2xl shadow-rose-200/40 text-slate-800 mb-8 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* Letterhead */}
          <div className="border-b border-amber-200/80 pb-4 mb-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700">
                To My Dearest {recipientName}
              </span>
              <p className="text-xs text-amber-800/70 mt-0.5">
                Celebrating your {age}nd Milestone Birthday (2004 – 2026) ✨
              </p>
            </div>
            {/* Wax Seal Stamp Icon */}
            <div className="w-10 h-10 rounded-full bg-rose-600 text-rose-100 flex items-center justify-center shadow-md border-2 border-rose-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </div>

          {/* Letter Text directly from User's authentic words */}
          <div className="space-y-4 font-serif-luxury text-base sm:text-lg text-slate-800 leading-relaxed sm:leading-loose whitespace-pre-line">
            <p className="font-bold text-rose-950 text-lg sm:text-xl">
              Happy b&apos;day my babe ❤️
            </p>

            <p>
              Happy birthday day you are my dearest friend 🎉
            </p>

            <p>
              I don&apos;t know me kitna pyar kar paunga tumko but me sach me bohut karta hu...
            </p>

            <p>
              Meri bohut iccha thi ki me is bday par aoo sath me cake karu but destiny Kya bolu cake cut toh dur ki baat me dekh bi nhi sakta tumko..
            </p>

            <p>
              I hope tumko mere gift acha Lage me chhata hu me tumre pass rahe hai isliye thodi thodi chiz deta rahta hu..
            </p>

            <p>
              Mujhe nhi malum kya bolu kya nhi kyuki mujhe bolne se jyada karne ki ichha hai i don&apos;t tumko me de pao kuch ek chhoti si gift aur hai le Lena na mat bolna..
            </p>

            <p className="italic text-rose-900 font-medium">
              I hope next year aur ache se mann pau bday tumra ✨
            </p>

            <p className="font-bold text-rose-950 pt-2">
              Happy b&apos;day b&apos;day girl 😍
            </p>
          </div>

          {/* Handwritten Sign-off */}
          <div className="mt-8 pt-4 border-t border-amber-200/80 flex items-center justify-between">
            <span className="font-handwriting text-2xl sm:text-3xl text-rose-700 font-bold">
              I love you, your man 🤌🏻❤️
            </span>
            <span className="text-xs text-amber-800/80 italic font-serif-luxury">
              — {senderName}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-rose-100/80">
        <button
          type="button"
          onClick={onPrev}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-800 font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Memories</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSparkle();
            onNext();
          }}
          className="min-h-[44px] px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-semibold text-sm shadow-md shadow-rose-300/50 flex items-center gap-2 active:scale-98 transition-all"
        >
          <span>Grand Birthday Finale ✨</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
