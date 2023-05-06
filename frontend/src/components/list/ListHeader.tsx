import { ListView } from '../../interfaces/ListView';
import { IconArrowUp } from './IconArrowUp';
import { IconArrowDown } from './IconArrowDown';
import { store } from '../../store/Store';
import { ListName } from '../../store/ApplicationStore';
import { IconArrowPlaceholder } from './IconArrowPlaceholder';

interface ListHeaderProps {
  view: ListView;
  name: ListName;
  columns: (string | null)[];
  sort: (name: ListName, view: ListView) => any;
}

export const ListHeader = ({ name, view, columns, sort }: ListHeaderProps) => {
  const setOrderBy = (column: string) => {
    let direction: ListView['direction'] = 'desc';

    if (column === view.column) {
      direction = view.direction === 'desc' ? 'asc' : 'desc';
    }

    store.dispatch(
      sort(name, { ...view, direction: direction, column: column })
    );
  };

  const getArrow = (column: string) => {
    if (view.column !== column) {
      return <IconArrowPlaceholder />;
    }

    return view.direction === 'asc' ? <IconArrowUp /> : <IconArrowDown />;
  };

  return (
    <tr>
      {columns.map((column, index) => {
        if (column === null) {
          return <td key={`column_${index}`}></td>;
        }

        return (
          <td key={`column_${index}`} onClick={() => setOrderBy(column)}>
            <div className="header">
              <div>{column}</div>
              <div>{getArrow(column)}</div>
            </div>
          </td>
        );
      })}
    </tr>
  );
};
