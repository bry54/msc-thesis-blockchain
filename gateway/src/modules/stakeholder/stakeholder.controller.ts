import { Controller, Get, Param } from '@nestjs/common';
import { StakeholderService } from './stakeholder.service';
import { ApiTags } from '@nestjs/swagger';
import { Stakeholder } from './entities/stakeholder.entity';
import { Crud, CrudController } from '@dataui/crud';
import { crudGeneralOptions } from '../../utils/helpers/request-helpers';

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
  constructor(public service: StakeholderService) {}

  @Get('blockchain-records')
  async blockchainFindMany() {
    return this.service.blockchainFindMany();
  }

  @Get('blockchain-record/:id')
  async blockchainFindOne(@Param('id') id: string) {
    return this.service.blockchainFindOne(id);
  }
}
