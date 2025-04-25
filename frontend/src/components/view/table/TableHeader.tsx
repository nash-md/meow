import { ListView, ListViewItem, ListViewSortDirection } from '../../../interfaces/ListView';
import { IconArrowUp } from '../IconArrowUp';
import { IconArrowDown } from '../IconArrowDown';
import { store } from '../../../store/Store';
import { ListName } from '../../../store/ApplicationStore';
import { IconArrowPlaceholder } from '../IconArrowPlaceholder';

interface TableHeaderProps {
  view: ListView;
  name: ListName;
  columns: ListViewItem[];
  sort: (name: ListName, column: string, direction: ListViewSortDirection) => any;
}

export const TableHeader = ({ name, view, columns, sort }: TableHeaderProps) => {
  const setOrderBy = (column: string) => {
    let direction: ListViewSortDirection = 'desc';

    if (column === view.sortBy.column) {
      direction = view.sortBy.direction === 'desc' ? 'asc' : 'desc';
    }

    store.dispatch(sort(name, column, direction));
  };

  const getArrow = (column: string) => {
    if (view.sortBy.column !== column) {
      return <IconArrowPlaceholder />;
    }

    return view.sortBy.direction === 'asc' ? <IconArrowUp /> : <IconArrowDown />;
  };

  return (
    <tr>
      {columns
        .filter(({ isHidden }) => !isHidden)
        .map((item, index) => {
          if (item.column === null) {
            return <td key={`column_${index}`}></td>;
          }

          return (
            <td
              key={`column_${index}`}
              onClick={() => {
                if (item.column !== null) {
                  setOrderBy(item.column);
                }
              }}
            >
              <div className="header">
                <div>{item.name}</div>
                <div>{getArrow(item.column)}</div>
              </div>
            </td>
          );
        })}
    </tr>
  );
};
