import { TextField, Button } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { login } from '../actions/Actions';
import { RequestHelper, getBaseUrl, getRequestClient } from '../helpers/RequestHelper';
import { store } from '../store/Store';
import { PasswordStrength } from './register/PasswordStrength';
import { getErrorMessage } from '../helpers/ErrorHelper';
import { Translations } from '../Translations';
import { DEFAULT_LANGUAGE } from '../Constants';

export interface RegisterWithInviteProps {
  invite?: string;
}

export const RegisterWithInvite = ({ invite: i }: RegisterWithInviteProps) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isInvalidInvite, setIsInvalidInvite] = useState(false);
  const [invite, setInvite] = useState(i);

  useEffect(() => {
    setError('');
    setIsValid(name.length >= 3 && password.length >= 3);
  }, [name, password]);

  useEffect(() => {
    const execute = async () => {
      try {
        const client = new RequestHelper(getBaseUrl());

        let payload = await client.invite(invite!);

        setName(payload.name);
      } catch (error) {
        setIsInvalidInvite(true);
        setInvite('');

        window.history.pushState('', '', '/');
      }
    };

    if (invite) {
      execute();
    }
  }, [invite]);

  const authenticate = async () => {
    try {
      setIsLoading(true);

      const client = getRequestClient();

      await client.register(name, password, invite);

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
      {' '}
      {!isInvalidInvite && (
        <div className="register" style={{ marginTop: '20px' }}>
          <div>
            <TextField
              label={Translations.NameLabel[DEFAULT_LANGUAGE]}
              isDisabled={isLoading || Boolean(invite)}
              value={name}
              onChange={setName}
              width={180}
            />
          </div>

          <div>
            <TextField
              type="password"
              label={Translations.PasswordLabel[DEFAULT_LANGUAGE]}
              onChange={setPassword}
              width={200}
              isDisabled={isLoading}
            />

            <PasswordStrength password={password} />
          </div>
          <div style={{ marginTop: '25px' }}>
            <Button onPress={authenticate} isDisabled={isLoading || !isValid} variant="cta">
              {Translations.RegisterButton[DEFAULT_LANGUAGE]}
            </Button>
          </div>
        </div>
      )}
      {error}
      {isInvalidInvite ? (
        <>
          {' '}
          <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
            {Translations.InvalidInviteLink[DEFAULT_LANGUAGE]}
          </div>
          <a href="/">{Translations.LeaveSignUp[DEFAULT_LANGUAGE]}</a>
        </>
      ) : (
        <>
          {' '}
          <div style={{ paddingTop: '10px' }}>
            {Translations.InviteLinkInstruction[DEFAULT_LANGUAGE]}
          </div>
        </>
      )}
    </>
  );
};
