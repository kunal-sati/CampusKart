import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';

// Lazy load components for code splitting (except HomePage for instant loading)
const isDevelopment = import.meta.env.MODE === 'development';
const NotFoundPage = isDevelopment ? lazy(() => import('../dev-tools/src/PageNotFound')) : lazy(() => import('./pages/_404'));

const BrowsePage = lazy(() => import('./pages/browse'));
const ListingDetailPage = lazy(() => import('./pages/listing/[id]'));
const PostPage = lazy(() => import('./pages/post'));
const ProfilePage = lazy(() => import('./pages/profile'));
const CreditsPage = lazy(() => import('./pages/credits'));
const CategoriesPage = lazy(() => import('./pages/categories'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/browse',
    element: <BrowsePage />,
  },
  {
    path: '/listing/:id',
    element: <ListingDetailPage />,
  },
  {
    path: '/post',
    element: <PostPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/credits',
    element: <CreditsPage />,
  },
  {
    path: '/categories',
    element: <CategoriesPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export type Path = '/' | '/browse' | '/listing/:id' | '/post' | '/profile' | '/credits';
export type Params = Record<string, string | undefined>;
