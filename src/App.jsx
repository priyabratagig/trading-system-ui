import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { TradingPage, LoginPage, Settings, NotFoundPage, ErrorPage } from './pages'
import { APIAcknowledgeModal } from './Components'

const rotues = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/',
    element: <TradingPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/settings',
    element: <Settings />,
    errorElement: <ErrorPage />
  },
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: <ErrorPage />
  }
])

function App() {
  return (
    <>
      <APIAcknowledgeModal />
      <RouterProvider router={rotues} />
    </>
  )
}

export default App
