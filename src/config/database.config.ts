import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CricketMatch, CricketPlayer, CricketPool, CricketTeam, PlayerPerformance } from 'src/schema';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: 'localhost',
  port: 1433, 
  username: 'Admin',
  password: 'admin',
  database: 'StarkFantasy',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  entities: [CricketMatch, CricketTeam, CricketPool, PlayerPerformance, CricketPlayer],
  synchronize: true, 
};
