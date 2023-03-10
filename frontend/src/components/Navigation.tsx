import { useContext, useEffect, useRef, useState, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { selectCurrency, selectUserId, store } from '../store/Store';
import { Avatar } from './Avatar';

export const Navigation = () => {
  const { setClient } = useContext(RequestHelperContext);
  const userId = useSelector(selectUserId);
  const currency = useSelector(selectCurrency);
  const [userMenue, setUserMenu] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);

  const logout = () => {
    setClient!(undefined);

    store.dispatch({
      type: ActionType.LOGOUT,
    });
  };

  function handleLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
    setUserMenu(false);

    return true;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent<Document>) {
      if (
        layerRef.current &&
        !layerRef.current.contains(event.target as Node)
      ) {
        setUserMenu(false);
      }
    }

    const clickHandler: EventListenerOrEventListenerObject =
      handleClickOutside as unknown as EventListenerOrEventListenerObject;

    document.addEventListener('mousedown', clickHandler);

    return () => {
      document.removeEventListener('mousedown', clickHandler);
    };
  }, [layerRef]);

  return (
    <>
      <div className="item">
        <Link to="/">
          <img alt="Deals" src={`${currency?.toLocaleLowerCase()}-icon.svg`} />
        </Link>
      </div>
      <div className="item">
        <Link to="/forecast">
          <img alt="Forecast" src="forecast-icon.svg" />
        </Link>
      </div>
      <div className="item">
        <Link to="/accounts">
          <img alt="Accounts" src="accounts-icon.svg" />
        </Link>
      </div>
      <div className="item">
        <Link to="/hire">
          <img alt="Hire a Specialist" src="paw-icon.svg" />
        </Link>
      </div>
      <div className="item">
        <Link to="/setup">
          <img alt="Setup" src="setup-icon.svg" />
        </Link>
      </div>{' '}
      <div className="item" style={{ flexGrow: 1 }}></div>
      <div className="user-menu">
        {userMenue && (
          <div className={userMenue ? 'wrapper' : ''} ref={layerRef}>
            <Link
              onClick={handleLinkClick}
              to="/user-setup"
              className="link user-settings"
            >
              Settings
            </Link>
            <div onClick={logout} className="link logout">
              Logout
            </div>
          </div>
        )}
        <Avatar
          onClick={() => setUserMenu(!userMenue)}
          width={36}
          id={userId}
        />
      </div>
    </>
  );
};
