import { BrowserRouter, Navigate, useRoutes } from 'react-router-dom';
import { blogRoutes } from './blogRoutes.tsx';
import { userRoutes } from './userRoutes.tsx';
import { adminRoutes } from './adminRoutes';
import { AuthProvider } from '../lib/auth.tsx';
import Layout from '../components/Layout';
import ThemeProvider from '../components/ThemeProvider';

// Combine all feature routes here
const routes = [
  ...blogRoutes,
  ...userRoutes,
  ...adminRoutes,
  { path: '/', element: <Navigate to="/blogs" replace /> },
];

function AppRoutes() {
  return useRoutes(routes);
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
