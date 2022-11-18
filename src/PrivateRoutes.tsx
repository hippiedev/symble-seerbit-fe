import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';

function PrivateRoutes() {
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  return token || isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoutes;
