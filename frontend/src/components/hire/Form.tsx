import { Button, TextField } from '@adobe/react-spectrum';
import { useState, useMemo, useContext } from 'react';
import { ActionType } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { RequestError } from '../../errors/RequestError';
import { RequestTimeoutError } from '../../errors/RequestTimeoutError';
import { store } from '../../store/Store';

export const Form = () => {
  const { client } = useContext(RequestHelperContext);

  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  let isValidForm = useMemo(() => {
    setError('');

    if (name && password) {
      return true;
    }

    return false;
  }, [name, password]);

  const save = async () => {
    setError('');

    try {
      const user = await client!.createUser(name, password);

      setName('');
      setPassword('');

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
      <h2 style={{ margin: 0 }}>Create New User</h2>
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
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

        <div style={{ marginLeft: '10px' }}>
          <TextField
            onChange={setPassword}
            value={password}
            aria-label="Password"
            width="100%"
            key="password"
            label="Password"
            type="password"
          />
        </div>

        <div style={{ marginTop: '25px', marginLeft: '10px' }}>
          <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
            Create
          </Button>
        </div>
      </div>
      <div style={{ color: 'red', paddingTop: '5px' }}> {error}</div>
    </div>
  );
};
