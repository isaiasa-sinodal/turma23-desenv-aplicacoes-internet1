import { Navigate } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { ROUTES } from '.'

export const appRoutes: AppRouteWithChildren[] = [
  {
    element: <HomePage />,
    path: ROUTES.HOME.path,
  },
  {
    element: <Navigate to={ROUTES.HOME.path} />,
    path: '*',
  },
]

export type AppRoute = {
  element: React.ReactNode
  path: string
}

type AppRouteWithChildren = AppRoute & { children?: AppRoute[] }
