import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ArrowLeft, Plus, RotateCcw, Heart, Check } from 'lucide-react';
import { BalloonMessage } from '../types';
import { soundEngine } from '../utils/audio';

interface Step3BalloonPopProps {
  recipientName: string;
  balloons: BalloonMessage[];
  onUpdateBalloons: (balloons: BalloonMessage[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3BalloonPop: React.FC<Step3BalloonPopProps> = ({
  recipientName,
  balloons,
  onUpdateBalloons,
  onNext,
  onPrev,
}) => {
  const [activeBalloons, setActiveBalloons] = useState<BalloonMessage[]>(balloons);
  const [newNoteText, setNewNoteText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const poppedCount = activeBalloons.filter((b) => b.isPopped).length;
  const totalCount = activeBalloons.length;

  const handlePopBalloon = (balloonId: string, event: React.MouseEvent) => {
    const balloon = activeBalloons.find((b) => b.id === balloonId);
    if (!balloon || balloon.isPopped) return;

    // Pop sound effect
    soundEngine.playBalloonPop();

    // Trigger confetti from click coordinates
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x, y },
      colors: ['#F43F5E', '#FB7185', '#F472B6', '#FBBF24', '#C084FC'],
    });

    const updated = activeBalloons.map((b) =>
      b.id === balloonId ? { ...b, isPopped: true } : b
    );
    setActiveBalloons(updated);
    onUpdateBalloons(updated);
  };

  const handleResetBalloons = () => {
    soundEngine.playSparkle();
    const reset = activeBalloons.map((b) => ({ ...b, isPopped: false }));
    setActiveBalloons(reset);
    onUpdateBalloons(reset);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    soundEngine.playSparkle();
    const newBalloon: BalloonMessage = {
      id: `b-${Date.now()}`,
      color: 'from-pink-400 to-rose-400',
      accent: 'bg-rose-500',
      textColor: 'text-rose-950',
      note: newNoteText.trim(),
      isPopped: false,
    };

    const updated = [...activeBalloons, newBalloon];
    setActiveBalloons(updated);
    onUpdateBalloons(updated);
    setNewNoteText('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-semibold mb-2.5 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Step 3 · Sweet Surprise Notes</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-rose-950 tracking-tight">
          Pop the Balloons, {recipientName}!
        </h2>
        <p className="text-sm text-rose-800/80 mt-1 max-w-md mx-auto">
          Tap each floating balloon to pop it and reveal a hidden heartfelt compliment or sweet note.
        </p>

        {/* Counter and controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-rose-200 text-xs font-semibold text-rose-900 shadow-xs flex items-center gap-2">
            <span>Popped</span>
            <span className="bg-rose-500 text-white rounded-full px-2 py-0.5 text-[11px] tabular-nums font-bold">
              {poppedCount} / {totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-rose-500" />
            <span>Add Note</span>
          </button>

          {poppedCount > 0 && (
            <button
              type="button"
              onClick={handleResetBalloons}
              className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 transition-colors"
              title="Reset All Balloons"
              aria-label="Reset All Balloons"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Balloons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {activeBalloons.map((balloon, index) => {
          return (
            <div
              key={balloon.id}
              className="min-h-[220px] flex flex-col items-center justify-center relative select-none"
            >
              {!balloon.isPopped ? (
                // Unpopped Floating Balloon
                <div
                  onClick={(e) => handlePopBalloon(balloon.id, e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePopBalloon(balloon.id, e as unknown as React.MouseEvent);
                    }
                  }}
                  className="cursor-pointer group flex flex-col items-center animate-float-slow transform transition-transform hover:scale-105 active:scale-95"
                  style={{ animationDelay: `${index * 0.4}s` }}
                >
                  {/* Balloon Oval */}
                  <div
                    className={`w-28 h-36 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${balloon.color} shadow-lg shadow-rose-300/60 relative flex flex-col items-center justify-center p-3 border-t border-white/40`}
                  >
                    {/* Shiny Reflection Glare */}
                    <div className="absolute top-3 left-4 w-5 h-8 bg-white/45 rounded-full rotate-[-25deg] filter blur-[0.5px]" />
                    <div className="absolute top-4 left-6 w-1.5 h-3 bg-white/60 rounded-full rotate-[-25deg]" />

                    {/* Tap prompt */}
                    <span className="font-serif-luxury text-white text-xs font-bold tracking-wider drop-shadow-sm group-hover:scale-110 transition-transform flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>TAP TO POP</span>
                    </span>

                    {/* Balloon Knot */}
                    <div className="absolute -bottom-1.5 w-3.5 h-2.5 bg-rose-600 rounded-b-sm" />
                  </div>

                  {/* Balloon String */}
                  <div className="w-0.5 h-12 bg-gradient-to-b from-rose-400 via-rose-300 to-transparent relative -mt-0.5 opacity-70">
                    {/* Little ribbon curve */}
                    <div className="absolute top-2 -left-1 w-2.5 h-2.5 border-l border-b border-rose-300 rounded-bl-full" />
                  </div>

                  <span className="text-[11px] font-medium text-rose-800/80 mt-1">
                    Secret Note #{index + 1}
                  </span>
                </div>
              ) : (
                // Popped Note Card
                <div className="w-full h-full bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-rose-200/90 shadow-lg shadow-rose-200/40 flex flex-col justify-between transition-all animate-in fade-in zoom-in-90 duration-300 relative overflow-hidden">
                  {/* Romantic corner stamp */}
                  <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>Note #{index + 1}</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Popped
                    </span>
                  </div>

                  {/* Note message */}
                  <div className="my-auto py-3">
                    <p className="font-handwriting text-xl sm:text-2xl text-rose-950 leading-relaxed font-semibold">
                      &ldquo;{balloon.note}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 text-right">
                    <span className="font-serif-luxury text-[11px] text-rose-700/70 italic">
                      — With sweet love ✨
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200">
            <h3 className="font-serif-luxury text-xl font-bold text-rose-950 mb-2">
              Add a Personal Note for {recipientName}
            </h3>
            <p className="text-xs text-rose-800/80 mb-4">
              Write a sweet compliment, private memory, or birthday wish to place inside a new floating balloon.
            </p>

            <form onSubmit={handleAddNote} className="space-y-4">
              <textarea
                required
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="e.g. Your laugh is my favorite soundtrack in the world..."
                className="w-full p-3.5 rounded-2xl border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 shadow-sm"
                >
                  Create Balloon 🎈
                </button>
              </div>
            </form>
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
          <span>Continue to Photo Memories 📸</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
