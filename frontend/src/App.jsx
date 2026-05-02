import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import StockInPage from './pages/StockInPage';
import StockOutPage from './pages/StockOutPage';
import TransactionsPage from './pages/TransactionsPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="stock-in" element={<StockInPage />} />
          <Route path="stock-out" element={<StockOutPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="settings" element={<PlaceholderPage pageKey="settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
