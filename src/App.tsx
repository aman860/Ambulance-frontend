import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Auth/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import EmergencyHome from './components/EmergencyHelp/EmergencyHome';
import Admin from './components/AdminPanel/Admin';



const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/emergency-home" element={<EmergencyHome />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;
