import './App.css';
import { useBrowserState } from './hooks/useBrowserState';
import { useDispatch, useSelector } from 'react-redux';

import Application from './Application';
import LoginPage from './pages/LoginPage';
import { selectIsPageLoaded, selectToken, store } from './store/Store';
import { useContext, useEffect } from 'react';
import { RequestHelper } from './helpers/RequestHelper';
import {
  readContextFromLocalStorage,
  writeContextToLocalStorage,
} from './helpers/LocalStorageHelper';
import { ActionType } from './actions/Actions';
import { RequestHelperContext } from './context/RequestHelperContextProvider';

export const SessionOrNot = () => {
  const { setClient } = useContext(RequestHelperContext);

  const token = useSelector(selectToken);
  const isPageLoaded = useSelector(selectIsPageLoaded);

  useEffect(() => {
    const initiate = async () => {
      const context = readContextFromLocalStorage();

      let payload = undefined;

      try {
        if (context.token) {
          payload = await new RequestHelper(
            process.env.REACT_APP_URL!
          ).isValidToken(context.token);
        }
      } catch (error) {
        console.log(error); // TODO throw UI error
      }

      if (payload && payload.isValid === true) {
        if (setClient) {
          setClient(
            new RequestHelper(process.env.REACT_APP_URL!, payload.body.token)
          );
        }
      }

      store.dispatch({
        type: ActionType.PAGE_LOAD,
        payload: payload?.body,
      });
    };

    initiate();
  }, []);

  useEffect(() => {
    /* persist only after page was initiated */
    if (!isPageLoaded) {
      return;
    }

    writeContextToLocalStorage({
      token: token,
    });
  }, [token, isPageLoaded]);

  useBrowserState();

  if (!token) {
    return <LoginPage />;
  }

  return <Application />;
};
