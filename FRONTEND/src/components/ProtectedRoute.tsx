import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
  // Verificar si el usuario está autenticado
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Si no hay autenticación, redirigir a login
  if (!userId || !userToken) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, validar
  if (requiredRole && userRole?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  // Si todo es válido, renderizar el componente
  return element;
};

export default ProtectedRoute;
