import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Heart, Camera, X } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface StaticPhotoMemoriesProps {
  recipientName: string;
  senderName: string;
  onNext: () => void;
  onPrev: () => void;
}

export const StaticPhotoMemories: React.FC<StaticPhotoMemoriesProps> = ({
  recipientName,
  senderName,
  onNext,
  onPrev,
}) => {
  const [selectedImage, setSelectedImage] = useState<null | {
    title: string;
    caption: string;
    image: string;
    tag: string;
  }>(null);

  // User's uploaded real photos
  const realPhotos = [
    {
      id: 'photo-1',
      title: 'Garba Night & Endless Smiles 💖',
      caption: 'Teri aankhon mein jo sukoon hai, woh kahin aur nahi... That magical smile that melts my heart every single time. ✨',
      image: '/assets/photos/shreya_aryan_garba.jpg',
      tag: 'Our Special Night',
    },
    {
      id: 'photo-2',
      title: 'Lost In Your Eyes 🌸',
      caption: 'Duniya ki saari khoobsurti ek taraf, aur tera muskura ke meri taraf dekhna ek taraf. 🌿',
      image: '/assets/photos/shreya_aryan_eyes.jpg',
      tag: 'Pure Magic',
    },
    {
      id: 'photo-3',
      title: 'Forever & Always By Your Side 🌹',
      caption: 'Har janam, har pal... bas tera sath chahiye. Happy 22nd Birthday to my prettiest, sweetest Shreya! ❤️',
      image: '/assets/photos/shreya_aryan_together.jpg',
      tag: 'My Whole World',
    },
  ];

  const handleOpenPhoto = (photo: typeof realPhotos[0]) => {
    soundEngine.playSparkle();
    setSelectedImage(photo);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2.5 border border-rose-200">
          <Camera className="w-3.5 h-3.5 text-rose-500" />
          <span>Our Cherished Moments</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-rose-950 tracking-tight">
          Memories of {recipientName} & {senderName}
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/80 mt-1 max-w-lg mx-auto">
          Every picture holds a timeless chapter of our smiles, our warmth, and our unforgettable bond together. Tap any photo to enlarge! ✨
        </p>
      </div>

      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {realPhotos.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenPhoto(item)}
            className="group cursor-pointer bg-white rounded-2xl p-3.5 border border-rose-200/90 shadow-md shadow-rose-100/50 hover:shadow-2xl hover:shadow-rose-200/60 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
          >
            {/* Polaroid Photo Frame */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-rose-50 border border-slate-100">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                {item.tag}
              </div>
              <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-rose-500 shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            {/* Handwritten Caption */}
            <div className="pt-3.5 pb-1 flex flex-col flex-1 justify-between">
              <div>
                <h4 className="font-handwriting text-2xl font-bold text-rose-950 leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed italic">
                  &ldquo;{item.caption}&rdquo;
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-rose-100 flex items-center justify-between text-[11px] text-rose-800/70">
                <span>With Love, {senderName}</span>
                <span className="font-handwriting text-sm text-rose-500">cherished ✨</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal for Full-Resolution Photo View */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-200 relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close photo"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="max-h-[65vh] overflow-hidden bg-slate-900">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-contain max-h-[65vh] mx-auto"
              />
            </div>

            <div className="p-5 text-center bg-white">
              <h3 className="font-handwriting text-2xl font-bold text-rose-950">
                {selectedImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 italic">
                &ldquo;{selectedImage.caption}&rdquo;
              </p>
            </div>
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
          <span>Back to Balloons</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSparkle();
            onNext();
          }}
          className="min-h-[44px] px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-semibold text-sm shadow-md shadow-rose-300/50 flex items-center gap-2 active:scale-98 transition-all"
        >
          <span>Read Birthday Letter 💌</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
