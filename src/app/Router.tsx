import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BlogListPage from '@/pages/BlogListPage'
import PostDetailPage from '@/pages/PostDetailPage'
import PostCreatePage from '@/pages/PostCreatePage'
import ProfilePage from '@/pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <BlogListPage />,
  },
  {
    path: '/posts',
    element: <BlogListPage />,
  },
  {
    path: '/posts/:postId',
    element: <PostDetailPage />,
  },
  {
    path: '/posts/create',
    element: <PostCreatePage />,
  },
  {
    path: '/posts/:postId/edit',
    element: <PostCreatePage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/profile/:memberId',
    element: <ProfilePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
