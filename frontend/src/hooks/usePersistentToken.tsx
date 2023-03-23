import { useEffect, useState } from 'react';
import { selectToken } from '../store/Store';
import { useSelector } from 'react-redux';
import { RequestHelper } from '../helpers/RequestHelper';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { store } from '../store/Store';
import { showModalError } from '../actions/Actions';

export const usePersistentToken = () => {
  const [persistentToken, setPersistentToken] = useState<string | undefined>(
    undefined
  );

  const token = useSelector(selectToken);
  const key = 'token';

  useEffect(() => {
    console.log(`get token from local browser storage`);

    const run = async (token: string) => {
      try {
        const client = new RequestHelper(import.meta.env.VITE_URL!);

        const response = await client.isValidToken(token);

        console.log(response);

        // setPersistentToken(token);
      } catch (error) {
        let message = '';

        if (error instanceof RequestError) {
          const parsed = await error.response.json();

          const text = parsed.description ? parsed.description : parsed.name;

          message = `Failed:  ${text}`;
        } else if (error instanceof RequestTimeoutError) {
          message = 'Request Timeout Error, is your backend available?';
        } else if (error instanceof TypeError) {
          message = 'Network Request Failed, is your backend available?';
        } else {
          message = 'Failed: unknown, check JS Console';
        }

        store.dispatch(showModalError(message));
      }
    };

    if (!window.localStorage) {
      console.log(`browser has no local storage object, cannot load token`);
      return;
    }

    const token = window.localStorage.getItem(key);

    if (token) {
      console.log(
        `browser had a stored token ${token} validating against server`
      );
      run(token);
    } else {
      console.log(`token not found`);
    }
  }, []);

  useEffect(() => {
    if (!window.localStorage) {
      console.log(`browser has no local storage object, cannot persist token`);
      return;
    }

    if (token) {
      console.log(`persist token ${token} on local storage`);

      window.localStorage.setItem(key, token);
    } else {
      console.log(`remove token from local storage`);

      window.localStorage.removeItem(key);
    }
  }, [token]);

  return persistentToken;
};
