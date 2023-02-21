import { Button } from '@adobe/react-spectrum';
import { DateTime } from 'luxon';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { User, UserStatus } from '../../interfaces/User';
import { selectUserId, selectUsers, store } from '../../store/Store';

export const UserList = () => {
  const { client } = useContext(RequestHelperContext);
  const id = useSelector(selectUserId);
  const users = useSelector(selectUsers);

  useEffect(() => {
    const execute = async () => {
      let users = await client!.getUsers();

      store.dispatch({
        type: ActionType.USERS,
        payload: [...users],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  const deleteUser = async (user: User) => {
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
      <table className="list">
        <tbody>
          <tr>
            <td>Name</td>
            <td>Created</td>
            <td></td>
          </tr>
          {users
            .filter((user) => user.status !== UserStatus.Deleted)
            .map((user) => {
              const ago = user.createdAt
                ? DateTime.fromISO(user.createdAt).toRelative()
                : '';

              return (
                <tr key={user.id}>
                  <td style={{ width: '200px' }}>
                    <b>{user.name}</b>
                  </td>
                  <td>{ago}</td>

                  <td>
                    {user.id !== id && (
                      <Button variant="cta" onPress={() => deleteUser(user)}>
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
