import { useEffect, useState } from 'react';
import { CursorHeadline } from '../components/CursorHeadline';
import { ErrorModal } from '../components/ErrorModal';
import { RegisterWithInvite } from '../components/RegisterWithInvite';
import ScreenResolutionWarning from '../ScreenResolutionWarning';
import { RegisterOrLogin } from '../components/RegisterOrLogin';
import { Translations } from '../Translations';
import { DEFAULT_LANGUAGE } from '../Constants';

export default function LoginPage() {
  const [invite, setInvite] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    params.get('invite') !== null && setInvite(params.get('invite'));
  }, []);

  return (
    <>
      <div className="welcome-page">
        <div style={{ marginBottom: '10px' }}>
          <CursorHeadline text={Translations.Greetings[DEFAULT_LANGUAGE]} />
        </div>
        {invite ? <RegisterWithInvite invite={invite} /> : <RegisterOrLogin />}
        <ScreenResolutionWarning message={Translations.ScreenResolutionWarning[DEFAULT_LANGUAGE]} />
      </div>
      <ErrorModal />
    </>
  );
}
