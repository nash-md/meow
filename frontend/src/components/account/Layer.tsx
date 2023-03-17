import { Button, Item, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ActionType, showModalSuccess } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { Account, AccountPreview } from '../../interfaces/Account';
import { ApplicationStore } from '../../store/ApplicationStore';
import {
  selectAccount,
  selectInterfaceStateId,
  store,
} from '../../store/Store';
import { Translations } from '../../Translations';
import { Events } from '../card/Events';
import { Form } from './Form';

export const Layer = () => {
  const { client } = useContext(RequestHelperContext);

  const id = useSelector(selectInterfaceStateId);
  const account = useSelector((store: ApplicationStore) =>
    selectAccount(store, id)
  );

  const hideAccountDetail = () => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'default', id: undefined },
    });
  };

  const update = async (
    id: Account['id'] | undefined,
    preview: AccountPreview
  ) => {
    if (id) {
      const updated = await client!.updateAccount({ ...account!, ...preview }); // TODO refactor

      store.dispatch({
        type: ActionType.ACCOUNT_UPDATE,
        payload: { ...updated },
      });
    } else {
      const updated = await client!.createAccount(preview); // TODO refactor

      store.dispatch({
        type: ActionType.ACCOUNT_ADD,
        payload: { ...updated },
      });

      store.dispatch(
        showModalSuccess(Translations.AccountCreatedConfirmation.en)
      );
    }
  };

  return (
    <div className="layer">
      <div className="header">
        <div style={{ float: 'right' }}>
          <Button variant="primary" onPress={() => hideAccountDetail()}>
            Close
          </Button>
        </div>
      </div>

      <div className="body">
        <Tabs height="100%">
          {(id && (
            <TabList>
              <Item key="account">
                <span className="tab-title">Account</span>
              </Item>
              <Item key="events">
                <span className="tab-title">History</span>
              </Item>
            </TabList>
          )) || (
            <TabList>
              <Item key="account">
                <span className="tab-title">Account</span>
              </Item>
            </TabList>
          )}

          <TabPanels>
            <Item key="account">
              <Form update={update} id={id} />
            </Item>
            <Item key="events">
              <Events entity="account" id={id} />
            </Item>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};
