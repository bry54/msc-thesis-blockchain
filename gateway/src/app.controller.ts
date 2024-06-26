import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  healthCheck(): unknown {
    return this.appService.getHealthCheck();
  }

  @Get('rec-compare')
  recCompare(): unknown {
    return this.appService.recCompare();
  }
}
