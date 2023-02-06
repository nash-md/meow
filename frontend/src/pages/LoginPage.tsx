import { TabList, Item, TabPanels, Tabs } from '@adobe/react-spectrum';
import { Login } from '../components/Login';
import { Register } from '../components/Register';

export default function LoginPage() {
  return (
    <>
      <div className="welcome-page">
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
      </div>
    </>
  );
}
