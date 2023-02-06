import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';

import './App.css';
import { Layout } from './components/Layout';
import { HirePage } from './pages/HirePage';
import { HomePage } from './pages/HomePage';
import { SetupPage } from './pages/SetupPage';

function Application() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        ></Route>
        <Route
          path="/setup"
          element={
            <Layout>
              <SetupPage />
            </Layout>
          }
        ></Route>
        <Route
          path="/hire"
          element={
            <Layout>
              <HirePage />
            </Layout>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Application;
