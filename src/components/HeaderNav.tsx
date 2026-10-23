import React from 'react';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';

interface HeaderNavProps {
  currentStep: number;
  totalSteps: number;
  recipientName: string;
  onGoToStep: (step: number) => void;
  onReset: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentStep,
  totalSteps,
  recipientName,
  onGoToStep,
  onReset,
}) => {
  const stepLabels = [
    'Arrow 🏹',
    'Cake 🎂',
    'Balloons 🎈',
    'Memories 📸',
    'Letter 💌',
    'Finale ✨',
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-rose-100">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
            <Heart className="w-4 h-4 fill-current text-rose-500" />
          </div>
          <span className="font-serif-luxury text-lg font-bold text-rose-950 tracking-tight whitespace-nowrap">
            {recipientName}&apos;s Surprise
          </span>
        </div>

        {/* Step dots / tabs */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 bg-rose-50/80 rounded-xl border border-rose-100">
          {stepLabels.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;

            return (
              <button
                key={label}
                onClick={() => onGoToStep(stepNum)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-xs'
                    : isCompleted
                    ? 'text-rose-700 hover:bg-rose-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {stepNum}. {label}
              </button>
            );
          })}
        </div>

        {/* Mobile current step indicator */}
        <div className="sm:hidden flex items-center gap-1.5 text-xs text-rose-800 font-medium bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Step {currentStep} of {totalSteps}</span>
        </div>

        {/* Actions Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Start From Beginning"
            aria-label="Start From Beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress line */}
      <div className="h-0.5 bg-rose-100 w-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500 transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </header>
  );
};
