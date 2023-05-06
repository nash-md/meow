import { Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ActionType, setListView } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { UserStatus } from '../../interfaces/User';
import {
  selectUserId,
  selectUsers,
  selectView,
  store,
} from '../../store/Store';
import { ListViewHelper } from '../../helpers/ListViewHelper';
import { ListHeader } from '../list/ListHeader';
import { ApplicationStore } from '../../store/ApplicationStore';
import { toRelativeDate } from '../../helpers/DateHelper';

export const UserList = (props: any) => {
  const { client } = useContext(RequestHelperContext);
  const id = useSelector(selectUserId);
  const users = useSelector(selectUsers);
  const view = useSelector((store: ApplicationStore) =>
    selectView(store, 'users')
  );

  const columns = ['Name', 'Status', 'Invite', 'CreatedAt', null];

  interface Row {
    id: string;
    Name: string;
    Status: UserStatus;
    Invite: string | undefined;
    CreatedAt: string | undefined;
    [key: string]: string | UserStatus | undefined;
  }

  const rows = useMemo(() => {
    let list = [...users.filter((user) => user.status !== UserStatus.Deleted)];

    const column = view.column ?? (columns[0] as string);

    return list
      .map((user) => {
        const row: Row = {
          id: user.id,
          Name: user.name,
          Status: user.status,
          Invite: user.invite,
          CreatedAt: user.createdAt,
        };

        return row;
      })
      .sort((a, b) =>
        ListViewHelper.orderBy(view.direction, a[column], b[column])
      );
  }, [view, users]);

  const deleteUser = async (id: string) => {
    const user = users.find((user) => user.id === id)!;

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

  return (
    <div className="content-box">
      <h2>Users</h2>
      <table className="list" style={{ width: '100%' }}>
        <tbody>
          <ListHeader
            name="users"
            sort={setListView}
            columns={columns}
            view={view}
          />

          {rows.map((row, index) => {
            return (
              <tr key={index}>
                <td style={{ width: '200px' }}>
                  <b>{row.Name}</b>
                </td>
                <td>{row.Status}</td>
                <td>
                  {row.Status === UserStatus.Invited && (
                    <Button
                      variant="primary"
                      onPress={() =>
                        props.copyToClipboard(props.createInviteUrl(row.Invite))
                      }
                    >
                      Copy Invite
                    </Button>
                  )}
                </td>
                <td>{toRelativeDate(row.CreatedAt)}</td>

                <td style={{ textAlign: 'right' }}>
                  {row.id !== id && (
                    <Button
                      variant="cta"
                      onPress={() => deleteUser(row.id!.toString())}
                    >
                      delete
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
