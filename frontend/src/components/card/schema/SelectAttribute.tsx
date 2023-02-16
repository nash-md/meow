import { Item, Picker } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';

export interface SelectAttributeProps {
  attributeKey: string;
  name: string;
  value: string | undefined;
  options?: string[] | undefined;
  update: (index: string, value: string) => void;
}

export const SelectAttribute = ({
  attributeKey,
  name,
  update,
  options,
  value: valueDefault,
}: SelectAttributeProps) => {
  const [value, setValue] = useState(valueDefault);

  useEffect(() => {
    setValue(valueDefault);
  }, [valueDefault]);

  const updateValue = (value: string) => {
    setValue(value);
    update(attributeKey, value);
  };

  return (
    <div className="attribute">
      {Array.isArray(options) && (
        <Picker
          width="100%"
          aria-label={name}
          label={name}
          selectedKey={value}
          onSelectionChange={(key) => updateValue(key.toString())}
        >
          {options?.map((option) => {
            return <Item key={option}>{option}</Item>;
          })}
        </Picker>
      )}
    </div>
  );
};
