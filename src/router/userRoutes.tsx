import { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
const UserProfile = lazy(() => import('../components/user/UserProfile'));
const UserSettings = lazy(() => import('../components/user/UserSettings'));
const Login = lazy(() => import('../components/user/Login'));
const Register = lazy(() => import('../components/user/Register'));
import ProtectedRoute from './ProtectedRoute';

export const userRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: '/user/profile',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/user/settings',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProtectedRoute>
          <UserSettings />
        </ProtectedRoute>
      </Suspense>
    ),
  },
];
