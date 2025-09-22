import { BrowserRouter, useRoutes } from 'react-router-dom';
import { blogRoutes } from './blogRoutes.tsx';
import { userRoutes } from './userRoutes.tsx';

// Combine all feature routes here
const routes = [
  ...blogRoutes,
  ...userRoutes,
  // Add more feature routes here
];

function AppRoutes() {
  return useRoutes(routes);
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
