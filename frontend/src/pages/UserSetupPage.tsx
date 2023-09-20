import { FormCanvas } from '../components/setup/user/FormCanvas';
import { PasswordCanvas } from '../components/setup/PasswordCanvas';
import { useSelector } from 'react-redux';
import { selectSessionUser } from '../store/Store';

export const UserSetupPage = () => {
  const user = useSelector(selectSessionUser);

  return (
    <div className="canvas">
      <FormCanvas />

      {user?.authentication === 'local' ? <PasswordCanvas /> : null}
    </div>
  );
};
