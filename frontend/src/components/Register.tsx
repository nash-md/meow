import { TextField, Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useState } from 'react';
import { login } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { RequestHelper, getBaseUrl } from '../helpers/RequestHelper';
import { store } from '../store/Store';
import { PasswordStrength } from './register/PasswordStrength';
import { getErrorMessage } from '../helpers/ErrorHelper';

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

      const client = new RequestHelper(getBaseUrl());

      await client.register(name, password);

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
