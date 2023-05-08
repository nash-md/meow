import { TextField, Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useState, KeyboardEvent } from 'react';
import { login } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { RequestHelper, getBaseUrl } from '../helpers/RequestHelper';
import { store } from '../store/Store';
import { getErrorMessage } from '../helpers/ErrorHelper';

export const Login = () => {
  const { setClient } = useContext(RequestHelperContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setError('');

    if (name.length >= 3 && password.length >= 3) {
      setIsValid(true);
    }
  }, [name, password]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      authenticate();
    }
  };

  const authenticate = async () => {
    try {
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
      <div className="login" style={{ marginTop: '20px' }}>
        <div>
          <TextField
            label="Name"
            onChange={setName}
            onKeyDown={handleKeyDown}
            width={180}
          />
        </div>

        <div>
          <TextField
            type="password"
            label="Password"
            onChange={setPassword}
            onKeyDown={handleKeyDown}
            width={200}
          />
        </div>
        <div style={{ marginTop: '25px' }}>
          <Button
            onPress={authenticate}
            isDisabled={isLoading || !isValid}
            variant="cta"
          >
            Login
          </Button>
        </div>
      </div>
      {error}
    </>
  );
};
