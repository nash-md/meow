import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { hideModal } from '../actions/Actions';
import { selectModal, selectModalText, store } from '../store/Store';

type Timeout = ReturnType<typeof setTimeout>;

export const SuccessModal = () => {
  const modal = useSelector(selectModal);
  const text = useSelector(selectModalText);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: Timeout | undefined = undefined;

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
      <div>{text}</div>
    </div>
  );
};
