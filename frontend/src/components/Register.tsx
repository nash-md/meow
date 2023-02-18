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
  const [strenght, setStrenght] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    setError('');

    let l = Array(9).fill(0);

    if (password.length > 3) {
      l = l.map((_, i) => (i < password.length - 3 ? 1 : 0));
    }

    setStrenght([...l]);
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

          <div style={{ paddingTop: '5px' }}>
            {strenght.map((value: number, index: number) => {
              return (
                <img
                  key={index}
                  src={value ? '/heart-icon-red.svg' : '/heart-icon.svg'}
                  style={{ width: '20px', height: '24px', paddingRight: '2px' }}
                />
              );
            })}
          </div>
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
