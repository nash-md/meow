import { CurrencyCanvas } from '../components/setup/currency/CurrencyCanvas';
import { LanesSchema } from '../components/setup/lane/LaneSchema';
import { CardSchema } from '../components/setup/card/CardSchema';
import { AccountSchema } from '../components/setup/account/AccountSchema';
import { Switch } from '@adobe/react-spectrum';
import { useState } from 'react';
import { IconDownload } from '../components/setup/IconDownload';

export const SetupPage = () => {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  return (
    <div className="canvas">
      <div className="developer-mode">
        <div className="switch">
          <Switch isSelected={isDeveloperMode} onChange={setIsDeveloperMode}>
            Developer Mode
          </Switch>
        </div>
        {isDeveloperMode ? (
          <div className="link">
            <a href="https://github.com/nash-md/meow" target="_blank">
              <div style={{}}>
                <IconDownload />
              </div>
              <span>Dowload API Definition</span>
            </a>
          </div>
        ) : null}
      </div>

      <CurrencyCanvas />
      <LanesSchema isDeveloperMode={isDeveloperMode} />
      <CardSchema isDeveloperMode={isDeveloperMode} />
      <AccountSchema isDeveloperMode={isDeveloperMode} />
    </div>
  );
};
