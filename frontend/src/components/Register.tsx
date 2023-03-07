import { TextField, Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { RequestHelper } from '../helpers/RequestHelper';
import { store } from '../store/Store';
import { PasswordStrength } from './register/PasswordStrength';

export const Register = () => {
  const { setClient } = useContext(RequestHelperContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setError('');
    setIsValid(name.length >= 3 && password.length >= 3);
  }, [name, password]);

  const authenticate = async () => {
    try {
      setIsLoading(true);

      const client = new RequestHelper(process.env.REACT_APP_URL);

      await client.register(name, password);

      const payload = await client.login(name, password);

      client.token = payload.token;

      if (setClient) {
        setClient(new RequestHelper(process.env.REACT_APP_URL, payload.token));
      }

      setClient!(client);
      setIsLoading(false);

      store.dispatch({
        type: ActionType.LOGIN,
        payload: payload,
      });
    } catch (error) {
      setIsLoading(false);

      console.error(error);

      if (error instanceof RequestError) {
        const parsed = await error.response.json();

        const text = parsed.description ? parsed.description : parsed.name;

        setError('Failed: ' + text);
      } else if (error instanceof RequestTimeoutError) {
        setError('Request Timeout Error, is your backend available?');
      } else if (error instanceof TypeError) {
        setError('Network Request Failed, is your backend available?');
      } else {
        setError('Failed: unknown, check JS Console');
      }
    }
  };

  return (
    <>
      <div className="register" style={{ marginTop: '20px' }}>
        <div>
          <TextField
            label="Name"
            isDisabled={isLoading}
            value={name}
            onChange={setName}
            width={180}
          />
        </div>

        <div>
          <TextField
            type="password"
            label="Password"
            onChange={setPassword}
            width={200}
            isDisabled={isLoading}
          />

          <PasswordStrength password={password} />
        </div>
        <div style={{ marginTop: '25px' }}>
          <Button
            onPress={authenticate}
            isDisabled={isLoading || !isValid}
            variant="cta"
          >
            Register
          </Button>
        </div>
      </div>

      {error}

      <div style={{ paddingTop: '10px', display: 'none' }}>
        There is no password reset so you better remember!
      </div>
    </>
  );
};
