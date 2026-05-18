import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { appRoutes } from './app-routes'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map((layout) => (
          <Route key={layout.path} path={layout.path} element={layout.element}>
            {layout.children?.map((child) => (
              <Route
                key={child.path}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  )
}
