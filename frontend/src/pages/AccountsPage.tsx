import { Button, TextField } from '@adobe/react-spectrum';
import { DateTime } from 'luxon';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../actions/Actions';
import { Layer as AccountLayer } from '../components/account/Layer';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { selectAccounts, selectInterfaceState, store } from '../store/Store';

export const AccountsPage = () => {
  const { client } = useContext(RequestHelperContext);
  const state = useSelector(selectInterfaceState);
  const accounts = useSelector(selectAccounts);
  const [search, setSearch] = useState('');
  const [searchRegex, setSearchRegex] = useState(new RegExp('', 'i'));

  const showAccountDetail = (id?: string) => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'account-detail', id: id },
    });
  };

  useEffect(() => {
    setSearchRegex(new RegExp(search, 'i'));
  }, [search]);

  useEffect(() => {
    const execute = async () => {
      let users = await client!.getUsers();

      store.dispatch({
        type: ActionType.USERS,
        payload: [...users],
      });

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
      <div className="canvas search">
        <div className="header">
          <div>
            <Button variant="primary" onPress={() => showAccountDetail()}>
              Add
            </Button>
          </div>

          <div>
            <TextField
              onChange={setSearch}
              value={search}
              aria-label="Name"
              width="100%"
              key="search"
              placeholder="Search"
            />
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
              {accounts
                .filter((item) => searchRegex.test(item.name))
                .map((account, index) => {
                  const created = DateTime.fromISO(account.createdAt);

                  return (
                    <tr key={index}>
                      <td>
                        <b>{account.name}</b>
                      </td>
                      <td>{account.address}</td>
                      <td>{account.phone}</td>
                      <td>{created.toRelative()}</td>

                      <td style={{ textAlign: 'right', paddingRight: '0' }}>
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
