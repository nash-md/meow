import { Button, Checkbox, TextField } from '@adobe/react-spectrum';
import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import { Lane } from '../../interfaces/Lane';
import { ApplicationStore } from '../../store/ApplicationStore';
import { selectLane, store } from '../../store/Store';

export interface FormProps {
  id: Lane['key'] | undefined;
}

export const Form = ({ id }: FormProps) => {
  const lane = useSelector((store: ApplicationStore) => selectLane(store, id!));

  const [name, setName] = useState<string>(lane!.name);
  const [inForecast, setInForecast] = useState<boolean>(
    lane!.inForecast ?? false
  );

  let isValidForm = useMemo(() => {
    store.dispatch({
      type: ActionType.LANE_UPDATE,
      payload: { ...lane!, name: name, inForecast: inForecast },
    });

    if (name) {
      return true;
    }

    return false;
  }, [name, inForecast]);

  const save = () => {};

  return (
    <div>
      <div style={{ padding: '10px' }}>
        <TextField
          onChange={setName}
          value={name}
          aria-label="Name"
          width="100%"
          key="name"
          label="Name"
        />

        <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          <Checkbox isSelected={inForecast} onChange={setInForecast}>
            Excluce from Forecast
          </Checkbox>
        </div>

        <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
          Save
        </Button>
      </div>
    </div>
  );
};
