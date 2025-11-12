import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/protected-route';

import LoginPage from './page/auth/login';
import HomePage from './page';
import TransferPage from './page/transaction/transfer';
import TransferUnsafePage from './page/transaction/transfer-unsafe';
import BalancePage from './page/transaction/balance';
import E404Page from './page/error/e-404';
import { useEffect } from 'react';

function App() {
  const isAuthenticated = false;

  // * Assuming this hooks is there because someone tampering this codebase via XSS or else.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:8888') return;

      const { type, key, value } = event.data;

      if (type === 'get') {
        const val = localStorage.getItem(key);
        event.source?.postMessage(
          { type: 'response', key, value: val },
          // @ts-expect-error Testing
          event.origin
        );
      } else if (type === 'set') {
        localStorage.setItem(key, value);
      } else if (type === 'remove') {
        localStorage.removeItem(key);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="auth"
          element={
            <ProtectedRoute
              isAllowed={!isAuthenticated}
              fallback={<Navigate to="/" replace />}
            />
          }>
          <Route path="login" element={<LoginPage />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated}
              fallback={<Navigate to="/auth/login" replace />}
            />
          }>
          <Route index element={<HomePage />} />
          <Route path="transaction">
            <Route path="transfer" element={<TransferPage />} />
            <Route path="transfer-unsafe" element={<TransferUnsafePage />} />
            <Route path="balance" element={<BalancePage />} />
          </Route>
        </Route>

        <Route path="*" element={<E404Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
