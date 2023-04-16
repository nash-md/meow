import { TextField, Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useState } from 'react';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { RequestHelper } from '../helpers/RequestHelper';
import { store } from '../store/Store';

export const Login = () => {
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

      const client = new RequestHelper(import.meta.env.VITE_URL);
      const payload = await client.login(name, password);

      client.token = payload.token;

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
        const parsed = await error.response.json(); // TODO parse can fail and should have a catch

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
      <div className="login" style={{ marginTop: '20px' }}>
        <div>
          <TextField label="Name" onChange={setName} width={180} />
        </div>

        <div>
          <TextField
            type="password"
            label="Password"
            onChange={setPassword}
            width={200}
          />
        </div>
        <div style={{ marginTop: '25px' }}>
          <Button onPress={authenticate} isDisabled={isLoading} variant="cta">
            Login
          </Button>
        </div>
      </div>
      {error}
    </>
  );
};
