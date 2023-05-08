import { Item, Picker } from '@adobe/react-spectrum';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ListHeader } from '../list/ListHeader';
import { ApplicationStore } from '../../store/ApplicationStore';
import { useSelector } from 'react-redux';
import { selectUsers, selectView, store } from '../../store/Store';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { CalendarDate } from '@internationalized/date';
import { DateTime } from 'luxon';
import {
  ActionType,
  setListView,
  showCardLayer,
  showModalError,
} from '../../actions/Actions';
import { toIntervalInDays, toRelativeDate } from '../../helpers/DateHelper';
import { ListViewHelper } from '../../helpers/ListViewHelper';
import { Currency } from '../Currency';
import { getErrorMessage } from '../../helpers/ErrorHelper';

const columns = [
  'Name',
  'Amount',
  'Created',
  'Closed',
  'Deal Duration',
  'User',
];

interface Row {
  id: string;
  Name: string;
  Amount: number;
  Created: string | null;
  Closed: string | null;
  'Deal Duration': string | undefined;
  User: string | undefined;
  [key: string]: string | number | null | undefined;
}

interface CardListProps {
  userId: string;
  start: CalendarDate;
  end: CalendarDate;
}

export const CardList = ({ userId, start, end }: CardListProps) => {
  const { client } = useContext(RequestHelperContext);
  const users = useSelector(selectUsers);
  const [mode, setMode] = useState<'achieved' | 'predicted'>('achieved');
  const [list, setList] = useState<Array<any>>([]); // TODO remove any

  const view = useSelector(
    (store: ApplicationStore) => selectView(store, 'forecast') // TODO use enum
  );

  const openCard = (id?: string) => {
    store.dispatch(showCardLayer(id));
  };

  useEffect(() => {
    const execute = async () => {
      let cards = await client!.getCards(); // TODO missing fetch

      store.dispatch({
        type: ActionType.CARDS,
        payload: [...cards],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  useEffect(() => {
    start.toString();
    end.toString();

    const execute = async () => {
      try {
        const [list] = await Promise.all([
          client!.fetchForecastList(
            DateTime.fromISO(start.toString()),
            DateTime.fromISO(end.toString()),
            userId,
            mode
          ),
        ]);
        setList(list);
      } catch (error) {
        console.log(error);

        const message = await getErrorMessage(error);

        store.dispatch(showModalError(message));
      }
    };

    if (start && end && client && userId && mode) {
      execute();
    }
  }, [client, start, end, userId, mode]);

  const rows = useMemo(() => {
    const column = view.column ?? columns[0]!;

    return list
      .map((card: any) => {
        const user = users.find((user) => user.id === card.userId);

        const row: Row = {
          id: card.id,
          Name: card.name,
          Amount: card.amount,
          Created: toRelativeDate(card.createdAt),
          Closed: toRelativeDate(card.closedAt),
          ['Deal Duration']: toIntervalInDays(card.createdAt, card.closedAt),
          User: user?.name,
        };

        return row;
      })
      .sort((a, b) =>
        ListViewHelper.orderBy(view.direction, a[column], b[column])
      );
  }, [view, list]);

  return (
    <section className="content-box tile">
      <Picker
        defaultSelectedKey={mode}
        onSelectionChange={(key) => {
          setMode(key.toString() as 'achieved' | 'predicted');
        }}
      >
        <Item key="achieved">Closed Won</Item>
        <Item key="predicted">All Open</Item>
      </Picker>

      <table className="list" style={{ width: '100%' }}>
        <tbody>
          <ListHeader
            name="forecast"
            sort={setListView}
            view={view}
            columns={columns}
          />

          {rows.map((row, index) => {
            return (
              <tr key={index}>
                <td>
                  <span
                    onClick={() => openCard(row.id)}
                    className="direct-link"
                  >
                    {row.Name}
                  </span>
                </td>
                <td>
                  <b>
                    <Currency key={index} value={row.Amount} />
                  </b>
                </td>
                <td>{row.Created}</td>
                <td>{row.Closed}</td>
                <td>{row['Deal Duration']}</td>
                <td>{row.User}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
