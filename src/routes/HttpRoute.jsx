import ForbiddenPage from '../page/Common/403';
import NotFoundPage from '../page/Common/404';

const HttpRoute = {
  path: "/",
  children: [
    {
      path: "forbidden",
      element: <ForbiddenPage />,
    },
    {
      path: "notfound", // Catch-all for undefined routes
      element: <NotFoundPage />,
    }
  ]
};

export default HttpRoute;
