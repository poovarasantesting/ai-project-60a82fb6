import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FacebookPage from './pages/FacebookPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FacebookPage />} />
      </Routes>
    </Router>
  );
}

export default App;