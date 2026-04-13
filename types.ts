
export enum AppTab {
  RACE = 'race',
  HISTORY = 'history'
}

export interface Duck {
  id: string;
  name: string;
  color: string;
  position: number;
  isWinner: boolean;
  finishTime?: number;
}

export interface RaceResult {
  id: string;
  winner: string;
  participants: string[];
  timestamp: number;
}
