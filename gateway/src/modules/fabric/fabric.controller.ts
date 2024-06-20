import { Controller, Get } from '@nestjs/common';
import { FabricService } from './fabric.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Fabric')
@Controller('fabric')
export class FabricController {
  constructor(private readonly fabricService: FabricService) {}

  @Get('configurations')
  displayInputParameters() {
    return this.fabricService.displayInputParameters();
  }
}
