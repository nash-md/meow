import { Button } from '@adobe/react-spectrum';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { User, UserStatus } from '../../interfaces/User';
import { selectUserId, selectUsers, store } from '../../store/Store';

export const UserList = (props: any) => {
  const { client } = useContext(RequestHelperContext);
  const id = useSelector(selectUserId);
  const users = useSelector(selectUsers);

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
            <td>Status</td>
            <td>Invite</td>
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
                  <td>{user.status}</td>
                  <td>
                    {user.status === UserStatus.Invited && (
                      <Button
                        variant="primary"
                        onPress={() =>
                          props.copyToClipboard(
                            props.createInviteUrl(user.invite)
                          )
                        }
                      >
                        Copy Invite
                      </Button>
                    )}
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
