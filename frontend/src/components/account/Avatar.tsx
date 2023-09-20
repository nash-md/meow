import { useSelector } from 'react-redux';
import { User } from '../../interfaces/User';
import { ApplicationStore } from '../../store/ApplicationStore';
import { selectUser } from '../../store/Store';

export interface AvatarProps {
  id: User['_id'] | undefined;
  width: number;
  onClick?: () => void;
}

export const Avatar = ({ id, width, onClick }: AvatarProps) => {
  const user = useSelector((store: ApplicationStore) => selectUser(store, id));

  let style: React.CSSProperties = {
    width: `${width}px`,
    height: `${width}px`,
    lineHeight: `${width}px`,
    fontSize: `${Math.floor(width * 0.6)}px`,
  };

  if (user && user.color) {
    style.backgroundColor = user.color;
    style.border = `1px solid ${user.color}`;
  }

  return (
    <div onClick={onClick} className="avatar" style={style}>
      {user?.name.substring(0, 1).toUpperCase()}
    </div>
  );
};
