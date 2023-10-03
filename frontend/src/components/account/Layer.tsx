import { Button, Item, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { addAccount, hideLayer, showModalSuccess, updateAccount } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { Account, AccountPreview } from '../../interfaces/Account';
import { ApplicationStore } from '../../store/ApplicationStore';
import {
  selectAccount,
  selectInterfaceStateId,
  selectReferencesTo,
  store,
} from '../../store/Store';
import { Translations } from '../../Translations';
import { Form } from './Form';
import useMobileLayout from '../../hooks/useMobileLayout';
import { SchemaReferenceAttribute, SchemaType } from '../../interfaces/Schema';
import { Reference } from './Reference';
import { Events } from './Events';

export const Layer = () => {
  const { client } = useContext(RequestHelperContext);

  const id = useSelector(selectInterfaceStateId);
  const account = useSelector((store: ApplicationStore) => selectAccount(store, id));
  const references = useSelector((store: ApplicationStore) =>
    selectReferencesTo(store, SchemaType.Account)
  );

  const isMobileLayout = useMobileLayout();

  const hideAccountDetail = () => {
    store.dispatch(hideLayer());
  };

  const update = async (id: Account['_id'] | undefined, preview: AccountPreview) => {
    if (id) {
      const updated = await client!.updateAccount({ ...account!, ...preview }); // TODO refactor

      store.dispatch(updateAccount({ ...updated }));

      store.dispatch(showModalSuccess(Translations.AccountUpdatedConfirmation.en));
    } else {
      const updated = await client!.createAccount(preview); // TODO refactor

      store.dispatch(addAccount({ ...updated }));
      store.dispatch(showModalSuccess(Translations.AccountCreatedConfirmation.en));
    }
  };

  useEffect(() => {
    const execute = async () => {
      const updated = await client!.getAccount(id!);

      store.dispatch(updateAccount({ ...updated }));
    };

    if (client && id) {
      execute();
    }
  }, [id, client]);

  const getItems = (id?: string, references?: SchemaReferenceAttribute[]) => {
    const list = [
      <Item key="account">
        <span className="tab-title">Account</span>
      </Item>,
    ];

    if (id) {
      list.push(
        <Item key="events">
          <span className="tab-title">History</span>
        </Item>
      );

      references?.map((attribute) => {
        list.push(
          <Item key={attribute.name}>
            <span className="tab-title">{attribute.name}</span>
          </Item>
        );
      });
    }

    return list;
  };

  const getPanelItems = (id?: string, references?: SchemaReferenceAttribute[]) => {
    const list = [
      <Item key="account">
        <Form update={update} id={id} />
      </Item>,
    ];

    if (id) {
      list.push(
        <Item key="events">
          <Events id={id} />
        </Item>
      );

      references?.map((attribute) => {
        list.push(
          <Item key={attribute.name}>
            <Reference account={account} />
          </Item>
        );
      });
    }

    return list;
  };

  return (
    <div className={`layer ${isMobileLayout ? 'mobile' : 'desktop'}`}>
      <div className="header">
        <div style={{ float: 'right' }}>
          <Button variant="primary" onPress={() => hideAccountDetail()}>
            Close
          </Button>
        </div>
      </div>
      <div className="body">
        <Tabs height="100%">
          <TabList>{getItems(id, references)}</TabList>
          <TabPanels>{getPanelItems(id, references)}</TabPanels>
        </Tabs>
      </div>
    </div>
  );
};
