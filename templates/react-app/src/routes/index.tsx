import { Navigate, RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import App from '../App';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Navigate to="/" replace /> },
      { path: '*', element: <div>404 Not Found</div> },
    ],
  },
  { path: 'login', element: <Login /> },
];

export default routes;
