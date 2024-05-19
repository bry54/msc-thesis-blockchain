import { Controller, Get } from '@nestjs/common';
import { FabricService } from './fabric.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Fabric')
@Controller('fabric')
export class FabricController {
  constructor(private readonly fabricService: FabricService) {}

  @Get('configurations')
  displayInputParameters() {
    return this.fabricService.displayInputParameters();
  }
}
