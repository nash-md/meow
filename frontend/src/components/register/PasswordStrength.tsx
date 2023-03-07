import { useEffect, useState } from 'react';

export interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const [strenght, setStrenght] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    let l = Array(9).fill(0);

    if (password.length > 3) {
      l = l.map((_, i) => (i < password.length - 3 ? 1 : 0));
    }

    setStrenght([...l]);
  }, [password]);

  return (
    <div style={{ paddingTop: '5px' }}>
      {strenght.map((value: number, index: number) => {
        return (
          <img
            key={index}
            src={value ? '/heart-icon-red.svg' : '/heart-icon.svg'}
            style={{
              width: '18px',
              height: '22px',
              paddingRight: '2px',
            }}
          />
        );
      })}
    </div>
  );
};
