import { useSelector } from 'react-redux';
import { setAccountListView } from '../../actions/Actions';
import { ListViewHelper } from '../../helpers/ListViewHelper';
import { ListView } from '../../interfaces/ListView';
import {
  selectAccountListView,
  selectSchemaByType,
  store,
} from '../../store/Store';
import { IconArrowUp } from './IconArrowUp';
import { IconArrowDown } from './IconArrowDown';
import { ApplicationStore } from '../../store/ApplicationStore';
import { SchemaType } from '../../interfaces/Schema';

export const ListHeader = () => {
  const view = useSelector(selectAccountListView);

  const schema = useSelector((store: ApplicationStore) =>
    selectSchemaByType(store, SchemaType.Account)
  );

  const setOrderBy = (column: string) => {
    let direction: ListView['direction'] = 'desc';

    if (column === view.column) {
      direction = view.direction === 'desc' ? 'asc' : 'desc';
    }

    store.dispatch(
      setAccountListView({
        ...view,
        direction: direction,
        column: column,
      })
    );
  };

  const getArrow = (column: string) => {
    if (view.column !== column) {
      return <div style={{ width: '10px' }}></div>;
    }

    return view.direction === 'asc' ? <IconArrowUp /> : <IconArrowDown />;
  };

  return (
    <tr>
      {ListViewHelper.getHeader(schema).map((column, index) => {
        return (
          <td key={index} onClick={() => setOrderBy(column)}>
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
