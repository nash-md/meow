import { LaneType } from './entities/Lane.js';
import { SchemaAttribute, SchemaType } from './entities/Schema.js';

export const SERVICE_NAME = 'meow-backend-service';
export const MAXIMUM_LENGTH_OF_USER_NAME = 20;
export const MINIMUM_LENGTH_OF_USER_NAME = 3;
export const MAXIMUM_LENGTH_OF_USER_PASSWORD = 40;
export const MINIMUM_LENGTH_OF_USER_PASSWORD = 3;
export const IS_ISO_8601_REGEXP =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
export const IS_ISO_8601_DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/;
export const FILTER_BY_NONE = { name: 'Everyone', key: 'all' };

export const DefaultLanes = [
  { name: 'Not Qualified', inForecast: true, tags: { type: 'normal' } },
  { name: 'Qualified', inForecast: true, tags: { type: 'normal' } },
  { name: 'Comitted', inForecast: true, tags: { type: 'normal' } },
  {
    name: 'Closed Won',
    color: '#00b359',
    inForecast: false,
    tags: { type: LaneType.ClosedWon },
  },
  {
    name: 'Closed Lost',
    color: '#e30544',
    inForecast: false,
    tags: { type: LaneType.ClosedLost },
  },
];

export const DefaultCards = [
  { name: 'Paw Prints Photography', amount: 32000 },
  { name: 'Squirrelly Sweets', amount: 80000 },
  { name: 'Monkey Business Consulting', amount: 28000 },
  { name: 'Snail Mail Emporium', amount: 20000 },
  { name: 'Horsepower Landscaping', amount: 64000 },
];

export const DefaultCardSchema = {
  type: SchemaType.Card,
  schema: [
    {
      key: '6cdd2d99-c0c9-1f20-60eb-5ba24d548348',
      index: 0,
      type: 'text',
      name: 'Contact',
    },
    {
      key: 'c1cc9338-4d4c-f494-cbee-16f4faa9528c',
      index: 1,
      type: 'textarea',
      name: 'Notes',
    },
  ],
} as {
  type: SchemaType;
  schema: SchemaAttribute[];
};

export const DefaultAccountSchema = {
  type: SchemaType.Account,
  schema: [
    {
      key: '6cdd2d99-c0c9-1f20-60eb-5ba24d548346',
      index: 0,
      type: 'text',
      name: 'City',
    },
    {
      key: 'c1cc9138-4d4c-f494-cbee-16f4faa95284',
      index: 1,
      type: 'textarea',
      name: 'Address',
    },
    {
      key: 'c12c9338-4d4c-f494-cbee-16f4faa91284',
      index: 2,
      type: 'text',
      name: 'Phone',
    },
  ],
} as {
  type: SchemaType;
  schema: SchemaAttribute[];
};

export const DefaultAccounts = [{ name: 'Unicorn Corporate' }];

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

export const RESERVED_ATTRIBUTES = [
  'id',
  'createdat',
  'updatedat',
  'attribute',
  'teamid',
  'accountid',
  'attributes',
];

export const RESERVED_USERS = ['id', 'all'];
