import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminPatients from './pages/AdminPatients';
import AdminImport from './pages/AdminImport';
import AdminUsers from './pages/AdminUsers';
import MedicoDashboard from './pages/MedicoDashboard';
import SolicitarRegistro from './pages/SolicitarRegistro';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import RoleRoute from './components/RoleRoute';
import RoleRedirect from './components/RoleRedirect';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

    <main className="flex-1 py-8">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<GuestRoute redirectTo="/dashboard"><SignUp /></GuestRoute>} />
            <Route path="/solicitar-registro" element={<GuestRoute redirectTo="/dashboard"><SolicitarRegistro /></GuestRoute>} />
            <Route path="/verify" element={<GuestRoute redirectTo="/dashboard"><VerifyEmail /></GuestRoute>} />
            <Route path="/login" element={<GuestRoute redirectTo="/dashboard"><Login /></GuestRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/patient" element={<RoleRoute allowed={['PACIENTE','patient']}><PatientDashboard /></RoleRoute>} />
            <Route path="/admin" element={<RoleRoute allowed={['ADMINISTRADOR','admin']}><AdminDashboard /></RoleRoute>} />
            <Route path="/admin/usuarios" element={<RoleRoute allowed={['ADMINISTRADOR','admin']}><AdminUsers /></RoleRoute>} />
            <Route path="/admin/pacientes" element={<RoleRoute allowed={['ADMINISTRADOR','admin']}><AdminPatients /></RoleRoute>} />
            <Route path="/admin/carga" element={<RoleRoute allowed={['ADMINISTRADOR','admin']}><AdminImport /></RoleRoute>} />
            <Route path="/medico" element={<RoleRoute allowed={['MEDICO','medico']}><MedicoDashboard /></RoleRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
