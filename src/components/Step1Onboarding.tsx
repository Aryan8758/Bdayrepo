import React, { useState } from 'react';
import { Heart, Sparkles, Gift, ArrowRight, Share2, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface Step1OnboardingProps {
  recipientName: string;
  senderName: string;
  age: number;
  onUpdateDetails: (details: { recipientName: string; senderName: string; age: number }) => void;
  onNext: () => void;
}

export const Step1Onboarding: React.FC<Step1OnboardingProps> = ({
  recipientName,
  senderName,
  age,
  onUpdateDetails,
  onNext,
}) => {
  const [recipient, setRecipient] = useState(recipientName);
  const [sender, setSender] = useState(senderName);
  const [turningAge, setTurningAge] = useState(age);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSparkle();
    onUpdateDetails({
      recipientName: recipient.trim() || 'Shreya',
      senderName: sender.trim() || 'Aryan',
      age: turningAge > 0 ? turningAge : 23,
    });
    onNext();
  };

  const handleShareLink = () => {
    soundEngine.playSparkle();
    const url = new URL(window.location.href);
    url.searchParams.set('for', recipient.trim() || 'Shreya');
    url.searchParams.set('from', sender.trim() || 'Aryan');
    url.searchParams.set('age', String(turningAge || 23));

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Decorative Floating Hearts in Background */}
      <div className="relative text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-semibold mb-3 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>A Special Birthday Experience</span>
        </div>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-extrabold text-rose-950 tracking-tight leading-tight mb-3">
          Create A Magical Birthday Surprise
        </h1>

        <p className="text-sm sm:text-base text-rose-800/80 max-w-md mx-auto leading-relaxed">
          Crafted with boundless affection, sweet surprises, personalized balloons, heartfelt letters, and music.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-rose-200/90 shadow-xl shadow-rose-200/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-pink-200/50 rounded-full blur-2xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative space-y-5">
          {/* Recipient Name */}
          <div>
            <label className="block text-xs font-bold text-rose-900 tracking-wide uppercase mb-1.5">
              Their Name (The Birthday Star ✨)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g., Shreya"
                className="w-full px-4 py-3 bg-rose-50/50 border border-rose-200 rounded-2xl text-slate-900 font-medium placeholder-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all text-base"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose-400">
                <Heart className="w-4 h-4 fill-rose-300 text-rose-400" />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Name */}
            <div>
              <label className="block text-xs font-bold text-rose-900 tracking-wide uppercase mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g., Aryan"
                className="w-full px-4 py-3 bg-rose-50/50 border border-rose-200 rounded-2xl text-slate-900 font-medium placeholder-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all text-base"
              />
            </div>

            {/* Turning Age */}
            <div>
              <label className="block text-xs font-bold text-rose-900 tracking-wide uppercase mb-1.5">
                Turning Age
              </label>
              <input
                type="number"
                min="1"
                max="120"
                required
                value={turningAge}
                onChange={(e) => setTurningAge(parseInt(e.target.value) || 0)}
                placeholder="23"
                className="w-full px-4 py-3 bg-rose-50/50 border border-rose-200 rounded-2xl text-slate-900 font-medium placeholder-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all text-base tabular-nums"
              />
            </div>
          </div>

          {/* Quick preset banner */}
          <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100/90 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Celebrating <strong>{recipient || 'Shreya'}</strong> turning <strong>{turningAge || 23}</strong> from <strong>{sender || 'Aryan'}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-[length:200%_auto] hover:bg-right transition-all duration-300 text-white font-semibold text-base shadow-lg shadow-rose-300/50 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Start the Surprise ✨</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleShareLink}
              className="min-h-[48px] px-4 py-3 rounded-2xl border border-rose-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-medium text-sm flex items-center justify-center gap-2 transition-colors active:scale-95 shrink-0"
              title="Copy shareable surprise link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-rose-500" />
                  <span>Share Link</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Experience Preview Cards */}
      <div className="mt-8 grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/60 p-3 rounded-2xl border border-rose-100">
          <span className="text-xl">🎂</span>
          <p className="text-xs font-semibold text-rose-950 mt-1">Cake Ritual</p>
          <p className="text-[11px] text-rose-700/80">Make a wish</p>
        </div>
        <div className="bg-white/60 p-3 rounded-2xl border border-rose-100">
          <span className="text-xl">🎈</span>
          <p className="text-xs font-semibold text-rose-950 mt-1">Balloon Pops</p>
          <p className="text-[11px] text-rose-700/80">Sweet secret notes</p>
        </div>
        <div className="bg-white/60 p-3 rounded-2xl border border-rose-100">
          <span className="text-xl">🏹</span>
          <p className="text-xs font-semibold text-rose-950 mt-1">Bow & Arrow</p>
          <p className="text-[11px] text-rose-700/80">Surprise reveal</p>
        </div>
      </div>
    </div>
  );
};
