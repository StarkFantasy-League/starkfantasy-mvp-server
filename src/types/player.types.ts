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
