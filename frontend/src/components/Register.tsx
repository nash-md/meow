import { TextField, Button } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { login } from '../actions/Actions';
import { getRequestClient } from '../helpers/RequestHelper';
import { store } from '../store/Store';
import { PasswordStrength } from './register/PasswordStrength';
import { getErrorMessage } from '../helpers/ErrorHelper';
import { UserHelper } from '../helpers/UserHelper';
import { Translations } from '../Translations';
import { DEFAULT_LANGUAGE } from '../Constants';

export const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setError('');
    setIsValid(UserHelper.isValidNameAndPassword(name, password));
  }, [name, password]);

  const register = async () => {
    try {
      setIsLoading(true);

      const client = getRequestClient();

      await client.register(name, password);

      const { token, user, team, board } = await client.login(name, password);

      client.token = token;

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
            label={Translations.NameLabel[DEFAULT_LANGUAGE]}
            isDisabled={isLoading}
            value={name}
            onChange={setName}
            width="100%"
          />
        </div>

        <div>
          <TextField
            type="password"
            label={Translations.PasswordLabel[DEFAULT_LANGUAGE]}
            onChange={setPassword}
            width="100%"
            isDisabled={isLoading}
          />

          <PasswordStrength password={password} />
        </div>
        <div style={{ marginTop: '25px' }}>
          <Button onPress={register} isDisabled={isLoading || !isValid} variant="cta">
            {Translations.RegisterButton[DEFAULT_LANGUAGE]}
          </Button>
        </div>
        <div className="spinner-canvas">{isLoading ? <div className="spinner"></div> : null}</div>
      </div>

      {error}

      <div style={{ paddingTop: '10px', display: 'none' }}>
        {Translations.NoPasswordReset[DEFAULT_LANGUAGE]}
      </div>
    </>
  );
};
