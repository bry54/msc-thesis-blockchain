import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BlockchainService } from '../services/blockchain.service';

const resource: string = 'production';

@ApiTags(`Blockchain ${resource} queries`)
@Controller(`blockchain/${resource}`)
export class BlockchainController {
  constructor(public service: BlockchainService) {}

  @Get('')
  @ApiOperation({ summary: `Get all current world state for ${resource} records as they are on the blockchain` })
  async findMany() {
    return this.service.findMany();
  }

  @Get(':id')
  @ApiOperation({ summary: `Get the current world state for a ${resource} record` })
  @ApiParam({ name: 'id', description: `The ID of the ${resource} to query on the blockchain`, type: String })
  async findOne(@Param() id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: `Get the entire history a ${resource} record` })
  @ApiParam({ name: 'id', description: `The ID of the ${resource} whose history will be queried on blockchain`, type: String })
  async history(@Param('id') id: string) {
    return this.service.history(id);
  }
}
