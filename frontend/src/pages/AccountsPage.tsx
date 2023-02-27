import { Button } from '@adobe/react-spectrum';
import { DateTime } from 'luxon';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../actions/Actions';
import { Layer as AccountLayer } from '../components/account/Layer';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { selectAccounts, selectInterfaceState, store } from '../store/Store';

export const AccountsPage = () => {
  const { client } = useContext(RequestHelperContext);
  const state = useSelector(selectInterfaceState);
  const accounts = useSelector(selectAccounts);

  const showAccountDetail = (id?: string) => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'account-detail', id: id },
    });
  };

  useEffect(() => {
    const execute = async () => {
      let accounts = await client!.getAccounts();

      store.dispatch({
        type: ActionType.ACCOUNTS,
        payload: [...accounts],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  return (
    <>
      {state === 'account-detail' && <AccountLayer />}
      <div className="canvas">
        <div className="title">
          <div style={{ paddingTop: '10px', paddingBottom: '20px' }}>
            <Button variant="primary" onPress={() => showAccountDetail()}>
              Add
            </Button>
          </div>
        </div>
        <div className="content-box tile">
          <h2>Accounts</h2>

          <table className="list" style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td>Name</td>
                <td>Address</td>
                <td>Phone Number</td>
                <td>Created</td>
                <td></td>
              </tr>
              {accounts.map((account, index) => {
                const created = DateTime.fromISO(account.createdAt);

                return (
                  <tr key={index}>
                    <td>
                      <b>{account.name}</b>
                    </td>
                    <td>{account.address}</td>
                    <td>{account.phone}</td>
                    <td>{created.toRelative()}</td>

                    <td>
                      <Button
                        onPress={() => showAccountDetail(account.id)}
                        variant="primary"
                      >
                        edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
