import { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
const BlogList = lazy(() => import('../components/blog/BlogList'));
const BlogDetail = lazy(() => import('../components/blog/BlogDetail'));

export const blogRoutes: RouteObject[] = [
  {
    path: '/blogs',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BlogList />
      </Suspense>
    ),
    // children: [...], // Add nested blog routes here
  },
  {
    path: '/blogs/:id',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BlogDetail />
      </Suspense>
    ),
  },
];
