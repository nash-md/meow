import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { SessionOrNot } from './SessionOrNot';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/Store';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import { RequestHelperContextProvider } from './context/RequestHelperContextProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const getLocale = () => {
  const language = navigator.language;
  const parsed = language.split('-')[0];
  const country = language.split('-')[1].toUpperCase();
  return `${parsed}-${country}`;
};

root.render(
  <Provider height="100%" locale={getLocale()} theme={defaultTheme}>
    <ReduxProvider store={store}>
      <RequestHelperContextProvider>
        <SessionOrNot />
      </RequestHelperContextProvider>
    </ReduxProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
