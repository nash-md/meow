import { Button, Checkbox, Item, Picker, TextField } from '@adobe/react-spectrum';
import { useState, useMemo, useEffect, Key } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import { Lane } from '../../interfaces/Lane';
import { ApplicationStore } from '../../store/ApplicationStore';
import { selectLane, selectToken, store } from '../../store/Store';
import { getRequestClient } from '../../helpers/RequestHelper';
import { Translations } from '../../Translations';
import { DEFAULT_LANGUAGE } from '../../Constants';

export interface FormProps {
  id: Lane['_id'] | undefined;
}

export const Form = ({ id }: FormProps) => {
  const lane = useSelector((store: ApplicationStore) => selectLane(store, id!));
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const [name, setName] = useState<string>(lane!.name);
  const [inForecast, setInForecast] = useState<boolean>(lane!.inForecast);
  const [hideAfterDays, setHideAfterDays] = useState<Key>(
    lane!.tags?.hideAfterDays?.toString() as Key
  );

  const [isSaved, setIsSaved] = useState(false);

  let isValidForm = useMemo(() => {
    if (!name) {
      return false;
    }

    return true;
  }, [name, inForecast]);

  const save = async () => {
    const payload = {
      ...lane!,
      name,
      inForecast,
      tags: lane?.tags ? { ...lane.tags } : undefined,
    };

    if (hideAfterDays) {
      payload.tags = {
        ...payload.tags,
        hideAfterDays: hideAfterDays.toString(),
      };
    } else if (payload.tags) {
      delete payload.tags.hideAfterDays;
    }

    const updated = await client.updateLane(payload);

    store.dispatch({
      type: ActionType.LANE_UPDATE,
      payload: { ...updated },
    });

    setIsSaved(true);
  };

  useEffect(() => {
    if (lane) {
      setName(lane.name);
      setInForecast(lane.inForecast);
      setHideAfterDays(lane?.tags?.['hideAfterDays'] as Key);
    }
  }, [lane]);

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <TextField
          onChange={setName}
          value={name}
          aria-label={Translations.NameLabel[DEFAULT_LANGUAGE]}
          width="100%"
          key="name"
          label={Translations.NameLabel[DEFAULT_LANGUAGE]}
        />

        {lane?.tags?.type !== 'normal' ? (
          <div style={{ paddingTop: '10px' }}>
            <span style={{ lineHeight: '2em' }}>{Translations.HideOpportunitiesMessage[DEFAULT_LANGUAGE]}</span>
            <Picker
              onSelectionChange={setHideAfterDays}
              defaultSelectedKey={hideAfterDays.toString()}
            >
              <Item key="">{Translations.NeverOption[DEFAULT_LANGUAGE]}</Item>
              <Item key="30">30</Item>
              <Item key="60">60</Item>
              <Item key="90">90</Item>
            </Picker>{' '}
            {Translations.DaysLabel[DEFAULT_LANGUAGE]}
          </div>
        ) : null}
        <div style={{ paddingTop: '10px' }}>
          <Checkbox isSelected={!inForecast} onChange={(value) => setInForecast(!value)}>
            {Translations.ExcludeFromForecastLabel[DEFAULT_LANGUAGE]}
          </Checkbox>
        </div>

        <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
          {Translations.SaveButton[DEFAULT_LANGUAGE]}
        </Button>
        {isSaved && <div style={{ marginTop: '10px' }}>{Translations.ChangesSavedMessage[DEFAULT_LANGUAGE]}</div>}
      </div>
    </div>
  );
};
