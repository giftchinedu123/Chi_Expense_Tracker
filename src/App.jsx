import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar, { MobileIdentityBar } from './components/Sidebar';
import { TransactionProvider } from './context/TransactionContext';
import Dashboard from './pages/Dashboard';
import Export from './pages/Export';
import NotFound from './pages/NotFound';
import Transactions from './pages/Transactions';

export default function App() {
  return (
    <TransactionProvider>
      <BrowserRouter>
        <div className="app-outer">
          <div className="app-shell">
            <MobileIdentityBar />
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/export" element={<Export />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TransactionProvider>
  );
}
