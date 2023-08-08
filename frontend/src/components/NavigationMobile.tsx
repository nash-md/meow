import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { selectCurrency, selectUserId, store } from '../store/Store';
import { Avatar } from './Avatar';
import { IconBurger } from './IconBurger';

export const NavigationMobile = () => {
  const { setClient } = useContext(RequestHelperContext);
  const userId = useSelector(selectUserId);
  const currency = useSelector(selectCurrency);
  const [isExpanded, setIsExpanded] = useState(false);

  const logout = () => {
    setClient!(undefined);

    store.dispatch({
      type: ActionType.LOGOUT,
    });
  };

  return (
    <>
      <div className="burger">
        <div>
          <div className="icon-canvas" onClick={() => setIsExpanded(!isExpanded)}>
            <IconBurger />
          </div>
        </div>
        <Avatar onClick={() => setIsExpanded(!isExpanded)} width={36} id={userId} />
      </div>

      {isExpanded && (
        <div className="burger-items">
          <div className="item-mobile">
            <Link onClick={() => setIsExpanded(!isExpanded)} to="/" title="Opportunities">
              <img alt="Deals" src={`/${currency?.toLocaleLowerCase()}-icon.svg`} />
              Opportunities
            </Link>
          </div>
          <div className="item-mobile">
            <Link onClick={() => setIsExpanded(!isExpanded)} to="/forecast" title="Forecast">
              <img alt="Forecast" src="/forecast-icon.svg" /> Forecast
            </Link>
          </div>
          <div className="item-mobile">
            <Link onClick={() => setIsExpanded(!isExpanded)} to="/accounts" title="Accounts">
              <img alt="Accounts" src="/accounts-icon.svg" /> Accounts
            </Link>
          </div>
          <div className="item-mobile">
            <Link onClick={() => setIsExpanded(!isExpanded)} to="/hire" title="Hire a Specialist">
              <img alt="Hire a Specialist" src="/paw-icon.svg" /> Users
            </Link>
          </div>
          <div className="item-mobile">
            <Link onClick={() => setIsExpanded(!isExpanded)} to="/setup" title="Setup">
              <img alt="Setup" src="/setup-icon.svg" /> Setup
            </Link>
          </div>

          <h4 className="headline">User</h4>

          <div className="item-mobile">
            <Link onClick={() => setIsExpanded(!isExpanded)} to="/user-setup" title="User Setup">
              Settings
            </Link>
          </div>
          <div onClick={logout} className="item-mobile logout">
            Logout
          </div>
        </div>
      )}
    </>
  );
};
