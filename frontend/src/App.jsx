import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import ListPage from './pages/ListPage';
import EditFormPage from './pages/EditFormPage';
import FormDetailPage from './pages/FormDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/form/:id" element={<EditFormPage />} />
          <Route path="/form/:id/details" element={<FormDetailPage />} />
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
