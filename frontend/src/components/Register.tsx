import { TextField, Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useState } from 'react';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { RequestHelper } from '../helpers/RequestHelper';
import { store } from '../store/Store';

export const Register = () => {
  const { setClient } = useContext(RequestHelperContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError('');
  }, [name, password]);

  const authenticate = async () => {
    try {
      setIsLoading(true);

      const client = new RequestHelper(process.env.REACT_APP_URL);
      const payload = await client.register(name, password);

      if (setClient) {
        setClient(new RequestHelper(process.env.REACT_APP_URL, payload.token));
      }

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
      <h1>Register</h1>
      <div className="register">
        <div>
          <TextField
            label="Name"
            isDisabled={isLoading}
            onChange={setName}
            width={120}
          />
        </div>

        <div>
          <TextField
            type="password"
            label="Password"
            onChange={setPassword}
            width={120}
            isDisabled={isLoading}
          />
        </div>
        <div style={{ marginTop: '25px' }}>
          <Button onPress={authenticate} isDisabled={isLoading} variant="cta">
            Register
          </Button>
        </div>
      </div>

      {error}

      <div style={{ paddingTop: '10px' }}>
        There is no password reset so you better remember!
      </div>
    </>
  );
};
