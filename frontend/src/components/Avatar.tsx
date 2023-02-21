import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User } from '../interfaces/User';
import { ApplicationStore } from '../store/ApplicationStore';
import { selectUser } from '../store/Store';

export interface AvatarProps {
  id: User['id'] | undefined;
  width: number;
}

export const Avatar = ({ id, width }: AvatarProps) => {
  const user = useSelector((store: ApplicationStore) => selectUser(store, id));

  return (
    <div
      className="avatar"
      style={{
        width: `${width}px`,
        height: `${width}px`,
        lineHeight: `${width}px`,
        fontSize: `${Math.floor(width * 0.6)}px`,
      }}
    >
      {user?.name.substring(0, 1).toUpperCase()}
    </div>
  );
};
