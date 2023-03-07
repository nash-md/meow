import { Button, TextField } from '@adobe/react-spectrum';
import { useState, useMemo, useContext } from 'react';
import { ActionType } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { RequestError } from '../../errors/RequestError';
import { RequestTimeoutError } from '../../errors/RequestTimeoutError';
import { store } from '../../store/Store';

export const Form = (props: any) => {
  const { client } = useContext(RequestHelperContext);

  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [invite, setInvite] = useState<string>('');

  let isValidForm = useMemo(() => {
    setError('');

    if (name) {
      setInvite('');

      return true;
    }

    return false;
  }, [name]);

  const save = async () => {
    setError('');

    try {
      const user = await client!.createUser(name); // TODO remove any

      setName('');
      setInvite(user.invite);

      store.dispatch({
        type: ActionType.USER_ADD,
        payload: user,
      });
    } catch (error) {
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
    <div className="content-box">
      <h2>Create New User</h2>
      <div className="create-user-form">
        <div>
          <TextField
            onChange={setName}
            value={name}
            aria-label="Name"
            width="100%"
            key="name"
            label="Name"
          />
        </div>

        <div className="send-button">
          <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
            Create
          </Button>
        </div>
      </div>
      <div style={{ color: 'red', paddingTop: '5px' }}> {error}</div>

      {invite && (
        <div className="create-user-confirmation">
          <div>
            <b>{props.createInviteUrl(invite)}</b>
          </div>
          <Button
            variant="primary"
            onPress={() => props.copyToClipboard(props.createInviteUrl(invite))}
          >
            Copy Invite
          </Button>
        </div>
      )}
    </div>
  );
};
