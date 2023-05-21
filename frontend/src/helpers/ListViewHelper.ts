import { ListView } from '../interfaces/ListView';
import { isNullOrUndefined, isNumber, isString } from './Helper';

export const ListViewHelper = {
  orderBy(direction: ListView['direction'], a?: unknown, b?: unknown): number {
    if (isNullOrUndefined(a) && isNullOrUndefined(b)) {
      return 0;
    }

    if (isNullOrUndefined(a)) {
      return direction === 'asc' ? 1 : -1;
    }

    if (isNullOrUndefined(b)) {
      return direction === 'asc' ? -1 : 1;
    }

    if (isNumber(a) && isNumber(b)) {
      return direction === 'asc' ? b - a : a - b;
    }

    if (isString(a) && isString(b)) {
      return direction === 'asc'
        ? b.localeCompare(a, undefined, { sensitivity: 'base' })
        : a.localeCompare(b, undefined, { sensitivity: 'base' });
    }

    return 0;
  },
};
