import { Button, TextField, DatePicker } from '@adobe/react-spectrum';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { parseDate } from '@internationalized/date';
import { selectCard, selectLane, selectSchemaByType, selectUserId } from '../../store/Store';
import { ApplicationStore } from '../../store/ApplicationStore';
import { Card, CardFormPreview, CardPreview } from '../../interfaces/Card';
import { SchemaType } from '../../interfaces/Schema';
import { Translations } from '../../Translations';
import { SchemaCanvas } from '../schema/SchemaCanvas';
import { Attribute } from '../../interfaces/Attribute';
import { LANE_COLOR, DEFAULT_LANGUAGE } from '../../Constants';
import { IconLock } from './IconLock';

const getBannerColorClassName = (color: string | undefined) => {
  if (color === LANE_COLOR.NEGATIVE) {
    return 'negative';
  }

  if (color === LANE_COLOR.POSITIVE) {
    return 'positive';
  }

  return '';
};

export interface FormProps {
  id: string | undefined;
  update: (id: Card['_id'] | undefined, card: CardPreview) => void;
}

// TODO rename component
export const Form = ({ update, id }: FormProps) => {
  const userId = useSelector(selectUserId);
  const [attributes, setAttributes] = useState<Attribute>({});
  const [preview, setPreview] = useState<CardFormPreview>({
    name: '',
    amount: '',
    laneId: '',
    attributes: undefined,
    userId: userId!,
  });

  useEffect(() => {
    setAttributes(preview.attributes || {});
  }, [preview.attributes]);

  const handlePreviewUpdate = (key: string, value: string | number) => {
    setPreview({
      ...preview,
      [key]: value,
    });
  };

  const schema = useSelector((store: ApplicationStore) =>
    selectSchemaByType(store, SchemaType.Card)
  );

  let isValidAmount = useMemo(
    () => /^[\d]{1,10}$/.test(preview.amount) && parseInt(preview.amount) > 0,
    [preview]
  );

  let isValidNextFollowUp = useMemo(() => preview.nextFollowUpAt, [preview]);

  let isValidForm = useMemo(() => {
    if (preview.name && isValidAmount && isValidNextFollowUp) {
      return true;
    }

    return false;
  }, [preview]);

  const card = useSelector((store: ApplicationStore) => selectCard(store, id));
  const lane = useSelector((store: ApplicationStore) => selectLane(store, card?.laneId));
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    setIsDisabled(lane && lane.tags?.type !== 'normal' ? true : false);
  }, [lane]);

  useEffect(() => {
    if (card) {
      setPreview({
        ...card,
        attributes: { ...card.attributes },
        amount: card.amount ? card.amount.toString() : '',
      });
    } else {
      setPreview({
        name: '',
        amount: '',
        laneId: '',
        attributes: undefined,
        userId: userId!,
      });
    }
  }, [card]);

  const save = () => {
    update(id, { ...preview, amount: parseInt(preview.amount) });
  };

  const validate = (values: Attribute) => {
    setPreview({
      ...preview,
      attributes: {
        ...values,
      },
    });
  };

  return (
    <>
      {isDisabled && (
        <div className={`lock ${getBannerColorClassName(lane?.color)}`}>
          <div>{Translations.OpportunityClosedMessage[DEFAULT_LANGUAGE]}</div>
          <div className="button" onClick={() => setIsDisabled(!isDisabled)}>
            <IconLock />
          </div>
        </div>
      )}

      {!isDisabled ? (
        <div className="card-submit">
          <Button variant="primary" onPress={save} isDisabled={!isValidForm || isDisabled}>
            {Translations.SaveButton[DEFAULT_LANGUAGE]}
          </Button>
        </div>
      ) : null}

      <div className="card">
        <TextField
          onChange={(value) => handlePreviewUpdate('name', value)}
          value={preview.name}
          aria-label="Name"
          width="100%"
          key="name"
          label={Translations.NameLabel[DEFAULT_LANGUAGE]}
          isDisabled={isDisabled}
          validationState={preview.name ? 'valid' : 'invalid'}
        />

        <SchemaCanvas
          isDisabled={isDisabled}
          values={card?.attributes}
          schema={schema!}
          validate={validate}
        />

        <div className="attribute">
          <TextField
            onChange={(value) => handlePreviewUpdate('amount', value)}
            value={preview.amount}
            aria-label={Translations.OpportunityAmount[DEFAULT_LANGUAGE]}
            width="100%"
            key="amount"
            inputMode="decimal"
            isDisabled={isDisabled}
            label={Translations.OpportunityAmount[DEFAULT_LANGUAGE]}
            validationState={isValidAmount ? 'valid' : 'invalid'}
            errorMessage={Translations.OpportunityAmountInvalid[DEFAULT_LANGUAGE]}
          />
        </div>
      </div>

      <div className="card-dates">
        <div>
          <DatePicker
            value={
              preview.nextFollowUpAt
                ? parseDate(preview.nextFollowUpAt.substring(0, 10))
                : undefined
            }
            onChange={(value) => handlePreviewUpdate('nextFollowUpAt', value.toString())}
            label={Translations.NextFollowUpLabel[DEFAULT_LANGUAGE]}
            validationState={isValidNextFollowUp ? 'valid' : 'invalid'}
            isDisabled={isDisabled}
          />
        </div>

        <div>
          <DatePicker
            value={preview.closedAt ? parseDate(preview.closedAt.substring(0, 10)) : undefined}
            onChange={(value) => handlePreviewUpdate('closedAt', value.toString())}
            label={Translations.ExpectedCloseDateLabel[DEFAULT_LANGUAGE]}
            isDisabled={isDisabled}
          />
        </div>
      </div>
    </>
  );
};
