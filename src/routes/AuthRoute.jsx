import LoginPage from '../page/Auth/LoginPage'
import AuthLayout from '../layout/AuthLayout'


const AuthRoute = {
    path: "/",
    children: [
        {
          path: '/',
          element: <AuthLayout />,
          children: [
            {
              path: '/login',
              element: <LoginPage />
            }
          ]
        }
      ]
}

export default AuthRoute