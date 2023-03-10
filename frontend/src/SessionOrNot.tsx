import './App.css';
import { useBrowserState } from './hooks/useBrowserState';
import { useSelector } from 'react-redux';

import Application from './Application';
import LoginPage from './pages/LoginPage';
import {
  selectBrowserState,
  selectIsPageLoaded,
  selectToken,
  selectUserId,
  store,
} from './store/Store';
import { useContext, useEffect } from 'react';
import { RequestHelper } from './helpers/RequestHelper';
import {
  readContextFromLocalStorage,
  writeContextToLocalStorage,
} from './helpers/LocalStorageHelper';
import { ActionType, pageLoad, pageLoadWithError } from './actions/Actions';
import { RequestHelperContext } from './context/RequestHelperContextProvider';
import { YouAreOffline } from './components/YouAreOffline';
import { RequestTimeoutError } from './errors/RequestTimeoutError';
import { Translations } from './Translations';

export const SessionOrNot = () => {
  const { setClient } = useContext(RequestHelperContext);
  const isPageLoaded = useSelector(selectIsPageLoaded);
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const state = useSelector(selectBrowserState);

  useEffect(() => {
    const initiate = async () => {
      const context = readContextFromLocalStorage();

      try {
        if (!context.token) {
          store.dispatch(pageLoad());
          return;
        }

        console.log(`found token ${context.token.substring(0, 25)}...`);

        const client = new RequestHelper(process.env.REACT_APP_URL);

        const code = await client.isValidToken(context.token);

        if (code === 'expired') {
          store.dispatch(
            pageLoadWithError(Translations.SessionExpiredError.en)
          );
          return;
        }

        store.dispatch(pageLoad(context.token));

        const payload = await client.loginWithToken(context.token);

        if (setClient) {
          setClient(
            new RequestHelper(process.env.REACT_APP_URL, context.token)
          );
        }

        store.dispatch({
          type: ActionType.LOGIN,
          payload: payload,
        });
      } catch (error) {
        let text = Translations.SessionUnhandledError.en;
        let token = undefined;

        if (error instanceof RequestTimeoutError) {
          text = Translations.SessionTimeoutError.en;
          token = context.token;
        } else if (error instanceof TypeError) {
          text = Translations.SessionTypeError.en;
          token = context.token;
        }

        store.dispatch(pageLoadWithError(text, token));
      }
    };

    initiate();
  }, []);

  useEffect(() => {
    if (!isPageLoaded) {
      return;
    }

    writeContextToLocalStorage({
      token: token,
    });
  }, [token, isPageLoaded]);

  useBrowserState();

  const getPage = (userId: string | undefined) => {
    return !userId ? <LoginPage /> : <Application />;
  };
  return (
    <>
      {state === 'offline' && <YouAreOffline />}
      {getPage(userId)}
    </>
  );
};
