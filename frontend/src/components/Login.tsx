import { TextField, Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useState } from 'react';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
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

      const client = new RequestHelper(process.env.REACT_APP_URL);
      const payload = await client.login(name, password);

      if (setClient) {
        setClient(new RequestHelper(process.env.REACT_APP_URL!, payload.token));
      }

      setIsLoading(false);

      store.dispatch({
        type: ActionType.LOGIN,
        payload: payload,
      });
    } catch (error) {
      setIsLoading(false);
      setError('Invalid');
    }
  };

  return (
    <>
      <h1>Login</h1>
      <div className="login">
        <div>
          <TextField label="Name" onChange={setName} width={120} />
        </div>

        <div>
          <TextField
            type="password"
            label="Password"
            onChange={setPassword}
            width={120}
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
