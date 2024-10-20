import { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/admin/login', { email, password });
      if (response.status === 200) {
        toast.success('Login berhasil.');
        navigate('/admin/dashboard');
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Terjadi kesalahan.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className='login-title'>Login Admin</h2>
      <form onSubmit={handleLogin} className='login-form'> 
        <div className='login-email form-login-item'>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className='login-password form-login-item'>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className='login-btn'>Masuk</button>
      </form>
    </div>
  );
};

export default AdminLogin;
