import { Button, Tabs, TabList, Item, TabPanels } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';
import { ActionType } from '../actions/Actions';
import { selectInterfaceStateId, store } from '../store/Store';
import { Form } from './card/Form';
import { Events } from './card/Events';

export const CardDetailLayer = (props: any) => {
  const id = useSelector(selectInterfaceStateId);

  const hideCardDetail = () => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'default', id: undefined },
    });
  };

  return (
    <div className="card-detail-canvas">
      <div className="header">
        <div style={{ float: 'right' }}>
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
              <Form add={props.add} id={id} />
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
