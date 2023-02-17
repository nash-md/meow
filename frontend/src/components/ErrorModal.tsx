import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { hideModal } from '../actions/Actions';
import { selectModal, selectModalText, store } from '../store/Store';

export const ErrorModal = () => {
  const modal = useSelector(selectModal);
  const text = useSelector(selectModalText);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (modal === 'error') {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [modal]);

  const hide = () => {
    setIsVisible(false);

    store.dispatch(store.dispatch(hideModal()));
  };

  return (
    <div
      id="error-modal"
      onClick={() => hide()}
      className={`${isVisible ? 'show' : ''}`}
    >
      <div>An error occured, {text}</div>
    </div>
  );
};
