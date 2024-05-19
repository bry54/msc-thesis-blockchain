import { Controller, Get, Param } from '@nestjs/common';
import { StakeholderService } from './stakeholder.service';
import { ApiTags } from '@nestjs/swagger';
import { Stakeholder } from './entities/stakeholder.entity';
import { Crud, CrudController } from '@dataui/crud';
import { crudGeneralOptions } from '../../utils/helpers/request-helpers';
import { BlockchainService } from './services/blockchain.service';

@Crud({
  ...crudGeneralOptions,
  model: {
    type: Stakeholder,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase', 'recoverOneBase'],
  },
  query: {
    ...crudGeneralOptions.query,
  },
})
@ApiTags('Stakeholders')
@Controller('stakeholder')
export class StakeholderController implements CrudController<Stakeholder> {
  constructor(
    public service: StakeholderService,
    public blockchainService: BlockchainService
  ) {}

  /*@Get('blockchain-records')
  async blockchainFindMany() {
    return this.blockchainService.findMany();
  }

  @Get('blockchain-record/:id')
  async blockchainFindOne(@Param('id') id: string) {
    return this.blockchainService.findOne(id);
  }

  @Get('blockchain-history/:id')
  async blockchainHistory(@Param('id') id: string) {
    return this.blockchainService.history(id);
  }*/
}
