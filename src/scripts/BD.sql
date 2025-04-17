-- CREATE DATABASE StarkFantasy 

Use StarkFantasy


CREATE TABLE cricket_team (
id VARCHAR(100) UNIQUE NOT NULL,
name VARCHAR (200),
image_path VARCHAR(300)
    CONSTRAINT PK_CricketTeamID PRIMARY KEY (Id)
)

CREATE TABLE cricket_match (
    id VARCHAR(100) NOT NULL, 
    homeTeamId VARCHAR(100),
    awayTeamId VARCHAR(100),
    matchDate DATETIME,
    CONSTRAINT PK_CricketMatchID PRIMARY KEY (Id),
    CONSTRAINT FK_CricketMatchHomeTeamID FOREIGN KEY (HomeTeamId) REFERENCES CricketTeam(Id),
    CONSTRAINT FK_CricketMatchAwayTeamID FOREIGN KEY (AwayTeamId) REFERENCES CricketTeam(Id)
);




CREATE TABLE cricket_player (
id VARCHAR(100)UNIQUE NOT NULL, 
teamId VARCHAR(100),
firstName VARCHAR (50),
lastName VARCHAR (100),
position VARCHAR (25),
image_path VARCHAR(300)
    CONSTRAINT PK_CricketPlayerID PRIMARY KEY (Id),
	CONSTRAINT FK_CricketPlayerTeam
FOREIGN KEY (teamId) REFERENCES CricketTeam(Id)
)


CREATE TABLE player_performance (
  id VARCHAR(100) NOT NULL DEFAULT CAST(NEWID() AS VARCHAR(100)),
  cricketMatchId VARCHAR(100),
  cricketPlayerId VARCHAR(100),
  runs INT,
  wickets INT,
  catches INT,
  CONSTRAINT PK_PlayerPerfomanceID PRIMARY KEY (id),
  CONSTRAINT FK_PerfomanceMatch FOREIGN KEY (cricketMatchId) REFERENCES CricketMatch(id),
  CONSTRAINT FK_PerfomancPlayer FOREIGN KEY (cricketPlayerId) REFERENCES CricketPlayer(id)
);




CREATE TABLE cricket_pool (
  id VARCHAR(100) NOT NULL DEFAULT CAST(NEWID() AS VARCHAR(100)),
  cricketMatchID VARCHAR(100),
  CONSTRAINT PK_CricketPoolID PRIMARY KEY (id),
  CONSTRAINT FK_PoolMatch FOREIGN KEY (cricketMatchID) REFERENCES CricketMatch(id)
);

INSERT INTO cricket_team  (id,image_path,name) VALUES ('2732','','Free journey')