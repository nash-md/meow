import { Checkbox } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';

export interface BooleanAttributeProps {
  attributeKey: string;
  name: string;
  value: boolean | null;
  update: (index: string, value: boolean) => void;
}

export const BooleanAttribute = ({
  attributeKey,
  name,
  value: valueDefault,
  update,
}: BooleanAttributeProps) => {
  const [value, setValue] = useState(valueDefault);

  useEffect(() => {
    setValue(valueDefault);
  }, [valueDefault]);

  const updateValue = (value: boolean) => {
    setValue(Boolean(value));
    update(attributeKey, value);
  };

  return (
    <div className="attribute">
      <Checkbox
        onChange={(value) => updateValue(value)}
        value={value?.toString()}
        isSelected={value ? true : false}
      >
        {name}
      </Checkbox>
    </div>
  );
};
