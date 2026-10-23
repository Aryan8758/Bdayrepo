import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { ArrowStartPage } from './components/ArrowStartPage';
import { VirtualCake } from './components/VirtualCake';
import { FourBalloonsPop } from './components/FourBalloonsPop';
import { StaticPhotoMemories } from './components/StaticPhotoMemories';
import { StaticAnimatedLetter } from './components/StaticAnimatedLetter';
import { GrandCelebration } from './components/GrandCelebration';
import { soundEngine } from './utils/audio';

export default function App() {
  // Fixed details as requested by user
  const recipientName = 'Shreya';
  const senderName = 'Aryan';
  const age = 22;

  // Step 1: Arrow Start -> Step 2: Virtual Cake -> Step 3: 4 Balloons -> Step 4: Memories -> Step 5: Letter -> Step 6: Finale
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(6, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToStep = (step: number) => {
    soundEngine.playSparkle();
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    soundEngine.playSparkle();
    soundEngine.pauseMusic();
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F5] via-[#FFF5F7] to-[#FFE4E1] flex flex-col justify-between selection:bg-rose-200 selection:text-rose-900 pb-24">
      {/* Top Navigation */}
      <HeaderNav
        currentStep={currentStep}
        totalSteps={6}
        recipientName={recipientName}
        onGoToStep={handleGoToStep}
        onReset={handleReset}
      />

      {/* Main Step Container */}
      <main className="flex-1 w-full transition-all duration-300">
        {/* Step 1: Arrow & Heart Balloon Starting Page */}
        {currentStep === 1 && (
          <ArrowStartPage
            recipientName={recipientName}
            senderName={senderName}
            age={age}
            onPopSuccess={handleNextStep}
          />
        )}

        {/* Step 2: Virtual Cake Creation & Candle Blow */}
        {currentStep === 2 && (
          <VirtualCake
            recipientName={recipientName}
            age={age}
            onNext={handleNextStep}
          />
        )}

        {/* Step 3: Exactly 4 Interactive Balloon Pops */}
        {currentStep === 3 && (
          <FourBalloonsPop
            recipientName={recipientName}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {/* Step 4: Static Photo Memories */}
        {currentStep === 4 && (
          <StaticPhotoMemories
            recipientName={recipientName}
            senderName={senderName}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {/* Step 5: Static Heartfelt Letter */}
        {currentStep === 5 && (
          <StaticAnimatedLetter
            recipientName={recipientName}
            senderName={senderName}
            age={age}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {/* Step 6: Grand Birthday Celebration Finale */}
        {currentStep === 6 && (
          <GrandCelebration
            recipientName={recipientName}
            senderName={senderName}
            age={age}
            onRestart={handleReset}
          />
        )}
      </main>

      {/* Bottom Audio Controller */}
      <AudioPlayerBar recipientName={recipientName} />
    </div>
  );
}
