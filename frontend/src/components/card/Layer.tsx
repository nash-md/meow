import { Button, Tabs, TabList, Item, TabPanels } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import {
  selectCard,
  selectInterfaceStateId,
  selectUser,
  store,
} from '../../store/Store';
import { Form } from './Form';
import { Events } from './Events';
import { Card } from '../../interfaces/Card';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { useContext } from 'react';
import { ApplicationStore } from '../../store/ApplicationStore';

export const Layer = () => {
  const { client } = useContext(RequestHelperContext);
  const id = useSelector(selectInterfaceStateId);

  const card = useSelector((store: ApplicationStore) => selectCard(store, id));
  const user = useSelector((store: ApplicationStore) =>
    selectUser(store, card?.user)
  );

  const hideCardDetail = () => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'default', id: undefined },
    });
  };

  const add = async (card: Card) => {
    // TODO should handle Card and CardPreview types
    if (card.id) {
      card = await client!.updateCard(card);
    } else {
      card = await client!.createCard(card);
    }

    store.dispatch({
      type: ActionType.CARD_UPDATE,
      payload: card,
    });
  };

  return (
    <div className="layer">
      <div className="header">
        <div style={{ float: 'left' }}>
          <div className="avatar">
            {user?.name.substring(0, 1).toUpperCase()}
          </div>
        </div>

        <div style={{ float: 'right', marginTop: '4px' }}>
          <Button variant="primary" onPress={() => hideCardDetail()}>
            Close
          </Button>
        </div>
      </div>

      <div className="body">
        <Tabs height="100%">
          {(id && (
            <TabList>
              <Item key="deal">Deal</Item>
              <Item key="events">History</Item>
            </TabList>
          )) || (
            <TabList>
              <Item key="deal">Deal</Item>
            </TabList>
          )}

          <TabPanels>
            <Item key="deal">
              <Form add={add} id={id} />
            </Item>
            <Item key="events">
              <Events id={id} />
            </Item>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};
