import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ActionType, showModalError } from './actions/Actions';
import './App.css';
import { ErrorModal } from './components/ErrorModal';
import { Layout } from './components/Layout';
import { SuccessModal } from './components/SuccessModal';
import { AccountsPage } from './pages/AccountsPage';
import { ForecastPage } from './pages/ForecastPage';
import { HirePage } from './pages/HirePage';
import { HomePage } from './pages/HomePage';
import { SetupPage } from './pages/SetupPage';
import { UserSetupPage } from './pages/UserSetupPage';
import { selectTeam, selectToken, store } from './store/Store';
import { getErrorMessage } from './helpers/ErrorHelper';
import { useSelector } from 'react-redux';
import { getRequestClient } from './helpers/RequestHelper';
import { AllowTeamRegistrationModal } from './components/modal/AllowTeamRegistrationModal';

function Application() {
  const token = useSelector(selectToken);
  const team = useSelector(selectTeam);

  const client = getRequestClient(token);

  useEffect(() => {
    const execute = async () => {
      try {
        let users = await client.getUsers();

        store.dispatch({
          type: ActionType.USERS,
          payload: [...users],
        });

        let schemas = await client.fetchSchemas();

        store.dispatch({
          type: ActionType.SCHEMAS,
          payload: [...schemas],
        });

        let accounts = await client.getAccounts();

        store.dispatch({
          type: ActionType.ACCOUNTS,
          payload: [...accounts],
        });

        let lanes = await client.getLanes();

        store.dispatch({
          type: ActionType.LANES,
          payload: [...lanes],
        });
      } catch (error) {
        console.error(error);

        const message = await getErrorMessage(error);

        store.dispatch(showModalError(message));
      }
    };

    if (token) {
      execute();
    }

    return () => {
      client.destroy();
    };
  }, [token]);

  return (
    <BrowserRouter>
      {team!.isFirstTeam === true ? <AllowTeamRegistrationModal /> : null}
      <Layout>
        <Routes>
          <Route path="/forecast/*" element={<ForecastPage />}></Route>
          <Route path="/setup" element={<SetupPage />}></Route>
          <Route path="/user-setup" element={<UserSetupPage />}></Route>
          <Route path="/hire" element={<HirePage />}></Route>
          <Route path="/accounts" element={<AccountsPage />}></Route>
          <Route path="*" element={<HomePage />}></Route>
        </Routes>
      </Layout>
      <SuccessModal />
      <ErrorModal />
    </BrowserRouter>
  );
}

export default Application;
