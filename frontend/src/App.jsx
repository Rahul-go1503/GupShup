import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
// import ProtectedRoute from './utils/ProtectedRoute';
import RequireAuth from './utils/RequireAuth';
import SignUp from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route element= {<RequireAuth/>}>
          <Route path = '/chat' element = {<Chat/>}/>
        </Route> 
      </Routes>
    </Router>
  );
}

export default App;
