import { SERVICE_NAME } from './Constants.js';

import pino from 'pino';

// @ts-ignore
export const log = pino({
  name: SERVICE_NAME,
  level: process.env.LOG_LEVEL || 'info',
});

process.on('uncaughtException', log.fatal.bind(log));
