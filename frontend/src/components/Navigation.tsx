import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectName } from '../store/Store';

export const Navigation = () => {
  const name = useSelector(selectName);

  return (
    <>
      <div
        style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '40px',
          lineHeight: '26px',
          width: '26px',
          height: '26px',
          border: '2px solid white',
          borderRadius: '26px',
          display: 'none',
        }}
      >
        <b>{name?.substring(0, 1)}</b>
      </div>

      <div className="item">
        <Link to="/">
          <img
            alt="Forecast"
            style={{ width: '26px', color: 'white' }}
            src="euro-icon.svg"
          />
        </Link>
      </div>
      <div className="item">
        <Link to="/setup">
          <img alt="Setup" style={{ width: '26px' }} src="setup-icon.svg" />
        </Link>
      </div>
      <div className="item">
        <Link to="/hire">
          <img
            alt="Hire a Specialist"
            style={{ width: '26px' }}
            src="paw-icon.svg"
          />
        </Link>
      </div>
    </>
  );
};
