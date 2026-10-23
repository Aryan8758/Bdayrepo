import { CakeOption, BalloonMessage, PhotoMemory } from '../types';

export const DEFAULT_CAKES: CakeOption[] = [
  {
    id: 'chocolate-eclipse',
    name: 'Chocolate Eclipse',
    flavor: 'Dark Truffle & Wild Raspberries',
    tagline: 'Rich, seductive, and intensely decadent',
    description: 'Layers of 70% Valrhona dark chocolate mousse, tart wild raspberry coulis, silky mirror ganache, and edible 24k gold leaf flakes.',
    image: '/src/assets/images/cake_chocolate_eclipse_1792678859309.jpg',
    badge: 'Chef Signature',
    sweetnessRating: 4,
  },
  {
    id: 'strawberry-bloom',
    name: 'Strawberry Bloom',
    flavor: 'Rose Petal & Sweet Berry Chantilly',
    tagline: 'Delicate, romantic, and blossom-fresh',
    description: 'Fluffy Japanese cotton sponge layered with farm-fresh organic strawberries, Madagascar vanilla bean Chantilly, and crystallized edible rose petals.',
    image: '/src/assets/images/cake_strawberry_bloom_1792678860743.jpg',
    badge: 'Most Popular 🍓',
    sweetnessRating: 5,
  },
  {
    id: 'vanilla-pearl',
    name: 'Vanilla Pearl',
    flavor: 'Tahitian Vanilla & White Chocolate Silk',
    tagline: 'Timeless luxury with an ethereal glow',
    description: 'Triple-soaked Tahitian vanilla bean chiffon embellished with handmade white chocolate ribbon ruffles and shimmering French sugar pearls.',
    image: '/src/assets/images/cake_vanilla_pearl_1792678862293.jpg',
    badge: 'Pure Elegance',
    sweetnessRating: 3,
  },
];

export const DEFAULT_BALLOONS: BalloonMessage[] = [
  {
    id: 'b1',
    color: 'from-pink-400 to-rose-400',
    accent: 'bg-rose-500',
    textColor: 'text-rose-950',
    note: 'Your smile has this effortless magic that brightens every single room you walk into ✨',
    isPopped: false,
  },
  {
    id: 'b2',
    color: 'from-rose-300 to-pink-500',
    accent: 'bg-pink-600',
    textColor: 'text-pink-950',
    note: 'You have the purest, most generous heart in this world. Being around you is pure peace 🌸',
    isPopped: false,
  },
  {
    id: 'b3',
    color: 'from-fuchsia-300 to-rose-400',
    accent: 'bg-fuchsia-500',
    textColor: 'text-fuchsia-950',
    note: 'Thank you for making the simplest, mundane moments feel like romantic poetry 💌',
    isPopped: false,
  },
  {
    id: 'b4',
    color: 'from-amber-300 to-pink-400',
    accent: 'bg-amber-500',
    textColor: 'text-amber-950',
    note: 'Watching your eyes sparkle whenever you talk about the things you love is my favorite sight 💫',
    isPopped: false,
  },
  {
    id: 'b5',
    color: 'from-rose-400 to-red-400',
    accent: 'bg-rose-600',
    textColor: 'text-rose-950',
    note: 'I am endlessly, fiercely proud of the graceful, brilliant person you are every single day 🌷',
    isPopped: false,
  },
  {
    id: 'b6',
    color: 'from-pink-400 to-violet-400',
    accent: 'bg-purple-500',
    textColor: 'text-purple-950',
    note: 'Never forget how deeply, unconditionally, and endlessly cherished you are. Happy Birthday! 💖',
    isPopped: false,
  },
];

export const DEFAULT_MEMORIES: PhotoMemory[] = [
  {
    id: 'mem-1',
    title: "Golden Hour Joy - '98",
    caption: 'Sunsets may dip below the horizon, but your radiant smile stays etched in my heart forever. 🌅',
    image: '/src/assets/images/photo_memory_sunset_1792678861980.jpg',
    dateTag: 'Endless Laughter',
  },
  {
    id: 'mem-2',
    title: 'Birthday Brunch! 🎂☕ 23.09.23',
    caption: 'Warm cinnamon lattes, sweet chocolate cake, and the prettiest birthday girl across the table. ✨',
    image: '/src/assets/images/photo_memory_cafe_1792678862542.jpg',
    dateTag: 'Cozy Moments',
  },
  {
    id: 'mem-3',
    title: 'Forever Bouquet 💐',
    caption: 'Because flowers might bloom for a season, but my admiration and love for you is eternal. 🌹',
    image: '/src/assets/images/romantic_flower_bouquet_1792678862607.jpg',
    dateTag: 'Blooms & Wishes',
  },
];

export const getDefaultLetter = (recipient: string = 'Shreya', sender: string = 'Aryan', age: number = 23) => {
  return `Dearest ${recipient},

Happy ${age}rd Birthday, my favorite person in the entire universe.

Somehow, you are already ${age} today, and with every passing year, your warmth, grace, and light only grow brighter. You have this quiet super-power: you turn ordinary afternoons into treasured memories, and you make anyone in your presence feel genuinely valued, safe, and heard.

Thank you for your contagious laughter, your comforting hugs, and for being the gentlest soul I know. Thank you for simply existing as you are.

As you step into 23, my wish for you is boundless:
May this year gift you all the quiet peace you bring to others, the exhilarating adventures you dream of, and an abundance of dreams turned into reality.

No matter where life takes us, remember you will always have my unconditional support, my deepest affection, and someone who will endlessly cheer for you.

With all my love and devotion,
${sender} ❤️`;
};
