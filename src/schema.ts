import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm';

@Entity()
export class CricketTeam {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  image_path: string;

  @OneToMany(() => CricketPlayer, (player) => player.team)
  players: CricketPlayer[];

  constructor(id: string, name: string, image_path: string) {
    this.id = id;
    this.name = name;
    this.image_path = image_path;
  }
}

@Entity()
export class CricketPlayer {
  @PrimaryColumn()
  id: string;

  @Column()
  teamId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  position: string;

  @ManyToOne(() => CricketTeam, (team) => team.players)
  @JoinColumn({ name: 'teamId' })
  team: CricketTeam;

  @Column()
  image_path: string;

  @OneToMany(() => PlayerPerformance, (performance) => performance.player)
  performances: PlayerPerformance[];

  constructor(
    id: string,
    teamId: string,
    firstName: string,
    lastName: string,
    position: string,
    image_path: string,
  ) {
    this.id = id;
    this.teamId = teamId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.position = position;
    this.image_path = image_path;
  }
}

@Entity()
export class CricketMatch {
  @PrimaryColumn()
  id: string;

  @Column()
  homeTeamId: string;

  @Column()
  awayTeamId: string;

  @Column({ type: 'datetime' })
  matchDate: Date;

  @ManyToOne(() => CricketTeam)
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: CricketTeam;

  @ManyToOne(() => CricketTeam)
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: CricketTeam;

  @OneToOne(() => CricketPool, (pool) => pool.match)
  pool: CricketPool | null;

  @OneToMany(() => PlayerPerformance, (performance) => performance.match)
  performances: PlayerPerformance[];

  constructor(
    id: string,
    homeTeamId: string,
    awayTeamId: string,
    matchDate: Date,
  ) {
    this.id = id;
    this.homeTeamId = homeTeamId;
    this.awayTeamId = awayTeamId;
    this.matchDate = matchDate;
    this.pool = null;
  }
}

export enum CricketPoolStatus {
  Pending = 'pending',
  Finished = 'finished',
  Cancelled = 'cancelled',
}

@Entity()
export class CricketPool {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  cricketMatchId: string;

  @OneToOne(() => CricketMatch)
  @JoinColumn({ name: 'cricketMatchId' })
  match: CricketMatch;



  @Column({ type: 'varchar', length: 50, default: CricketPoolStatus.Pending })
  status: CricketPoolStatus; // e.g., 'pending', 'finished', 'cancelled'

  @Column({ type: 'int', nullable: true })
  homeResult: number | null;

  @Column({ type: 'int', nullable: true })
  awayResult: number | null;


  constructor(matchId: string, poolId?: string) {
    this.cricketMatchId = matchId;
    // Generate a new UUID if no ID is provided
    if (poolId)
      this.id = poolId;
    this.status = CricketPoolStatus.Pending; // Default status
    this.homeResult = null; // Default result
    this.awayResult = null; // Default result
  }

}

@Entity()
export class SoccerTeam {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  image_path: string;

  @OneToMany(() => SoccerPlayer, (player) => player.team)
  players: SoccerPlayer[];

  constructor(id: string, name: string, image_path: string) {
    this.id = id;
    this.name = name;
    this.image_path = image_path;
  }
}

@Entity()
export class SoccerPlayer {
  @PrimaryColumn()
  id: string;

  @Column()
  teamId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  position: string;

  @ManyToOne(() => SoccerTeam, (team) => team.players)
  @JoinColumn({ name: 'teamId' })
  team: SoccerTeam;

  @Column()
  image_path: string;

  constructor(
    id: string,
    teamId: string,
    firstName: string,
    lastName: string,
    position: string,
    image_path: string,
  ) {
    this.id = id;
    this.teamId = teamId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.position = position;
    this.image_path = image_path;
  }
}

@Entity()
export class SoccerMatch {
  @PrimaryColumn()
  id: string;

  @Column()
  homeTeamId: string;

  @Column()
  awayTeamId: string;

  @Column({ type: 'datetime' })
  matchDate: Date;

  @ManyToOne(() => SoccerTeam)
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: SoccerTeam;

  @ManyToOne(() => SoccerTeam)
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: SoccerTeam;

  @OneToOne(() => SoccerPool, (pool) => pool.match)
  pool: SoccerPool | null;

  constructor(
    id: string,
    homeTeamId: string,
    awayTeamId: string,
    matchDate: Date,
  ) {
    this.id = id;
    this.homeTeamId = homeTeamId;
    this.awayTeamId = awayTeamId;
    this.matchDate = matchDate;
    this.pool = null;
  }
}

@Entity()
export class SoccerPool {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  matchId: string;

  @OneToOne(() => SoccerMatch)
  @JoinColumn({ name: 'matchId' })
  match: SoccerMatch;

  constructor(id: string, matchId: string) {
    this.id = id;
    this.matchId = matchId;
  }
}

@Entity()
export class PlayerPerformance {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  cricketMatchId: string;

  @Column()
  cricketPlayerId: string;

  @Column()
  runs: number;

  @Column()
  wickets: number;

  @Column()
  catches: number;

  @Column()
  points: number;

  @ManyToOne(() => CricketMatch, (match) => match.performances)
  @JoinColumn({ name: 'cricketMatchId' })
  match: CricketMatch;

  @ManyToOne(() => CricketPlayer, (player) => player.performances)
  @JoinColumn({ name: 'cricketPlayerId' })
  player: CricketPlayer;

  constructor(
    cricketMatchId: string,
    cricketPlayerId: string,
    runs: number = 0,
    wickets: number = 0,
    catches: number = 0,
    points: number = 0,
  ) {
    this.cricketMatchId = cricketMatchId;
    this.cricketPlayerId = cricketPlayerId;
    this.runs = runs;
    this.wickets = wickets;
    this.catches = catches;
    this.points = points;
  }
}

@Entity()
export class BetsOptions {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  betName: string;

  constructor(betName: string) {
    this.betName = betName;
  }
}

@Entity('cricket_special_bet')
export class SpecialBet {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  specialBetId: string;

  @Column()
  playerId: string;

  @ManyToOne(() => BetsOptions)
  @JoinColumn({ name: 'specialBetId' })
  specialBet: BetsOptions;

  @ManyToOne(() => CricketPlayer)
  @JoinColumn({ name: 'playerId' })
  player: CricketPlayer;

  constructor(specialBetId: string, playerId: string) {
    this.specialBetId = specialBetId;
    this.playerId = playerId;
  }
}

@Entity()
export class CricketPlayerHistorial {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  playerId: string;

  @Column()
  goals: number;

  @Column()
  assists: number;

  @Column()
  clean_sheet: number;

  @Column()
  yellow_card: number;

  @Column()
  red_card: number;

  @ManyToOne(() => CricketPlayer)
  @JoinColumn({ name: 'playerId' })
  player: CricketPlayer;

  constructor(
    playerId: string,
    goals: number = 0,
    assists: number = 0,
    clean_sheet: number = 0,
    yellow_card: number = 0,
    red_card: number = 0,
    runs: number = 0,
    wickets: number = 0,
    catches: number = 0,
    points: number = 0,
  ) {
    this.playerId = playerId;
    this.goals = goals;
    this.assists = assists;
    this.clean_sheet = clean_sheet;
    this.yellow_card = yellow_card;
    this.red_card = red_card;
  }
}

@Entity('soccer_special_bet')
export class SoccerSpecialBet {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  specialBetId: string;

  @Column()
  playerId: string;

  @ManyToOne(() => BetsOptions)
  @JoinColumn({ name: 'specialBetId' })
  specialBet: BetsOptions;

  @ManyToOne(() => SoccerPlayer)
  @JoinColumn({ name: 'playerId' })
  player: SoccerPlayer;

  constructor(specialBetId: string, playerId: string) {
    this.specialBetId = specialBetId;
    this.playerId = playerId;
  }
}
