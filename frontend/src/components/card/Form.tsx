import { Button, TextField, DatePicker } from '@adobe/react-spectrum';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { parseDate } from '@internationalized/date';
import { selectCard, selectLanes, store as s } from '../../store/Store';
import { ApplicationStore } from '../../store/ApplicationStore';
import { Card } from '../../interfaces/Card';

export const Form = ({ add, id }: any) => {
  const lanes = useSelector(selectLanes);
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');

  let isValidAmount = useMemo(
    () => /^[\d]{1,10}$/.test(amount as string),
    [amount]
  );

  let isValidForm = useMemo(() => {
    if (name && isValidAmount) {
      return true;
    }

    return false;
  }, [amount, name]);

  const [closedAt, setClosedAt] = useState<any>(null);

  const card = useSelector((store: ApplicationStore) => selectCard(store, id));

  useEffect(() => {
    if (!card) {
      return;
    }

    setName(card.name);
    setAmount(card.amount.toString());

    if (card.closedAt) {
      const date = parseDate(card.closedAt.toString().substring(0, 10));

      setClosedAt(date);
    }
  }, [card]);

  const save = () => {
    const updated: Card = {
      ...(card as Card),
      name,
      amount: parseInt(amount),
      closedAt: closedAt ? closedAt.toString() : undefined,
    };

    if (!updated.lane) {
      updated.lane = lanes[0].key;
    }

    add(updated);
  };

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
      </div>
      <div style={{ padding: '10px', display: 'flex' }}>
        <div>
          <TextField
            onChange={setAmount}
            value={amount}
            aria-label="Amount"
            width="100%"
            key="name"
            inputMode="decimal"
            label="Amount"
            validationState={isValidAmount ? 'valid' : 'invalid'}
            errorMessage="Invalid Amount"
          />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <DatePicker
            value={closedAt}
            onChange={setClosedAt}
            label="Expected Close Date"
          />
        </div>
        <div style={{ marginTop: '24px', marginLeft: '10px' }}>
          <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
