import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (!userData || userData.role !== 'customer') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
