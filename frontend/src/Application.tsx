import { useContext, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ActionType } from './actions/Actions';

import './App.css';
import { ErrorModal } from './components/ErrorModal';
import { Layout } from './components/Layout';
import { SuccessModal } from './components/SuccessModal';
import { RequestHelperContext } from './context/RequestHelperContextProvider';
import { AccountsPage } from './pages/AccountsPage';
import { ForecastPage } from './pages/ForecastPage';
import { HirePage } from './pages/HirePage';
import { HomePage } from './pages/HomePage';
import { SetupPage } from './pages/SetupPage';
import { UserSetupPage } from './pages/UserSetupPage';
import { store } from './store/Store';

function Application() {
  const { client } = useContext(RequestHelperContext);

  useEffect(() => {
    const execute = async () => {
      let users = await client!.getUsers();

      store.dispatch({
        type: ActionType.USERS,
        payload: [...users],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/forecast" element={<ForecastPage />}></Route>
          <Route path="/setup" element={<SetupPage />}></Route>
          <Route path="/user-setup" element={<UserSetupPage />}></Route>
          <Route path="/hire" element={<HirePage />}></Route>
          <Route path="/accounts" element={<AccountsPage />}></Route>
        </Routes>
      </Layout>
      <SuccessModal />
      <ErrorModal />
    </BrowserRouter>
  );
}

export default Application;
