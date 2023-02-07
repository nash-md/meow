import { Button } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import { selectInterfaceStateId, store } from '../../store/Store';
import { Form } from './Form';

export const Layer = (props: any) => {
  const id = useSelector(selectInterfaceStateId);

  const hideCardDetail = () => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'default', id: undefined },
    });
  };

  return (
    <div className="layer">
      <div className="header">
        <div style={{ float: 'right' }}>
          <Button variant="primary" onPress={() => hideCardDetail()}>
            Close
          </Button>
        </div>
      </div>

      <div className="body">
        <Form id={id} />
      </div>
    </div>
  );
};
