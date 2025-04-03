import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, PrimaryColumn, Generated } from 'typeorm';

@Entity()
export class CricketTeam {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @OneToMany(() => CricketPlayer, player => player.team)
  players: CricketPlayer[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
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

    @ManyToOne(() => CricketTeam, team => team.players)
    @JoinColumn({ name: 'teamId' })
    team: CricketTeam;

    @OneToMany(() => PlayerPerformance, performance => performance.player)
    performances: PlayerPerformance[];

    constructor(
        id: string,
        teamId: string,
        firstName: string,
        lastName: string,
        position: string
    ) {
        this.id = id;
        this.teamId = teamId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.position = position;
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

    @OneToOne(() => CricketPool, pool => pool.match)
    pool: CricketPool | null;

    @OneToMany(() => PlayerPerformance, performance => performance.match)
    performances: PlayerPerformance[];

    constructor(
        id: string,
        homeTeamId: string,
        awayTeamId: string,
        matchDate: Date
    ) {
        this.id = id;
        this.homeTeamId = homeTeamId;
        this.awayTeamId = awayTeamId;
        this.matchDate = matchDate;
        this.pool = null;
    }
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

    constructor(id: string, cricketMatchId: string) {
        this.id = id;
        this.cricketMatchId = cricketMatchId;
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

    @ManyToOne(() => CricketMatch, match => match.performances)
    @JoinColumn({ name: 'cricketMatchId' })
    match: CricketMatch;

    @ManyToOne(() => CricketPlayer, player => player.performances)
    @JoinColumn({ name: 'cricketPlayerId' })
    player: CricketPlayer;

    constructor(
        id: string,
        cricketMatchId: string,
        cricketPlayerId: string,
        runs: number = 0,
        wickets: number = 0,
        catches: number = 0
    ) {
        this.id = id;
        this.cricketMatchId = cricketMatchId;
        this.cricketPlayerId = cricketPlayerId;
        this.runs = runs;
        this.wickets = wickets;
        this.catches = catches;
    }
}
