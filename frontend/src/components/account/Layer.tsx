import { Button } from '@adobe/react-spectrum';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { Account, AccountPreview } from '../../interfaces/Account';
import { ApplicationStore } from '../../store/ApplicationStore';
import {
  selectAccount,
  selectInterfaceStateId,
  store,
} from '../../store/Store';
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
        <Form update={update} id={id} />
      </div>
    </div>
  );
};
