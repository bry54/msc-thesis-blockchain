import { Controller, Get } from '@nestjs/common';
import { FabricService } from './fabric.service';

@Controller('fabric')
export class FabricController {
  constructor(private readonly fabricService: FabricService) {}

  @Get()
  findAll() {
    //return this.fabricService.findAll();
  }
}
