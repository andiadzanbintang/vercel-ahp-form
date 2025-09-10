import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard'
import {Toaster} from 'react-hot-toast'
import IndikatorPage from './pages/IndikatorPage';
import FormPages from './pages/FormPages';
import axios from 'axios'
import AdminLogin from './components/admin/Login'
import AdminLogout from './components/admin/Logout'
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css'
import Navbar from './components/Navbar';
 

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
axios.defaults.withCredentials = true

function App() {
  const [isAuth, setIsAuth] = useState(null); // null: loading, false: not auth, true: auth
  const location = useLocation(); // Ambil lokasi saat ini

  // Pengecekan untuk menentukan Navbar yang ditampilkan
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
  // const checkAuth = async () => {
  //   try {
  //     if (isAdminRoute) {  // Jalankan checkAuth hanya di rute admin
  //       await axios.get('/api/v1/admin/checkAuth'); 
  //       setIsAuth(true);
  //     }
  //   } catch (error) {
  //     console.error("Something went wrong:", error)
  //     setIsAuth(false);
  //   }
  // };
  // checkAuth();

  // sementara: langsung anggap sudah login
  if (isAdminRoute) {
    setIsAuth(true);
  }
}, [isAdminRoute]);
// Jalankan ulang hanya jika isAdminRoute berubah

  if (isAuth === null && isAdminRoute) {
    return <div>Memuat...</div>; 
  }

  return (
    <>
     <Toaster
     toastOptions={{
      duration: 2000
     }}
     />
     <Navbar />
     <Routes>
       <Route path="/" element={<Dashboard />}/>
       <Route path="/form" element={<FormPages />}/>
       <Route path="/indikator" element={<IndikatorPage />}/>

       {/* Route Admin */}
       <Route 
          path="/admin" 
          element={isAuth ? <Navigate to="/admin/dashboard" /> : <AdminLogin setIsAuth={setIsAuth} />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={isAuth ? <AdminDashboard /> : <Navigate to="/admin" />} 
        />
        <Route 
          path="/admin/logout" 
          element={<AdminLogout setIsAuth={setIsAuth} />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
     </Routes>
    </>
  )
}

export default App
