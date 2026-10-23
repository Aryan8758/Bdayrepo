export interface CakeOption {
  id: string;
  name: string;
  flavor: string;
  tagline: string;
  description: string;
  image: string;
  badge: string;
  sweetnessRating: number;
}

export interface BalloonMessage {
  id: string;
  color: string;
  accent: string;
  textColor: string;
  note: string;
  isPopped: boolean;
}

export interface PhotoMemory {
  id: string;
  title: string;
  caption: string;
  image: string;
  dateTag: string;
  isCustom?: boolean;
}

export interface SurpriseState {
  recipientName: string;
  senderName: string;
  age: number;
  currentStep: number;
  selectedCakeId: string;
  candlesLit: boolean;
  candlesBlown: boolean;
  balloons: BalloonMessage[];
  memories: PhotoMemory[];
  letter: string;
  hasPoppedHeartBalloon: boolean;
  musicAutoStarted: boolean;
}
