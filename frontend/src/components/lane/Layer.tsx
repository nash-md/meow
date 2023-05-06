import { Button } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';
import { ActionType, hideLayer } from '../../actions/Actions';
import { selectInterfaceStateId, store } from '../../store/Store';
import { Form } from './Form';

export const Layer = () => {
  const id = useSelector(selectInterfaceStateId);

  const hideCardDetail = () => {
    store.dispatch(hideLayer());
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
