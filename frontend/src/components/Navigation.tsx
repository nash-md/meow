import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrency, selectName } from '../store/Store';

export const Navigation = () => {
  const currency = useSelector(selectCurrency);
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
          <img alt="Deals" src={`${currency?.toLocaleLowerCase()}-icon.svg`} />
        </Link>
      </div>

      <div className="item">
        <Link to="/forecast">
          <img alt="Forecast" src="forecast-icon.svg" />
        </Link>
      </div>
      <div className="item">
        <Link to="/hire">
          <img alt="Hire a Specialist" src="paw-icon.svg" />
        </Link>
      </div>
      <div className="item">
        <Link to="/setup">
          <img alt="Setup" src="setup-icon.svg" />
        </Link>
      </div>
    </>
  );
};
