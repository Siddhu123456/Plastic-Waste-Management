import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
console.log(userData)
  if (!userData || userData.role !== 'user') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
