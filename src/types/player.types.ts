export interface Team {
  id: string;
  name: string;
  image_path: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  matchDate: Date;
  homeTeam: Team;
  awayTeam: Team;
  pool: any;
}

export interface HomeData {
  topPlayers: PlayerStats[];
  upcomingMatches: Match[];
}

export interface PlayerStats {
  id: string;
  player_name: string;
  player_team: string;
  image_path: string;
  selected_percentage: number;
  reward_rate: number;
  points: number;
  runs: number;
}

export interface PlayerRadarStats {
  image_path: string;
  team_name: string;
  player_name: string;
  stats: {
    runs: number;
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

export interface PaginatedPlayerStats {
  data: PlayerStats[];
  total: number;
  page: number;
  limit: number;
}
