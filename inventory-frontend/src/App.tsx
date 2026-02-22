import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/customers" element={<div className="text-center text-2xl mt-10">Customers Page - Coming Soon</div>} />
                    <Route path="/products" element={<div className="text-center text-2xl mt-10">Products Page - Coming Soon</div>} />
                    <Route path="/stock" element={<div className="text-center text-2xl mt-10">Stock Page - Coming Soon</div>} />
                    <Route path="/orders" element={<div className="text-center text-2xl mt-10">Orders Page - Coming Soon</div>} />
                    <Route path="/users" element={<div className="text-center text-2xl mt-10">Users Page - Coming Soon</div>} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
