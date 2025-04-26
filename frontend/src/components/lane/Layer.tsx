import { Button } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';
import { hideLayer } from '../../actions/Actions';
import { selectInterfaceStateId, store } from '../../store/Store';
import { Form } from './Form';
import useMobileLayout from '../../hooks/useMobileLayout';
import { Translations } from '../../Translations';
import { DEFAULT_LANGUAGE } from '../../Constants';

export const Layer = () => {
  const id = useSelector(selectInterfaceStateId);
  const isMobileLayout = useMobileLayout();

  const hideCardDetail = () => {
    store.dispatch(hideLayer());
  };

  return (
    <div className={`layer ${isMobileLayout ? 'mobile' : 'desktop'}`}>
      <div className="header">
        <div style={{ float: 'right' }}>
          <Button variant="primary" onPress={() => hideCardDetail()}>
            {Translations.CloseButton[DEFAULT_LANGUAGE]}
          </Button>
        </div>
      </div>

      <div className="body">
        <Form id={id} />
      </div>
    </div>
  );
};
