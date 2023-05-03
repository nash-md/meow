import { Button, TextField } from '@adobe/react-spectrum';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType, setAccountListView } from '../actions/Actions';
import { Layer as AccountLayer } from '../components/account/Layer';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import {
  selectAccountListView,
  selectAccounts,
  selectInterfaceState,
  selectSchemaByType,
  store,
} from '../store/Store';
import { ListViewHelper } from '../helpers/ListViewHelper';
import { ListHeader } from '../components/account/ListHeader';
import { ListRow } from '../components/account/ListRow';
import { ApplicationStore } from '../store/ApplicationStore';
import { SchemaType } from '../interfaces/Schema';

export const AccountsPage = () => {
  const { client } = useContext(RequestHelperContext);
  const state = useSelector(selectInterfaceState);
  const accounts = useSelector(selectAccounts);
  const [search, setSearch] = useState('');
  const view = useSelector(selectAccountListView);

  const schema = useSelector((store: ApplicationStore) =>
    selectSchemaByType(store, SchemaType.Account)
  );

  const showAccountDetail = (id?: string) => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'account-detail', id: id },
    });
  };

  useEffect(() => {
    store.dispatch(
      setAccountListView({
        ...view,
        text: search,
      })
    );
  }, [search]);

  useEffect(() => {
    const execute = async () => {
      let accounts = await client!.getAccounts();

      store.dispatch({
        type: ActionType.ACCOUNTS,
        payload: [...accounts],
      });

      let schemas = await client!.fetchSchemas();

      store.dispatch({
        type: ActionType.SCHEMAS,
        payload: [...schemas],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  const rows = useMemo(() => {
    let list = [];

    if (view.text) {
      const regex = new RegExp(view.text, 'i');

      list = accounts.filter((item) => regex.test(item.name));
    } else {
      list = [...accounts];
    }

    return list
      .map((account) => {
        const row: Record<string, string | number | null | undefined> = {
          id: account.id,
          Name: account.name,
        };

        schema?.schema.map(({ name, key }) => {
          row[name] = account.attributes?.[key];
        });

        row.CreatedAt = account.createdAt;

        return row;
      })
      .sort((a, b) =>
        ListViewHelper.orderBy(
          view.direction,
          a[view.column ?? 'Name'],
          b[view.column ?? 'Name']
        )
      );
  }, [schema, view]);

  return (
    <>
      {state === 'account-detail' && <AccountLayer />}
      <div className="canvas">
        <div className="account-search-header">
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
          <h2>{rows.length} Accounts</h2>

          <table className="account-list" style={{ width: '100%' }}>
            <tbody>
              <ListHeader />

              {rows.map((item) => {
                return <ListRow key={item.id} item={item} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
