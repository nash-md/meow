import { Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ActionType, setListViewColumn, setListViewSortBy } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { User, UserStatus } from '../../interfaces/User';
import { selectUserId, selectUsers, selectView, selectViewColumns, store } from '../../store/Store';
import { ListViewHelper } from '../../helpers/ListViewHelper';
import { TableHeader } from '../view/table/TableHeader';
import { ApplicationStore } from '../../store/ApplicationStore';
import { toRelativeDate } from '../../helpers/DateHelper';
import { DataRow, ListViewItem } from '../../interfaces/ListView';
import { TableCanvas } from '../view/table/TableCanvas';
import { Row } from '../view/table/Row';

const createListViewItems = (): ListViewItem[] => {
  return [
    {
      name: 'Name',
      column: 'name',
      isHidden: false,
    },
    {
      name: 'Status',
      column: 'status',
      isHidden: false,
    },
    {
      name: 'Invite',
      column: 'invite',
      isHidden: false,
    },
    {
      name: 'Created At',
      column: 'createdAt',
      isHidden: false,
    },
    {
      name: null,
      column: null,
      isHidden: false,
    },
  ];
};

export const UserList = (props: any) => {
  const { client } = useContext(RequestHelperContext);
  const id = useSelector(selectUserId);
  const users = useSelector(selectUsers);
  const view = useSelector((store: ApplicationStore) => selectView(store, 'users'));
  const columns = useSelector((store: ApplicationStore) => selectViewColumns(store, 'users'));

  useEffect(() => {
    if (columns.length === 0) {
      store.dispatch(setListViewColumn('users', createListViewItems()));
    }
  }, []);

  const toDataRows = (list: User[]) => {
    return list.map((user) => {
      const row: DataRow = {
        id: user._id,
        name: user.name,
        status: user.status,
        invite: user.invite,
        createdAt: user.createdAt,
      };

      return row;
    });
  };

  const rows = useMemo(() => {
    const list = toDataRows(users);

    return ListViewHelper.filterAndOrder(list, columns, view);
  }, [view, users, columns]);

  const deleteUser = async (id: string) => {
    const user = users.find((user) => user._id === id)!;

    user.status = UserStatus.Deleted;

    try {
      await client?.updateUser(user);

      let users = await client!.getUsers(); // TODO refactor

      store.dispatch({
        type: ActionType.USERS,
        payload: [...users],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getCell = (row: DataRow, item: ListViewItem) => {
    {
      switch (item.column) {
        case 'name':
          return (
            <td key={item.column} style={{ width: '200px' }}>
              <b>{row.name}</b>
            </td>
          );
        case 'status':
          return <td key={item.column}>{row.status}</td>;
        case 'invite':
          return (
            <td key={item.column}>
              {row.status === UserStatus.Invited && (
                <Button
                  variant="primary"
                  onPress={() => props.copyToClipboard(props.createInviteUrl(row.invite))}
                >
                  Copy Invite
                </Button>
              )}
            </td>
          );
        case 'createdAt':
          return <td key={item.column}>{toRelativeDate(row.createdAt)}</td>;
        default:
          return (
            <td key={item.column} style={{ textAlign: 'right' }}>
              {row.id !== id && row.status !== UserStatus.Deleted && (
                <Button variant="cta" onPress={() => deleteUser(row.id!.toString())}>
                  delete
                </Button>
              )}
            </td>
          );
      }
    }
  };

  return (
    <div className="content-box">
      <h2>Users</h2>
      <TableCanvas>
        <TableHeader name="users" sort={setListViewSortBy} columns={columns} view={view} />

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
  );
};
