import { useSelector } from 'react-redux';
import { User } from '../interfaces/User';
import { ApplicationStore } from '../store/ApplicationStore';
import { selectUser } from '../store/Store';

export interface AvatarProps {
  id: User['id'] | undefined;
  width: number;
}

export const Avatar = ({ id }: AvatarProps) => {
  const user = useSelector((store: ApplicationStore) => selectUser(store, id));

  return (
    <div className="avatar">{user?.name.substring(0, 1).toUpperCase()}</div>
  );
};
