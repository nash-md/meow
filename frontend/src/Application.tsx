import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';

import './App.css';
import { Layout } from './components/Layout';
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default Application;
