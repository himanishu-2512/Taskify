// components/ProtectedRoute.js
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { selectAuthState } from '@/redux/authSlice';

const ProtectedRoute = ({ children}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const {isAuthenticated} = useSelector(selectAuthState);

  useEffect(() => {
    const token=localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login'); // Redirect to login if not logged in
    }
  }, []);

  // Return null or a loading state while the check is happening
  

  return children;
};

export default ProtectedRoute;
