import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MemoriesPage from './pages/MemoriesPage';
import RemerciementsPage from './pages/RemerciementsPage';
import AdminPage from './pages/AdminPage';
import Layout from './components/layout/Layout';
import ThemeToggle from './components/common/ThemeToggle';

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/remerciements" element={<RemerciementsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Add more routes as they are developed */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
