import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Upload, Heart, Edit3, Trash2, Camera } from 'lucide-react';
import { PhotoMemory } from '../types';
import { soundEngine } from '../utils/audio';

interface Step4PhotoMemoriesProps {
  recipientName: string;
  senderName: string;
  memories: PhotoMemory[];
  onUpdateMemories: (memories: PhotoMemory[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4PhotoMemories: React.FC<Step4PhotoMemoriesProps> = ({
  recipientName,
  senderName,
  memories,
  onUpdateMemories,
  onNext,
  onPrev,
}) => {
  const [memoryList, setMemoryList] = useState<PhotoMemory[]>(memories);
  const [editingMemory, setEditingMemory] = useState<PhotoMemory | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(new Set(['mem-1']));

  // Handle Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playSparkle();
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const newMemory: PhotoMemory = {
          id: `custom-mem-${Date.now()}`,
          title: `Special Memory with ${recipientName}`,
          caption: 'Another unforgettable memory that I hold so close to my heart. ✨',
          image: result,
          dateTag: 'Our Moments',
          isCustom: true,
        };
        const updated = [newMemory, ...memoryList];
        setMemoryList(updated);
        onUpdateMemories(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLike = (id: string) => {
    soundEngine.playSparkle();
    setLikedPhotoIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = (id: string) => {
    const updated = memoryList.filter((m) => m.id !== id);
    setMemoryList(updated);
    onUpdateMemories(updated);
  };

  const handleStartEdit = (memory: PhotoMemory) => {
    setEditingMemory(memory);
    setEditTitle(memory.title);
    setEditCaption(memory.caption);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory) return;

    soundEngine.playSparkle();
    const updated = memoryList.map((m) =>
      m.id === editingMemory.id
        ? { ...m, title: editTitle.trim() || m.title, caption: editCaption.trim() || m.caption }
        : m
    );
    setMemoryList(updated);
    onUpdateMemories(updated);
    setEditingMemory(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-semibold mb-2.5 border border-rose-200">
          <Camera className="w-3.5 h-3.5 text-rose-500" />
          <span>Step 4 · Captured Moments</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-rose-950 tracking-tight">
          Photo Memories Showcase
        </h2>
        <p className="text-sm text-rose-800/80 mt-1 max-w-lg mx-auto">
          Every photo is a timeless little souvenir of your joy, your light, and all our sweetest milestones together.
        </p>

        {/* Upload Button */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200/90 text-rose-700 text-xs font-semibold shadow-xs transition-all active:scale-95">
            <Upload className="w-4 h-4 text-rose-500" />
            <span>Upload or Add Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {memoryList.map((memory, idx) => {
          const isLiked = likedPhotoIds.has(memory.id);

          return (
            <div
              key={memory.id}
              className="group bg-white rounded-2xl p-3.5 border border-rose-200/80 shadow-md shadow-rose-100/50 hover:shadow-xl hover:shadow-rose-200/50 transition-all duration-300 flex flex-col justify-between relative transform hover:-translate-y-1"
            >
              {/* Polaroid Photo Frame */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-rose-50 border border-slate-100">
                <img
                  src={memory.image}
                  alt={memory.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Date Tag */}
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {memory.dateTag}
                </div>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => handleLike(memory.id)}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                    isLiked
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-white/80 text-rose-400 hover:text-rose-600'
                  }`}
                  aria-label="Favorite memory"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Customized Caption Beneath Each Photo */}
              <div className="pt-3.5 pb-1 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-handwriting text-xl sm:text-2xl font-bold text-rose-950 leading-tight">
                      {memory.title}
                    </h4>

                    {/* Edit / Delete actions */}
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(memory)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Edit caption"
                        aria-label="Edit caption"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {memory.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDelete(memory.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete photo"
                          aria-label="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed italic">
                    &ldquo;{memory.caption}&rdquo;
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-rose-100 flex items-center justify-between text-[11px] text-rose-800/70">
                  <span>From {senderName}</span>
                  <span className="font-handwriting text-sm text-rose-500">cherished ✨</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Caption Modal */}
      {editingMemory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200">
            <h3 className="font-serif-luxury text-xl font-bold text-rose-950 mb-2">
              Customize Photo Caption
            </h3>
            <p className="text-xs text-rose-800/80 mb-4">
              Write a personalized note or title for this memory.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-900 mb-1">
                  Custom Caption
                </label>
                <textarea
                  required
                  rows={3}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full p-3 rounded-xl border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMemory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 shadow-sm"
                >
                  Save Caption ✨
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
          <span>Continue to Birthday Letter 💌</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
