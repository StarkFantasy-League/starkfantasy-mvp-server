import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('load')
  async loadApiData() {
    return await this.appService.load();
  }

  @Post('loadHistory')
  async loadHistoryData() {
    return await this.appService.loadHistory();
  }

  @Post('loadPerformances')
  async loadPerformances() {
    return await this.appService.loadPerformances();
  }

  @Post('deletePerformance')
  async delete() {
    return await this.appService.deletePerformances();
  }
}

