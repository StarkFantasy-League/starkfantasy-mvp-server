CREATE TABLE soccer_team (
    id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200),
    image_path VARCHAR(300),
    CONSTRAINT PK_SoccerTeamID PRIMARY KEY (Id)
);

CREATE TABLE soccer_player (
    id VARCHAR(100) UNIQUE NOT NULL,
    teamId VARCHAR(100),
    firstName VARCHAR(50),
    lastName VARCHAR(100),
    position VARCHAR(25),
    image_path VARCHAR(300),
    CONSTRAINT PK_SoccerPlayerID PRIMARY KEY (Id),
    CONSTRAINT FK_SoccerPlayerTeam FOREIGN KEY (teamId) REFERENCES soccer_team(Id)
);

CREATE TABLE soccer_match (
    id VARCHAR(100) NOT NULL,
    homeTeamId VARCHAR(100),
    awayTeamId VARCHAR(100),
    matchDate DATETIME,
    CONSTRAINT PK_SoccerMatchID PRIMARY KEY (Id),
    CONSTRAINT FK_SoccerMatchHomeTeamID FOREIGN KEY (HomeTeamId) REFERENCES soccer_team(Id),
    CONSTRAINT FK_SoccerMatchAwayTeamID FOREIGN KEY (AwayTeamId) REFERENCES soccer_team(Id)
);

CREATE TABLE soccer_pool (
    id VARCHAR(100) NOT NULL DEFAULT CAST(NEWID() AS VARCHAR(100)),
    matchId VARCHAR(100),
    CONSTRAINT PK_SoccerPoolID PRIMARY KEY (id),
    CONSTRAINT FK_SoccerPoolMatch FOREIGN KEY (matchId) REFERENCES soccer_match(id)
);

CREATE TABLE soccer_special_bet (
    id VARCHAR(100) UNIQUE NOT NULL DEFAULT CAST(NEWID() AS VARCHAR(100)),
    specialBetId VARCHAR(100) NOT NULL,
    playerId VARCHAR(100) NOT NULL,
    CONSTRAINT PK_SoccerSpecialBetID PRIMARY KEY (id),
    CONSTRAINT FK_SoccerSpecialBetOption FOREIGN KEY (specialBetId) REFERENCES bets_options(id),
    CONSTRAINT FK_SoccerSpecialBetPlayer FOREIGN KEY (playerId) REFERENCES soccer_player(id)
);