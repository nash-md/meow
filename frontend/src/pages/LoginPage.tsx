import { TabList, Item, TabPanels, Tabs } from '@adobe/react-spectrum';
import { CursorHeadline } from '../components/CursorHeadline';
import { Login } from '../components/Login';
import { Register } from '../components/Register';

export default function LoginPage() {
  return (
    <>
      <div className="welcome-page">
        <div style={{ marginBottom: '10px' }}>
          <CursorHeadline
            text={['Hello!', 'Hallo!', 'Hej!', 'こんにち', 'Hola!']}
          />
        </div>
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
