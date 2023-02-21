import { Button, Tabs, TabList, Item, TabPanels } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import {
  selectCard,
  selectInterfaceStateId,
  selectUsers,
  store,
} from '../../store/Store';
import { Form } from './Form';
import { Events } from './Events';
import { Card } from '../../interfaces/Card';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { useContext, useState } from 'react';
import { ApplicationStore } from '../../store/ApplicationStore';
import { Avatar } from '../Avatar';
import { User, UserStatus } from '../../interfaces/User';

export const Layer = () => {
  const { client } = useContext(RequestHelperContext);
  const id = useSelector(selectInterfaceStateId);
  const card = useSelector((store: ApplicationStore) => selectCard(store, id));
  const [isUserLayerVisible, setIsUserLayerVisible] = useState(false);
  const users = useSelector(selectUsers);

  const hideCardDetail = () => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'default', id: undefined },
    });
  };

  const assign = async (id: User['id']) => {
    console.log(`assign card to user ${id}`);

    store.dispatch({
      type: ActionType.CARD_UPDATE,
      payload: { ...card!, user: id },
    });

    setIsUserLayerVisible(false);
  };

  const add = async (card: Card) => {
    // TODO should handle Card and CardPreview (Partial) types
    let updated = {};

    if (card.id) {
      store.dispatch({
        type: ActionType.CARD_UPDATE,
        payload: { ...card, ...updated },
      });
    } else {
      updated = await client!.createCard(card); // TODO refactor

      store.dispatch({
        type: ActionType.CARD_ADD,
        payload: { ...card, ...updated },
      });
    }
  };

  return (
    <div className="layer">
      <div className="header">
        {card?.user && (
          <div
            style={{ float: 'left' }}
            onClick={() => {
              setIsUserLayerVisible(!isUserLayerVisible);
            }}
          >
            <Avatar id={card?.user} width={0} />
          </div>
        )}

        <div style={{ float: 'right', marginTop: '4px' }}>
          <Button variant="primary" onPress={() => hideCardDetail()}>
            Close
          </Button>
        </div>
      </div>
      {isUserLayerVisible && (
        <div style={{ backgroundColor: 'rgb(230, 230, 230)' }}>
          <table>
            <tbody>
              {users
                .filter((user) => user.status !== UserStatus.Deleted)
                .map((user: User) => {
                  return (
                    <tr key={user.id}>
                      <td>
                        <Avatar id={user.id} width={0} />
                      </td>
                      <td>
                        <b>{user.name}</b>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          onPress={() => assign(user.id)}
                        >
                          assign
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
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
