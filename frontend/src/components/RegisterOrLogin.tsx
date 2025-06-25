import { Tabs, TabList, Item, TabPanels } from '@adobe/react-spectrum';
import { Login } from './Login';
import { Register } from './Register';
import { useEffect, useState } from 'react';
import { getRequestClient } from '../helpers/RequestHelper';
import { Translations } from '../Translations';
import { DEFAULT_LANGUAGE } from '../Constants';

export interface RegisterOrLoginProps {}

export const RegisterOrLogin = ({}: RegisterOrLoginProps) => {
  const [allowTeamRegistration, setAllowTeamRegistration] = useState(false);

  useEffect(() => {
    const client = getRequestClient();

    client
      .registerStatus()
      .then((payload) => setAllowTeamRegistration(payload.allowTeamRegistration))
      .catch((error) => console.error(error));
  }, []);

  const tabItems = [<Item key="login">{Translations.LoginTab[DEFAULT_LANGUAGE]}</Item>];
  const tabPanels = [
    <Item key="login">
      <Login />
    </Item>,
  ];

  if (allowTeamRegistration) {
    tabItems.push(<Item key="register">{Translations.RegisterTab[DEFAULT_LANGUAGE]}</Item>);
    tabPanels.push(
      <Item key="register">
        <Register />
      </Item>
    );
  }

  return (
    <form>
      <Tabs>
        <TabList>{tabItems}</TabList>
        <TabPanels>{tabPanels}</TabPanels>
      </Tabs>
    </form>
  );
};
