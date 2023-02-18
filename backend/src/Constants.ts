import { SchemaAttribute } from './entities/Schema.js';

export const SERVICE_NAME = 'meow-backend-service';
export const MAXIMUM_LENGTH_OF_USER_NAME = 20;
export const MINIMUM_LENGTH_OF_USER_NAME = 5;
export const MAXIMUM_LENGTH_OF_USER_PASSWORD = 40;
export const MINIMUM_LENGTH_OF_USER_PASSWORD = 5;
export const IS_ISO_8601_REGEXP =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
export const FILTER_BY_NONE = { name: 'Everyone', key: 'all' };

export const DefaultLanes = [
  { name: 'Not Qualified', inForecast: true, tags: { type: 'normal' } },
  { name: 'Qualified', inForecast: true, tags: { type: 'normal' } },
  { name: 'Comitted', inForecast: true, tags: { type: 'normal' } },
  {
    name: 'Closed Won',
    color: '#00b359',
    inForecast: false,
    tags: { type: 'closed-won' },
  },
  {
    name: 'Closed Lost',
    color: '#e30544',
    inForecast: false,
    tags: { type: 'closed-lost' },
  },
];

export const DefaultSchema = {
  type: 'card',
  schema: [
    {
      key: '6cdd2d99-c0c9-1f20-60eb-5ba24d548348',
      index: 0,
      type: 'text',
      name: 'Company Name',
    },
    {
      key: 'c1cc9338-4d4c-f494-cbee-16f4faa9528c',
      index: 1,
      type: 'textarea',
      name: 'Notes',
    },
  ],
} as {
  type: string;
  schema: SchemaAttribute[];
};

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const ANIMALS: string[] = [
  'Squirrel',
  'Bear',
  'Raccoon',
  'Lion',
  'Penguin',
  'Walrus',
  'Monkey',
  'Tiger',
  'Elephant',
  'Giraffe',
  'Kangaroo',
  'Dolphin',
  'Shark',
  'Octopus',
  'Gorilla',
  'Leopard',
  'Wolf',
  'Zebra',
];
