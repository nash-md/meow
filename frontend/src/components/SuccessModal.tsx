import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { hideModal } from '../actions/Actions';
import { selectModal, store } from '../store/Store';

export const SuccessModal = () => {
  const modal = useSelector(selectModal);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;

    if (modal === 'success') {
      setIsVisible(true);

      timer = setTimeout(() => {
        setIsVisible(false);

        store.dispatch(hideModal());
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [modal]);

  return (
    <div
      id="success-modal"
      onClick={() => setIsVisible(false)}
      className={`${isVisible ? 'show' : ''}`}
    >
      <div>Configuration saved ...</div>
    </div>
  );
};
