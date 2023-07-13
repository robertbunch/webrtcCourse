import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import socketConnection from './webRTCutilities/socketConnection'
import MainVideoPage from './videoComponents/MainVideoPage';
import ProDashboard from './siteComponents/ProDashboard';

const Home = ()=><h1>Hello, Home page</h1>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route path="/join-video" Component={MainVideoPage} />
        <Route exact path="/dashboard" Component={ProDashboard} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
