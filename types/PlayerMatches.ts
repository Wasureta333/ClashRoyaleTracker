export interface IconUrls {
  medium: string;
  evolutionMedium?: string;
}

export interface Card {
  name: string;
  id: number;
  level: number;
  starLevel?: number;
  evolutionLevel?: number;
  maxLevel: number;
  maxEvolutionLevel?: number;
  rarity: string;
  elixirCost: number;
  iconUrls: IconUrls;
}

export interface Player {
  tag: string;
  name: string;
  crowns: number;
  trophyChange: number;
  kingTowerHitPoints: number | null;
  princessTowersHitPoints: number[] | null;
  cards: Card[];
  supportCards?: Card[];
  globalRank?: number | null;
  elixirLeaked?: number;
}

export interface Opponent {
  tag: string;
  name: string;
  trophyChange: number;
  crowns: number;
  kingTowerHitPoints: number;
  princessTowersHitPoints: number[];
  clan?: {
    tag: string;
    name: string;
    badgeId: number;
  };
  cards: Card[];
}

export interface Arena {
  id: number;
  name: string;
}

export interface GameMode {
  id: number;
  name: string;
}

export interface PlayerMatch {
  type: string;
  battleTime: string;
  isLadderTournament: boolean;
  arena: Arena;
  gameMode: GameMode;
  deckSelection: string;
  team: Player[];
  opponent: Opponent[];
}
