import { FormCanvas } from '../components/setup/user/FormCanvas';
import { PasswordCanvas } from '../components/setup/PasswordCanvas';

export const UserSetupPage = () => {
  return (
    <div className="canvas">
      <FormCanvas />
      <PasswordCanvas />
    </div>
  );
};
