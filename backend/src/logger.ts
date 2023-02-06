import { SERVICE_NAME } from './worker';

import P from 'pino';
export const log = P({
  name: SERVICE_NAME,
  level: process.env.LOG_LEVEL || 'info',
});

process.on('uncaughtException', log.fatal.bind(log));
