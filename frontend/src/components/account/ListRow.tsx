import { DateTime } from 'luxon';
import { ActionType } from '../../actions/Actions';
import { store } from '../../store/Store';

export interface ListRowProps {
  item: Record<string, string | number | null | undefined>;
}

export const ListRow = ({ item }: ListRowProps) => {
  const row = [];

  const open = (id?: string) => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'account-detail', id: id },
    });
  };

  for (const key in item) {
    switch (key) {
      case 'id':
        break;

      case 'Name':
        row.push(
          <td key={key}>
            <span
              onClick={() => open(item.id?.toString())}
              className="direct-link"
            >
              {item.Name}
            </span>
          </td>
        );
        break;

      case 'CreatedAt':
        row.push(
          <td key={key}>
            {item.CreatedAt &&
              DateTime.fromISO(item.CreatedAt.toString()).toRelative()}
          </td>
        );
        break;

      default:
        row.push(<td key={key}>{item[key]}</td>);
        break;
    }
  }

  return <tr key={item.id}>{row}</tr>;
};
