import { DataRow, ListView, ListViewItem, ListViewSortDirection } from '../interfaces/ListView';
import { isNullOrUndefined, isNumber, isString } from './Helper';

export const ListViewHelper = {
  orderBy(direction: ListViewSortDirection, a?: unknown, b?: unknown): number {
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

  filterAndOrder(rows: DataRow[], columns: ListViewItem[], view: ListView) {
    if (!columns[0]) {
      return [];
    }

    if (columns[0].column === null) {
      throw new Error('Invalid column, property name is null');
    }

    let list = [];

    if (view.filterBy.text) {
      const regex = new RegExp(view.filterBy.text, 'i');

      list = rows.filter((row) => regex.test(row.name));
    } else {
      list = [...rows];
    }

    const column = view.sortBy.column ?? columns[0].column;

    return list.sort((a, b) => ListViewHelper.orderBy(view.sortBy.direction, a[column], b[column]));
  },
};
