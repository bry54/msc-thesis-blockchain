import { getValue } from 'express-ctx';
import { Params } from 'nestjs-pino';
import { PrettyOptions } from 'pino-pretty';
import { nanoid } from 'nanoid';
import { IncomingMessage, ServerResponse } from "http";

export const loggerParams: Params = {
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'hh:MM:ss dd/m/yyyy',

      }
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress
      }),
      res: (res) => ({
        statusCode: res.statusCode
      })
    },
    genReqId: () => {
      const reqContext = getValue('req');
      return reqContext ? reqContext.requestId || nanoid(10) : nanoid(10);
    }
  }
}