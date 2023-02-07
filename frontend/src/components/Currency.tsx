import { useSelector } from 'react-redux';
import { selectCurrency } from '../store/Store';

export interface CurrencyProps {
  value: number;
}

export const Currency = ({ value }: CurrencyProps) => {
  const currency = useSelector(selectCurrency);

  return (
    <>
      {value.toLocaleString('en-US', {
        style: 'currency',
        currency: currency ?? 'USD',
      })}
    </>
  );
};
