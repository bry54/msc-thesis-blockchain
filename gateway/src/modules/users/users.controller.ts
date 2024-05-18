import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@dataui/crud';
import { User } from './entities/user.entity';
import { crudGeneralOptions } from '../../utils/helpers/request-helpers';

@Crud({
  ...crudGeneralOptions,
  model: {
    type: User,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase', 'recoverOneBase'],
  },
  query: {
    ...crudGeneralOptions.query,
  },
})
@ApiTags('Users')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}
}
