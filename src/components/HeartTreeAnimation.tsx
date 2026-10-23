import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeartTreeAnimationProps {
  recipientName: string;
  age: number;
  onNext: () => void;
}

interface Blossom {
  id: number;
  cx: number;
  cy: number;
  size: number;
  color: string;
  delay: number;
  rotate: number;
}

export const HeartTreeAnimation: React.FC<HeartTreeAnimationProps> = ({
  recipientName,
  age = 22,
  onNext,
}) => {
  const [treeGrown, setTreeGrown] = useState(false);
  const [blossomsBloomed, setBlossomsBloomed] = useState(false);
  const [showText, setShowText] = useState(false);

  // Generate ~120 heart blossoms forming the heart canopy
  const [blossoms, setBlossoms] = useState<Blossom[]>([]);

  useEffect(() => {
    soundEngine.playSparkle();

    // Generate heart shape coordinates:
    // Parametric heart formula:
    // x = 16 sin^3(t)
    // y = 13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t)
    const newBlossoms: Blossom[] = [];
    const colors = [
      '#FDA4AF', // rose-300
      '#F472B6', // pink-400
      '#FB7185', // rose-400
      '#F43F5E', // rose-500
      '#FECDD3', // rose-200
      '#FEF08A', // yellow-200
      '#FDE047', // yellow-300
      '#F43F5E', // red-500
      '#FB923C', // orange-400
    ];

    let id = 0;
    // Fill the heart area
    for (let i = 0; i < 110; i++) {
      // Random angle
      const t = Math.random() * Math.PI * 2;
      // Random radius factor with bias to fill volume
      const r = Math.sqrt(Math.random());

      // Heart math centered at (190, 115)
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const cx = 190 + hx * 5.8 * r + (Math.random() * 8 - 4);
      const cy = 110 + hy * 5.8 * r + (Math.random() * 8 - 4);

      newBlossoms.push({
        id: id++,
        cx,
        cy,
        size: 7 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: 0.8 + Math.random() * 1.6, // Staggered blooming
        rotate: Math.random() * 60 - 30,
      });
    }

    setBlossoms(newBlossoms);

    // Sequence timing
    const tTree = setTimeout(() => setTreeGrown(true), 200);
    const tBloom = setTimeout(() => {
      setBlossomsBloomed(true);
      soundEngine.playSparkle();
    }, 1000);
    const tText = setTimeout(() => setShowText(true), 1800);

    const tConfetti = setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.65, y: 0.35 },
        colors: ['#F472B6', '#FDA4AF', '#FDE047', '#FB7185'],
      });
    }, 2400);

    return () => {
      clearTimeout(tTree);
      clearTimeout(tBloom);
      clearTimeout(tText);
      clearTimeout(tConfetti);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 select-none animate-in fade-in duration-700">
      <div className="bg-gradient-to-b from-[#FFF5F8] via-[#FFF9FA] to-[#FFEBF2] rounded-3xl p-6 sm:p-8 border border-rose-200/90 shadow-2xl relative overflow-hidden min-h-[520px] flex flex-col justify-between">
        {/* Soft background glow */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top/Side Content Grid: Left Text, Right Heart Blossom Tree */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 flex-1">
          {/* Left Text matching Video:
              "it's officially your day"
              "Happy Birthday, Arina / Shreya"
              "and just like that, you're turning 22 ✨" */}
          <div
            className={`sm:w-1/2 text-left transition-all duration-700 ${
              showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="font-serif-luxury text-xs sm:text-sm text-rose-700 font-medium tracking-wide">
              it&apos;s officially your day
            </p>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 tracking-tight leading-tight my-2">
              Happy Birthday, <br />
              {recipientName}
            </h1>

            <p className="font-serif-luxury text-xs sm:text-sm text-rose-800/80 mt-1">
              and just like that, you&apos;re turning <span className="font-bold text-rose-950 font-sans">{age}</span> ✨
            </p>

            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-rose-600 font-handwriting text-base">
              <span>Growing more beautiful every year 🌸</span>
            </div>
          </div>

          {/* Right Heart Tree Graphic matching Video */}
          <div className="w-full sm:w-1/2 flex items-center justify-center relative min-h-[280px]">
            <svg
              viewBox="0 0 320 300"
              className="w-full h-auto max-w-[280px] overflow-visible drop-shadow-md"
            >
              {/* TREE TRUNK & BRANCHES */}
              <g
                className={`transition-all duration-1000 ease-out ${
                  treeGrown ? 'opacity-100 scale-100' : 'opacity-0 scale-y-50'
                }`}
                style={{ transformOrigin: '190px 280px' }}
              >
                {/* Main Trunk */}
                <path
                  d="M 186 280
                     C 188 230, 187 180, 190 145
                     C 193 180, 192 230, 194 280 Z"
                  fill="#5A3A2C"
                />

                {/* Left Branch Systems */}
                <path
                  d="M 189 160
                     C 175 140, 150 120, 130 90
                     C 140 105, 160 125, 189 150 Z"
                  fill="#6D4534"
                />
                <path
                  d="M 155 125
                     C 140 110, 125 95, 110 70
                     C 120 85, 135 102, 155 120 Z"
                  fill="#7E5240"
                />
                <path
                  d="M 175 145
                     C 165 130, 155 110, 145 85
                     C 152 100, 162 120, 175 140 Z"
                  fill="#7E5240"
                />

                {/* Right Branch Systems */}
                <path
                  d="M 191 160
                     C 205 140, 230 120, 250 90
                     C 240 105, 220 125, 191 150 Z"
                  fill="#6D4534"
                />
                <path
                  d="M 225 125
                     C 240 110, 255 95, 270 70
                     C 260 85, 245 102, 225 120 Z"
                  fill="#7E5240"
                />
                <path
                  d="M 205 145
                     C 215 130, 225 110, 235 85
                     C 228 100, 218 120, 205 140 Z"
                  fill="#7E5240"
                />

                {/* Top Center Branch */}
                <path
                  d="M 190 145
                     C 188 120, 186 95, 185 75
                     M 190 145
                     C 192 120, 194 95, 195 75"
                  stroke="#5A3A2C"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>

              {/* BLOOMING HEART BLOSSOMS */}
              {blossoms.map((b) => (
                <g
                  key={b.id}
                  transform={`translate(${b.cx}, ${b.cy}) rotate(${b.rotate})`}
                  className={`transition-all duration-700 ease-out ${
                    blossomsBloomed ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}
                  style={{
                    transitionDelay: `${b.delay}s`,
                    transformOrigin: 'center center',
                  }}
                >
                  {/* Little Heart Shape */}
                  <path
                    d={`M 0 ${b.size * 0.3}
                       C 0 -${b.size * 0.4}, -${b.size * 0.8} -${b.size * 0.4}, -${b.size * 0.8} ${b.size * 0.1}
                       C -${b.size * 0.8} ${b.size * 0.5}, 0 ${b.size * 0.9}, 0 ${b.size}
                       C 0 ${b.size * 0.9}, ${b.size * 0.8} ${b.size * 0.5}, ${b.size * 0.8} ${b.size * 0.1}
                       C ${b.size * 0.8} -${b.size * 0.4}, 0 -${b.size * 0.4}, 0 ${b.size * 0.3} Z`}
                    fill={b.color}
                    opacity="0.92"
                  />
                </g>
              ))}

              {/* Falling Petals */}
              <circle cx="140" cy="220" r="3" fill="#F472B6" opacity="0.6" className="animate-ping [animation-duration:3s]" />
              <circle cx="230" cy="235" r="2.5" fill="#FDA4AF" opacity="0.7" className="animate-ping [animation-duration:2.5s]" />
              <circle cx="170" cy="260" r="3.5" fill="#FEF08A" opacity="0.6" className="animate-ping [animation-duration:3.5s]" />
            </svg>
          </div>
        </div>

        {/* Bottom CTA Button matching video: "First things first 🎂" */}
        <div className="mt-6 pt-4 border-t border-rose-100/80 z-20">
          <button
            type="button"
            onClick={() => {
              soundEngine.playSparkle();
              onNext();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-300/50 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>First things first 🎂</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
