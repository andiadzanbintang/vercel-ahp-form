import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogout = ({ setIsAuth }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/v1/admin/logout');
      if (response.status === 200) {
        toast.success('Logout berhasil.');
        setIsAuth(false); // Update authentication state
        window.location.reload();
        navigate('/admin'); // Redirect to the login route
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error('Terjadi kesalahan saat logout.');
    }
  };

  return (
    <button onClick={handleLogout} className='logout-btn'>
      Logout
    </button>
  );
};

export default AdminLogout;
