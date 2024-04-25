import {Injectable} from '@nestjs/common';
import {uptime} from 'process'

@Injectable()
export class AppService {
  getRootMessage(): unknown {
    return 'Gateway app';
  }

  getHealthCheck(): unknown {
    return {
      status: 'alive',
      upTime: uptime()
    };
  }
}
