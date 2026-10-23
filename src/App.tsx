import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { ArrowStartPage } from './components/ArrowStartPage';
import { HeartTreeAnimation } from './components/HeartTreeAnimation';
import { KoikoiCake } from './components/KoikoiCake';
import { FourBalloonsPop } from './components/FourBalloonsPop';
import { StaticPhotoMemories } from './components/StaticPhotoMemories';
import { StaticAnimatedLetter } from './components/StaticAnimatedLetter';
import { GrandCelebration } from './components/GrandCelebration';
import { soundEngine } from './utils/audio';

export default function App() {
  // Shreya is turning 22 (Born in 2004, Current year 2026)
  const recipientName = 'Shreya';
  const senderName = 'Aryan';
  const age = 22;

  // Exact 7-step sequence matching the reference video:
  // 1: Arrow Start Page (make a wish... Happy Birthday)
  // 2: HeartTreeAnimation (it's officially your day with growing tree & blooming heart canopy)
  // 3: KoikoiCake (First things first 🎂 with 3-tier falling cake & tall prominent candle & Fooooh! wind blow)
  // 4: FourBalloonsPop (Pop the balloons 🎈 - 4 reasons waiting inside)
  // 5: StaticPhotoMemories (Our Cherished Moments with real couple photos)
  // 6: StaticAnimatedLetter (Aryan's exact heartfelt letter with wax seal)
  // 7: GrandCelebration (Celebratory finale with looping music, couple photo & bouquet)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
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
        totalSteps={totalSteps}
        recipientName={recipientName}
        onGoToStep={handleGoToStep}
        onReset={handleReset}
      />

      {/* Main Step Container */}
      <main className="flex-1 w-full transition-all duration-300">
        {/* Step 1: Arrow Start Page (make a wish... Happy Birthday) */}
        {currentStep === 1 && (
          <ArrowStartPage
            recipientName={recipientName}
            senderName={senderName}
            age={age}
            onPopSuccess={handleNextStep}
          />
        )}

        {/* Step 2: Heart Tree Blossom Animation (it's officially your day) */}
        {currentStep === 2 && (
          <HeartTreeAnimation
            recipientName={recipientName}
            age={age}
            onNext={handleNextStep}
          />
        )}

        {/* Step 3: First things first 🎂 - 3-Tier Cake with Tall Candle & Fooooh! Wind Blow */}
        {currentStep === 3 && (
          <KoikoiCake
            recipientName={recipientName}
            age={age}
            onNext={handleNextStep}
          />
        )}

        {/* Step 4: Exactly 4 Interactive Balloon Pops */}
        {currentStep === 4 && (
          <FourBalloonsPop
            recipientName={recipientName}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {/* Step 5: Static Photo Memories */}
        {currentStep === 5 && (
          <StaticPhotoMemories
            recipientName={recipientName}
            senderName={senderName}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {/* Step 6: Static Heartfelt Letter */}
        {currentStep === 6 && (
          <StaticAnimatedLetter
            recipientName={recipientName}
            senderName={senderName}
            age={age}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {/* Step 7: Grand Birthday Celebration Finale */}
        {currentStep === 7 && (
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
