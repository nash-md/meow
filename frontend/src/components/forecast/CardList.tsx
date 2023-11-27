import { Item, Picker } from '@adobe/react-spectrum';
import { useEffect, useMemo, useState } from 'react';
import { TableHeader } from '../view/table/TableHeader';
import { ApplicationStore } from '../../store/ApplicationStore';
import { useSelector } from 'react-redux';
import { selectToken, selectUsers, selectView, selectViewColumns, store } from '../../store/Store';
import { DateTime } from 'luxon';
import {
  ActionType,
  setListViewColumn,
  setListViewSortBy,
  showCardLayer,
  showModalError,
} from '../../actions/Actions';
import { toIntervalInDays, toRelativeDate } from '../../helpers/DateHelper';
import { ListViewHelper } from '../../helpers/ListViewHelper';
import { Currency } from '../Currency';
import { getErrorMessage } from '../../helpers/ErrorHelper';
import { FILTER_BY_NONE } from '../../Constants';
import { DataRow, ListViewItem } from '../../interfaces/ListView';
import { Item as ListItem } from '../../components/view/list/Item';
import { Row } from '../view/table/Row';
import { TableCanvas } from '../view/table/TableCanvas';
import useMobileLayout from '../../hooks/useMobileLayout';
import { getRequestClient } from '../../helpers/RequestHelper';

interface CardListProps {
  userId: string;
  start: string | null;
  end: string | null;
}

const createListViewItems = (): ListViewItem[] => {
  return [
    {
      name: 'Name',
      column: 'name',
      isHidden: false,
    },
    {
      name: 'Amount',
      column: 'amount',
      isHidden: false,
    },
    {
      name: 'Created',
      column: 'created',
      isHidden: false,
    },
    {
      name: 'Closed',
      column: 'closed',
      isHidden: false,
    },
    {
      name: 'Deal Duration',
      column: 'deal-duration',
      isHidden: false,
    },
    {
      name: 'User',
      column: 'user',
      isHidden: false,
    },
  ];
};

export const CardList = ({ userId, start, end }: CardListProps) => {
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const users = useSelector(selectUsers);
  const [mode, setMode] = useState<'achieved' | 'predicted'>('achieved');
  const [list, setList] = useState<Array<any>>([]); // TODO remove any
  const columns = useSelector((store: ApplicationStore) => selectViewColumns(store, 'forecast'));
  const isMobileLayout = useMobileLayout();

  const view = useSelector(
    (store: ApplicationStore) => selectView(store, 'forecast') // TODO use enum
  );

  const openCard = (id?: string) => {
    store.dispatch(showCardLayer(id));
  };

  useEffect(() => {
    if (columns.length === 0) {
      store.dispatch(setListViewColumn('forecast', createListViewItems()));
    }
  }, []);

  useEffect(() => {
    const execute = async (start: string, end: string) => {
      let cards = await client.getCardsByDateRange(start, end); // TODO missing fetch

      store.dispatch({
        type: ActionType.CARDS,
        payload: [...cards],
      });
    };

    if (start && end) {
      execute(start, end);
    }
  }, [start, end]);

  useEffect(() => {
    if (!start || !end) {
      return;
    }

    const execute = async () => {
      try {
        const list = await client.fetchForecastList(
          DateTime.fromISO(start),
          DateTime.fromISO(end),
          mode,
          userId === FILTER_BY_NONE.key ? undefined : userId
        );
        setList(list);
      } catch (error) {
        console.log(error);

        const message = await getErrorMessage(error);

        store.dispatch(showModalError(message));
      }
    };

    if (start && end && userId && mode) {
      execute();
    }
  }, [start, end, userId, mode]);

  const toDataRows = (list: any[]) => {
    return list.map((card) => {
      const user = users.find((user) => user._id === card.userId);

      const row: DataRow = {
        id: card.id,
        name: card.name,
        amount: card.amount,
        created: toRelativeDate(card.createdAt),
        closed: toRelativeDate(card.closedAt),
        ['deal-duration']: toIntervalInDays(card.createdAt, card.closedAt),
        user: user?.name,
      };

      return row;
    });
  };

  const rows = useMemo(() => {
    return ListViewHelper.filterAndOrder(toDataRows(list), columns, view);
  }, [view, list]);

  const getCell = (row: DataRow, item: ListViewItem) => {
    switch (item.column) {
      case 'name':
        return (
          <td key={item.column}>
            <span onClick={() => openCard(row.id?.toString())} className="direct-link">
              {row.name}
            </span>
          </td>
        );
      case 'amount':
        return (
          <td key={item.column}>
            <b>
              <Currency value={row.amount ? parseInt(row.amount?.toString()) : 0} />
            </b>
          </td>
        );
      default:
        return <td key={item.column}>{item.column !== null && row[item.column]}</td>;
    }
  };

  const getListItem = (row: DataRow, item: ListViewItem) => {
    switch (item.column) {
      case 'name':
        return (
          <div key={item.column}>
            <span
              style={{}}
              onClick={() => openCard(row.id?.toString())}
              className="direct-link title"
            >
              {row.name}
            </span>
          </div>
        );
      case 'amount':
        return (
          <div key={item.column}>
            <b>{item.name}:</b>
            <Currency value={row.amount ? parseInt(row.amount?.toString()) : 0}></Currency>
          </div>
        );
      default:
        return item.column !== null && row[item.column] ? (
          <div key={item.column}>
            <b>{item.name}:</b> {row[item.column]}
          </div>
        ) : null;
    }
  };

  return (
    <>
      <section className="content-box" style={{ overflow: 'auto' }}>
        <Picker
          defaultSelectedKey={mode}
          onSelectionChange={(key) => {
            setMode(key.toString() as 'achieved' | 'predicted');
          }}
        >
          <Item key="achieved">Closed Won</Item>
          <Item key="predicted">All Open</Item>
        </Picker>
      </section>

      {isMobileLayout ? (
        <div className="mobile-view">
          {rows.map((row, index) => {
            return (
              <ListItem key={index}>
                {columns
                  .filter(({ isHidden }) => isHidden === false)
                  .map((item) => getListItem(row, item))}
              </ListItem>
            );
          })}
        </div>
      ) : (
        <div className="content-box" style={{ overflow: 'auto' }}>
          <TableCanvas>
            <TableHeader name="forecast" sort={setListViewSortBy} view={view} columns={columns} />

            {rows.map((row, index) => {
              return (
                <Row key={index}>
                  {columns
                    .filter(({ isHidden }) => isHidden === false)
                    .map((item) => getCell(row, item))}
                </Row>
              );
            })}
          </TableCanvas>
        </div>
      )}
    </>
  );
};
