import { Controller } from '@nestjs/common';
import { ProductionService } from './production.service';
import { Crud, CrudController } from '@dataui/crud';
import { crudGeneralOptions } from '../../utils/helpers/request-helpers';
import { ApiTags } from '@nestjs/swagger';
import { Production } from './entities/production.entity';

@Crud({
  ...crudGeneralOptions,
  model: {
    type: Production,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase', 'recoverOneBase'],
  },
  query: {
    ...crudGeneralOptions.query,
  },
})
@ApiTags('Production')
@Controller('production')
export class ProductionController implements CrudController<Production>{
  constructor(public service: ProductionService) {}
}
