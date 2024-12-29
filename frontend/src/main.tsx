import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './App.tsx'
import { CallbackComponent } from './components/CalbackComponent.tsx'
import { Login } from './components/Login.tsx'
import { PrivateComponent } from './components/PrivateComponent.tsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
    
  },
  {
    path: '/callback',
    element: <CallbackComponent/>
  },
  {
    path: '/',
    element: (
      <PrivateComponent>
        <App/>
      </PrivateComponent>
    )
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
