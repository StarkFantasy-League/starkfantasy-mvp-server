export interface PlayerStats {
  id: string;
  player_name: string;
  player_team: string;
  image_path: string;
  selected_percentage: number;
  reward_rate: number;
  points: number;
}

export interface PlayerRadarStats {
  image_path: string;
  player_name: string;
  stats: {
    goals: number;
    assists: number;
    hitting: number;
    speed: number;
    dribbling: number;
  };
}

export interface PlayerTableViewStats {
  id: string;
  position: string;
  player_name: string;
  player_team: string;
  image_path: string;
  price: number;
  pointsPerMatch: number;
  selectedPercentage: number;
  totalRuns: number;
  totalWickets: number;
  minutesPlayed: number;
}
