import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Music } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AudioPlayerBarProps {
  recipientName: string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ recipientName }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(soundEngine.getIsPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getIsMuted());
  const [volume, setVolume] = useState<number>(soundEngine.getVolume());

  useEffect(() => {
    const unsubscribe = soundEngine.subscribeState((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleTogglePlay = () => {
    soundEngine.toggleMusic();
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  const handlePlayCheer = () => {
    soundEngine.playVoiceCheer(recipientName, 22);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md">
      <div className="bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-lg shadow-rose-200/50 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-slate-800 transition-all">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-rose-500 text-white shadow-md shadow-rose-300 ring-2 ring-rose-300'
              : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
          }`}
          title={isPlaying ? 'Pause Melody' : 'Play Birthday Song'}
          aria-label={isPlaying ? 'Pause Birthday Melody' : 'Play Birthday Melody'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Track Info & Visualizer */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <Music className={`w-3.5 h-3.5 text-rose-500 shrink-0 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span className="text-xs font-semibold text-rose-950 truncate">
              {isPlaying ? `Birthday Melody for ${recipientName}` : 'Romantic Music Box'}
            </span>
            <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.2 border border-rose-200/60 rounded text-center shrink-0">
              Looping
            </span>
          </div>

          {/* Volume slider & mute */}
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleToggleMute}
              className="text-rose-500 hover:text-rose-700 p-0.5 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              aria-label="Volume Control"
            />
          </div>
        </div>

        {/* Cheer Sound Button */}
        <button
          onClick={handlePlayCheer}
          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-1 shrink-0 transition-colors active:scale-95 shadow-xs"
          title="Play Yayy Cheer Sound"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Cheer!</span>
        </button>
      </div>
    </div>
  );
};
