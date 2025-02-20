export interface PlayerData {
    tag: string;
    name: string;
    expLevel: number;
    trophies: number;
    bestTrophies: number;
    wins: number;
    losses: number;
    battleCount: number;
    badges: Badge[];
    currentPathOfLegendSeasonResult?: currentPathOfLegendSeasonResult[];
}

export interface currentPathOfLegendSeasonResult {
    leagueNumber: number;
    trophies: number;
    rank: number;
}

export interface Badge {
    name: string;
    level: number;
    maxLevel: number;
    progress: number;
    target: number;
    iconUrls?: IconUrls; 
}

export interface IconUrls {
    large: string;
}
