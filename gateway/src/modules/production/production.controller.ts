import {Body, Controller} from '@nestjs/common';
import { ProductionService } from './production.service';
import {Crud, CrudController, CrudRequest, Override, ParsedRequest} from '@dataui/crud';
import {AuthUser, crudGeneralOptions} from '../../utils/helpers/request-helpers';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
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

@ApiBearerAuth()
@ApiTags('Production')
@Controller('production')
export class ProductionController implements CrudController<Production> {
  constructor(public service: ProductionService) {}

  @Override('createOneBase')
  createOne(
      @ParsedRequest() req: CrudRequest,
      @Body() dto: Production,
      @AuthUser() authenticated: any
  ): Promise<Production> {
    dto.authenticated = authenticated
    return this.service.createOne(req, dto);
  }
}
