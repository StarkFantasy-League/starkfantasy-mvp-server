-- CREATE DATABASE StarkFantasy 

Use StarkFantasy


CREATE TABLE cricket_team (
  id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR (200),
  image_path VARCHAR(300),
  CONSTRAINT PK_CricketTeamID PRIMARY KEY (Id)
)

CREATE TABLE cricket_match (
    id VARCHAR(100) NOT NULL, 
    homeTeamId VARCHAR(100),
    awayTeamId VARCHAR(100),
    matchDate DATETIME,
    CONSTRAINT PK_CricketMatchID PRIMARY KEY (Id),
    CONSTRAINT FK_CricketMatchHomeTeamID FOREIGN KEY (HomeTeamId) REFERENCES cricket_team(Id),
    CONSTRAINT FK_CricketMatchAwayTeamID FOREIGN KEY (AwayTeamId) REFERENCES cricket_team(Id)
);




CREATE TABLE cricket_player (
id VARCHAR(100)UNIQUE NOT NULL, 
teamId VARCHAR(100),
firstName VARCHAR (50),
lastName VARCHAR (100),
position VARCHAR (25),
image_path VARCHAR(300),
    CONSTRAINT PK_CricketPlayerID PRIMARY KEY (Id),
	CONSTRAINT FK_CricketPlayerTeam
FOREIGN KEY (teamId) REFERENCES cricket_team(Id)
)




CREATE TABLE player_performance (
  id VARCHAR(100) NOT NULL DEFAULT CAST(NEWID() AS VARCHAR(100)),
  cricketMatchId VARCHAR(100),
  cricketPlayerId VARCHAR(100),
  runs INT,
  wickets INT,
  catches INT,
  points INT,
  CONSTRAINT PK_PlayerPerfomanceID PRIMARY KEY (id),
  CONSTRAINT FK_PerfomanceMatch FOREIGN KEY (cricketMatchId) REFERENCES cricket_match(id),
  CONSTRAINT FK_PerfomancPlayer FOREIGN KEY (cricketPlayerId) REFERENCES cricket_player(id)
);




CREATE TABLE cricket_pool (
  id VARCHAR(100) NOT NULL,
  cricketMatchID VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'finished', 'cancelled')) DEFAULT 'pending',
  homeResult INT NULL,
  awayResult INT NULL,
  CONSTRAINT PK_CricketPoolID PRIMARY KEY (id),
  CONSTRAINT FK_PoolMatch FOREIGN KEY (cricketMatchID) REFERENCES cricket_match(id)
);

CREATE TABLE bets_options (
  id VARCHAR(100) NOT NULL DEFAULT CAST(NEWID() AS VARCHAR(100)),
  betName VARCHAR(100),
    CONSTRAINT PK_betOptionId PRIMARY KEY (id)
);

INSERT INTO bets_options(betName) VALUES ('Best runner')
INSERT INTO bets_options(betName) VALUES ('Best catcher')

CREATE TABLE cricket_special_bet (
  id VARCHAR(100) NOT NULL DEFAULT CAST(NEWID() AS VARCHAR(100)),
  specialBetId VARCHAR(100),
  playerId  VARCHAR(100),
  CONSTRAINT PK_CricketSpecialBet PRIMARY KEY (id),
  CONSTRAINT FK_BetsOption FOREIGN KEY (specialBetId) REFERENCES bets_options(id),
  CONSTRAINT FK_playerBet FOREIGN KEY (playerId) REFERENCES cricket_player(id)
);

CREATE TABLE cricket_player_historial (
  id VARCHAR(100) NOT NULL DEFAULT CAST(NEWID() AS VARCHAR(100)),
  playerId  VARCHAR(100),
    runs INT,
  wickets INT,
  catches INT,
  points INT,
  CONSTRAINT PK_CricketPlayerHistorial PRIMARY KEY (id),
  CONSTRAINT FK_playerHistorial FOREIGN KEY (playerId) REFERENCES cricket_player(id)
);

CREATE TABLE player_historial (
  id VARCHAR(100) NOT NULL DEFAULT CAST(NEWID() AS VARCHAR(100)),
  playerId VARCHAR(100),
  goals INT,
  assists INT,
  clean_sheet INT,
  yellow_card INT,
  red_card INT,
  CONSTRAINT PK_PlayerHistorialID PRIMARY KEY (id),
  CONSTRAINT FK_PlayerHistorialPlayer FOREIGN KEY (playerId) REFERENCES cricket_player(id)
);


