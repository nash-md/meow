import { Picker, Item } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccounts } from '../../store/Store';
import { Account } from '../../interfaces/Account';
import { Translations } from '../../Translations';
import { DEFAULT_LANGUAGE } from '../../Constants';

const getOptions = (accounts: Account[]) => {
  const list: JSX.Element[] = [];

  list.push(<Item key="">{Translations.NoneOption[DEFAULT_LANGUAGE]}</Item>);

  accounts?.map((account) => {
    list.push(<Item key={account._id}>{account.name}</Item>);
  });

  return list;
};

export interface ReferenceAttributeProps {
  attributeKey: string;
  name: string;
  value: string | null;
  isDisabled: boolean;
  update: (index: string, value: string | null) => void;
}

export const ReferenceAttribute = ({
  attributeKey,
  name,
  value: valueDefault,
  isDisabled,
  update,
}: ReferenceAttributeProps) => {
  const [value, setValue] = useState(valueDefault ? valueDefault : '');
  const accounts = useSelector(selectAccounts);

  useEffect(() => {
    setValue(valueDefault ? valueDefault : '');
  }, [valueDefault]);

  const updateValue = (value: string) => {
    setValue(value);

    if (value === '') {
      update(attributeKey, null);
    } else {
      update(attributeKey, value);
    }
  };

  return (
    <div className="attribute">
      <Picker
        width="100%"
        aria-label={name}
        label={name}
        selectedKey={value}
        isDisabled={isDisabled}
        onSelectionChange={(key) => updateValue(key.toString())}
      >
        {getOptions(accounts)}
      </Picker>
    </div>
  );
};
