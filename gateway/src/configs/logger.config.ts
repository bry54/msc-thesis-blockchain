import { getValue } from 'express-ctx';
import { Params } from 'nestjs-pino';
import { nanoid } from 'nanoid';

export const loggerParams: Params = {
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'hh:MM:ss dd/m/yyyy',
      },
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
    genReqId: () => {
      const reqContext = getValue('req');
      return reqContext ? reqContext.requestId || nanoid(10) : nanoid(10);
    },
  },
};
