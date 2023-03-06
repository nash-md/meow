import { AnimalCanvas } from '../components/setup/AnimalCanvas';
import { PasswordCanvas } from '../components/setup/PasswordCanvas';

export const UserSetupPage = () => {
  return (
    <div className="canvas">
      <AnimalCanvas />
      <PasswordCanvas />
    </div>
  );
};
