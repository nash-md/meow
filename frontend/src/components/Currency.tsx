import { useSelector } from 'react-redux';
import { selectCurrency } from '../store/Store';
import { DEFAULT_CURRENCY } from '../Constants';
import { getBrowserLocale } from '../helpers/Helper';

export interface CurrencyProps {
  value: number;
}

export const Currency = ({ value }: CurrencyProps) => {
  const currency = useSelector(selectCurrency);

  return (
    <>
      {value?.toLocaleString(getBrowserLocale(), {
        style: 'currency',
        currency: currency ?? DEFAULT_CURRENCY,
      })}
    </>
  );
};
