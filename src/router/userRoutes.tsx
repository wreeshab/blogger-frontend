import { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
const UserProfile = lazy(() => import('../components/user/UserProfile'));
const UserSettings = lazy(() => import('../components/user/UserSettings'));

export const userRoutes: RouteObject[] = [
  {
    path: '/user/profile',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile />
      </Suspense>
    ),
  },
  {
    path: '/user/settings',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UserSettings />
      </Suspense>
    ),
  },
];
