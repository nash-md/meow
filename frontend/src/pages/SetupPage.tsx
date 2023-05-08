import { CurrencyCanvas } from '../components/setup/currency/CurrencyCanvas';
import { LanesCanvas } from '../components/setup/lane/LaneCanvas';
import { CardSchema } from '../components/setup/card/CardSchema';
import { AccountSchema } from '../components/setup/account/AccountSchema';

export const SetupPage = () => {
  return (
    <div className="canvas">
      <CurrencyCanvas />
      <LanesCanvas />
      <CardSchema />
      <AccountSchema />
    </div>
  );
};
