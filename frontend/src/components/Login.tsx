import { TextField, Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useState, KeyboardEvent } from 'react';
import { login, pageLoad } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { RequestHelper, getBaseUrl } from '../helpers/RequestHelper';
import { selectApplicationState, store } from '../store/Store';
import { getErrorMessage } from '../helpers/ErrorHelper';
import { UserHelper } from '../helpers/UserHelper';
import { useSelector } from 'react-redux';

export interface LoginProps {
  token: string | null;
}

export const Login = ({ token }: LoginProps) => {
  const { setClient } = useContext(RequestHelperContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const state = useSelector(selectApplicationState);

  useEffect(() => {
    setError('');

    setIsValid(UserHelper.isValidNameAndPassword(name, password));
  }, [name, password]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      authenticate();
    }
  };

  useEffect(() => {
    const execute = async (token: string) => {
      store.dispatch(pageLoad(token));

      const client = new RequestHelper(getBaseUrl());

      const { user, team, board } = await client.loginWithToken(token);

      if (setClient) {
        client.token = token;

        setClient(client);
      }

      client.token = token;

      store.dispatch(login(token, user, team, board));
    };

    if (token) {
      const path = window.location.pathname;

      window.history.replaceState({}, '', path);

      execute(token);
    }
  }, [token]);

  const authenticate = async () => {
    try {
      setError('');
      setIsLoading(true);

      const client = new RequestHelper(getBaseUrl());
      const { token, user, team, board } = await client.login(name, password);

      client.token = token;

      setClient!(client);
      setIsLoading(false);

      store.dispatch(login(token, user, team, board));
    } catch (error) {
      console.error(error);

      setIsLoading(false);
      setError(await getErrorMessage(error));
    }
  };

  return (
    <>
      <div className="login">
        <div>
          <TextField
            label="Name"
            onChange={setName}
            onKeyDown={handleKeyDown}
            isDisabled={isLoading || state === 'validating'}
            width="100%"
          />
        </div>
        <div>
          <TextField
            type="password"
            label="Password"
            onChange={setPassword}
            onKeyDown={handleKeyDown}
            isDisabled={isLoading || state === 'validating'}
            width="100%"
          />
        </div>
        <div style={{ marginTop: '25px' }}>
          <Button
            onPress={authenticate}
            isDisabled={isLoading || !isValid || state === 'validating'}
            variant="cta"
          >
            Login
          </Button>
        </div>
        <div className="spinner-canvas">
          {state === 'validating' || isLoading ? <div className="spinner"></div> : null}
        </div>
      </div>

      {error}
    </>
  );
};
