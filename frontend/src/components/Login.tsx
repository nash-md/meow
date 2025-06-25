import { TextField, Button } from '@adobe/react-spectrum';
import { useEffect, useState, KeyboardEvent } from 'react';
import { login } from '../actions/Actions';
import { getRequestClient } from '../helpers/RequestHelper';
import { selectApplicationState, store } from '../store/Store';
import { getErrorMessage } from '../helpers/ErrorHelper';
import { UserHelper } from '../helpers/UserHelper';
import { useSelector } from 'react-redux';
import { Translations } from '../Translations';
import { DEFAULT_LANGUAGE } from '../Constants';

export interface LoginProps {}

export const Login = ({}: LoginProps) => {
  const client = getRequestClient();
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
    return () => {
      client.destroy(); // Abort all ongoing requests when the component is unmounted
    };
  }, []);

  const authenticate = async () => {
    try {
      setError('');
      setIsLoading(true);

      const { token, user, team, board } = await client.login(name, password);

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
            label={Translations.NameLabel[DEFAULT_LANGUAGE]}
            onChange={setName}
            onKeyDown={handleKeyDown}
            isDisabled={isLoading || state === 'validating'}
            width="100%"
          />
        </div>
        <div>
          <TextField
            type="password"
            label={Translations.PasswordLabel[DEFAULT_LANGUAGE]}
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
            {Translations.LoginButton[DEFAULT_LANGUAGE]}
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
