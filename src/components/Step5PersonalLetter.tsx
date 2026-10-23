import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Heart, Mail, Edit3, Check, Volume2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface Step5PersonalLetterProps {
  recipientName: string;
  senderName: string;
  age: number;
  letterContent: string;
  onUpdateLetter: (content: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step5PersonalLetter: React.FC<Step5PersonalLetterProps> = ({
  recipientName,
  senderName,
  age,
  letterContent,
  onUpdateLetter,
  onNext,
  onPrev,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(letterContent);
  const [isOpened, setIsOpened] = useState(true);

  const handleSave = () => {
    soundEngine.playSparkle();
    onUpdateLetter(content);
    setIsEditing(false);
  };

  const handleEnvelopeOpen = () => {
    soundEngine.playSparkle();
    setIsOpened(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-semibold mb-2.5 border border-rose-200">
          <Mail className="w-3.5 h-3.5 text-rose-500" />
          <span>Step 5 · Heartfelt Words</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-rose-950 tracking-tight">
          A Letter For {recipientName}
        </h2>
        <p className="text-sm text-rose-800/80 mt-1 max-w-md mx-auto">
          Every word written from the heart, celebrating all the joy, kindness, and warmth you bring into this world.
        </p>
      </div>

      {/* Envelope / Parchment Card */}
      {!isOpened ? (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-rose-200 text-center shadow-xl shadow-rose-200/40">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
            <Mail className="w-10 h-10" />
          </div>
          <h3 className="font-serif-luxury text-2xl font-bold text-rose-950 mb-2">
            An Unopened Letter for {recipientName}
          </h3>
          <p className="text-sm text-rose-700/80 mb-6">
            Sealed with a rose wax seal by {senderName}.
          </p>
          <button
            type="button"
            onClick={handleEnvelopeOpen}
            className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            Break Wax Seal & Open Letter 💌
          </button>
        </div>
      ) : (
        <div className="relative bg-[#FFFBF7] rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-2xl shadow-rose-200/40 text-slate-800 mb-8 overflow-hidden">
          {/* Subtle Vintage Texture / Watermark */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className="p-2 rounded-xl text-amber-800 hover:bg-amber-100/60 transition-colors text-xs font-semibold flex items-center gap-1"
              title={isEditing ? 'Save Letter' : 'Customize Letter'}
            >
              {isEditing ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Save Letter</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                  <span className="text-amber-800">Edit Words</span>
                </>
              )}
            </button>
          </div>

          {/* Letterhead */}
          <div className="border-b border-amber-200/70 pb-4 mb-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700/80">
                To My Dearest {recipientName}
              </span>
              <p className="text-xs text-amber-800/60 mt-0.5">
                Celebrating your {age}rd Milestone Birthday ✨
              </p>
            </div>
            {/* Wax Seal Stamp Icon */}
            <div className="w-10 h-10 rounded-full bg-rose-600 text-rose-100 flex items-center justify-center shadow-md border-2 border-rose-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </div>

          {/* Letter Body */}
          {isEditing ? (
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-2xl border border-amber-300 bg-white/70 text-slate-900 font-serif-luxury text-base sm:text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          ) : (
            <div className="space-y-4 font-serif-luxury text-base sm:text-lg text-slate-800 leading-relaxed sm:leading-loose whitespace-pre-line">
              {content}
            </div>
          )}

          {/* Soft Bottom Sign-off Accent */}
          <div className="mt-8 pt-4 border-t border-amber-200/60 flex items-center justify-between">
            <span className="font-handwriting text-2xl text-rose-700">
              Forever & Always ❤️
            </span>
            <span className="text-xs text-amber-800/70 italic">
              Written with devotion by {senderName}
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
          <span>Ready for the Grand Finale 🏹✨</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
