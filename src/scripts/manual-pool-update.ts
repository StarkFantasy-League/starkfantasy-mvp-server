import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TaskPoolService } from '../sports/modules/job/pool-cron.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const poolService = app.get(TaskPoolService);
    await poolService.updatePoolResults();
    console.log('Pool results update completed.');
  } catch (error) {
    console.error('Error running pool results update:', error);
  } finally {
    await app.close();
  }
}

main();
