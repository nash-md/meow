import { TabList, Item, TabPanels, Tabs } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { CursorHeadline } from '../components/CursorHeadline';
import { ErrorModal } from '../components/ErrorModal';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
import { RegisterWithInvite } from '../components/RegisterWithInvite';

export default function LoginPage() {
  const [invite, setInvite] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteParam = params.get('invite');
    if (inviteParam) {
      setInvite(inviteParam);
    }
  }, []);

  return (
    <>
      <div className="welcome-page">
        <div style={{ marginBottom: '10px' }}>
          <CursorHeadline
            text={['Hello!', 'Hallo!', 'Hej!', 'こんにち', 'Hola!']}
          />
        </div>
        {!invite ? (
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
        ) : (
          <RegisterWithInvite invite={invite} />
        )}
      </div>
      <ErrorModal />
    </>
  );
}
