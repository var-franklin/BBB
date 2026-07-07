import { useNavigate } from 'react-router-dom';

export const handleLogout = async (logOut, navigate) => {
  try {
    await logOut();
    localStorage.removeItem('user');
    localStorage.removeItem('user-preferences');
    navigate('/');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export const useLogout = (logOut) => {
  const navigate = useNavigate();
  
  return async () => {
    await handleLogout(logOut, navigate);
  };
};