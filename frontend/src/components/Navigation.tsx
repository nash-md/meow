import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { selectCurrency, selectName, store } from '../store/Store';

export const Navigation = () => {
  const { setClient } = useContext(RequestHelperContext);

  const currency = useSelector(selectCurrency);

  const logout = () => {
    setClient!(undefined);

    store.dispatch({
      type: ActionType.LOGOUT,
    });
  };

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
      </div>

      <div className="item" style={{ flexGrow: 1 }}></div>

      <div className="item" onClick={logout}>
        <img alt="Logout" src="exit-icon.svg" />
      </div>
    </>
  );
};
