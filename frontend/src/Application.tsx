import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import { ErrorModal } from './components/ErrorModal';
import { Layout } from './components/Layout';
import { SuccessModal } from './components/SuccessModal';
import { AccountsPage } from './pages/AccountsPage';
import { ForecastPage } from './pages/ForecastPage';
import { HirePage } from './pages/HirePage';
import { HomePage } from './pages/HomePage';
import { SetupPage } from './pages/SetupPage';

function Application() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/forecast" element={<ForecastPage />}></Route>
          <Route path="/setup" element={<SetupPage />}></Route>
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
