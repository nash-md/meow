import { Tabs, TabList, Item, TabPanels } from '@adobe/react-spectrum';
import { Login } from './Login';
import { Register } from './Register';

export interface RegisterOrLoginProps {}

export const RegisterOrLogin = ({}: RegisterOrLoginProps) => {
  return (
    <form>
      <Tabs>
        <TabList>
          <Item key="login">Login</Item>
          <Item key="register">Register</Item>
        </TabList>
        <TabPanels>
          <Item key="login">
            <Login />
          </Item>
          <Item key="register">
            <Register />
          </Item>
        </TabPanels>
      </Tabs>
    </form>
  );
};
