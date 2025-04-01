import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class CricketTeam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => CricketPlayer, player => player.team)
    players: CricketPlayer[];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.players = [];
    }
}

@Entity()
export class CricketPlayer {
    @PrimaryGeneratedColumn('uuid')
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
        this.performances = [];
    }
}

@Entity()
export class CricketMatch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    homeTeamId: string;

    @Column()
    awayTeamId: string;

    @Column({ type: 'datetime' })
    dateTime: Date;

    @ManyToOne(() => CricketTeam)
    @JoinColumn({ name: 'homeTeamId' })
    homeTeam: CricketTeam;

    @ManyToOne(() => CricketTeam)
    @JoinColumn({ name: 'awayTeamId' })
    awayTeam: CricketTeam;

    @OneToOne(() => Pool, pool => pool.match)
    pool: Pool | null;

    @OneToMany(() => PlayerPerformance, performance => performance.match)
    performances: PlayerPerformance[];

    constructor(
        id: string,
        homeTeamId: string,
        awayTeamId: string,
        dateTime: Date
    ) {
        this.id = id;
        this.homeTeamId = homeTeamId;
        this.awayTeamId = awayTeamId;
        this.dateTime = dateTime;
        this.pool = null;
    }
}

@Entity()
export class Pool {
    @PrimaryGeneratedColumn('uuid')
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
    @PrimaryGeneratedColumn('uuid')
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
