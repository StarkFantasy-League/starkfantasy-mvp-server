import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CricketMatch, CricketPlayer, CricketPool, CricketTeam, PlayerPerformance, BetsOptions, SpecialBet } from 'src/schema';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: configService.get('DB_HOST') || 'localhost',
  port: parseInt(configService.get('DB_PORT') || "1433"),
  username: configService.get('DB_USERNAME') || 'sa',
  password: configService.get('DB_PASSWORD') || 'admin123!',
  database: configService.get('DB_DATABASE') || 'StarkFantasy',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  entities: [CricketMatch, CricketTeam, CricketPool, PlayerPerformance, CricketPlayer, BetsOptions, SpecialBet],
  synchronize: false,
});
