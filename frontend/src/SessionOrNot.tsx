import './App.css';
import { useBrowserState } from './hooks/useBrowserState';
import { useSelector } from 'react-redux';
import Application from './Application';
import LoginPage from './pages/LoginPage';
import {
  selectBrowserState,
  selectApplicationState,
  selectToken,
  selectUserId,
  store,
} from './store/Store';
import { useContext, useEffect } from 'react';
import { RequestHelper, getBaseUrl } from './helpers/RequestHelper';
import {
  readContextFromLocalStorage,
  writeContextToLocalStorage,
} from './helpers/LocalStorageHelper';
import {
  ActionType,
  login,
  pageLoad,
  pageLoadValidateToken,
  pageLoadWithError,
} from './actions/Actions';
import { RequestHelperContext } from './context/RequestHelperContextProvider';
import { YouAreOffline } from './components/YouAreOffline';
import { RequestTimeoutError } from './errors/RequestTimeoutError';
import { Translations } from './Translations';
import { RequestHelperUrlError } from './errors/RequestHelperUrlError';

export const SessionOrNot = () => {
  const { setClient } = useContext(RequestHelperContext);
  const applicationState = useSelector(selectApplicationState);
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

        console.debug(`found token ${context.token.substring(0, 10)}...`);

        const client = new RequestHelper(getBaseUrl());

        store.dispatch(pageLoadValidateToken());

        const code = await client.isValidToken(context.token);

        if (code === 'expired') {
          store.dispatch(pageLoadWithError(Translations.SessionExpiredError.en));
          return;
        }

        store.dispatch(pageLoad(context.token));

        const { token, user, team, board } = await client.loginWithToken(context.token);

        if (setClient) {
          client.token = token;

          setClient(client);
        }

        client.token = token;

        store.dispatch(login(token, user, team, board));
      } catch (error) {
        let text = Translations.SessionUnhandledError.en;
        let token = undefined;

        if (error instanceof RequestHelperUrlError) {
          text = Translations.RequestHelperError.en;
          token = context.token;
        } else if (error instanceof RequestTimeoutError) {
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
    if (applicationState === 'uninitialized') {
      return;
    }

    writeContextToLocalStorage({
      token: token,
    });
  }, [token, applicationState]);

  const browserState = useBrowserState();

  useEffect(() => {
    if (browserState === 'unknown') {
      return;
    }

    store.dispatch({
      type: ActionType.BROWSER_STATE,
      payload: browserState,
    });
  }, [browserState]);

  const getPage = (userId: string | undefined) => {
    return userId ? <Application /> : <LoginPage />;
  };
  return (
    <>
      {state === 'offline' && <YouAreOffline />}
      {getPage(userId)}
    </>
  );
};
