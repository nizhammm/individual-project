import { useSelector } from 'react-redux';

export const useAuth = () => {
  const authSelector = useSelector((state) => state.auth);
  
  return {
    username: authSelector.username,
    email: authSelector.email,
    fullName: authSelector.fullName,
  };
};