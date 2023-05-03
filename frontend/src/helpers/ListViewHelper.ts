import { ListView } from '../interfaces/ListView';
import { Schema } from '../interfaces/Schema';
import { isNullOrUndefined, isNumber, isString } from './Helper';

export const ListViewHelper = {
  orderBy(
    direction: ListView['direction'],
    a?: string | number | null,
    b?: string | number | null
  ): number {
    if (isNullOrUndefined(a) && isNullOrUndefined(b)) {
      return 0;
    }

    if (isNullOrUndefined(a)) {
      return direction === 'asc' ? -1 : 1;
    }

    if (isNullOrUndefined(b)) {
      return direction === 'asc' ? 1 : -1;
    }

    if (isNumber(a) && isNumber(b)) {
      return direction === 'asc' ? a - b : b - a;
    }

    if (isString(a) && isString(b)) {
      return direction === 'asc'
        ? a.localeCompare(b, undefined, { sensitivity: 'base' })
        : b.localeCompare(a, undefined, { sensitivity: 'base' });
    }

    return 0;
  },

  // TODO this is a temporary solution
  getHeader(schema?: Schema) {
    if (!schema) {
      return ['Name', 'CreatedAt'];
    }

    const fields = schema.schema.map((attribute) => {
      return attribute.name;
    });

    return ['Name', ...fields, 'CreatedAt'];
  },
};
