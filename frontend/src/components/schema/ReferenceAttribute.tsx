import { Picker, Item } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccounts } from '../../store/Store';

export interface ReferenceAttributeProps {
  attributeKey: string;
  name: string;
  value: string | null;
  update: (index: string, value: string) => void;
}

export const ReferenceAttribute = ({
  attributeKey,
  name,
  value: valueDefault,
  update,
}: ReferenceAttributeProps) => {
  const [value, setValue] = useState(valueDefault);
  const accounts = useSelector(selectAccounts);

  useEffect(() => {
    setValue(valueDefault);
  }, [valueDefault]);

  const updateValue = (value: string) => {
    setValue(value);
    update(attributeKey, value);
  };

  return (
    <div className="attribute">
      <Picker
        width="100%"
        aria-label={name}
        label={name}
        selectedKey={value}
        onSelectionChange={(key) => updateValue(key.toString())}
      >
        {accounts?.map((account) => {
          return <Item key={account.id}>{account.name}</Item>;
        })}
      </Picker>
    </div>
  );
};
