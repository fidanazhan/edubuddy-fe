import { createBrowserRouter } from 'react-router-dom';

import AuthRoute from './AuthRoute'
import StudentRoute from './StudentRoute'
import HttpRoute from './HttpRoute';

const router = createBrowserRouter([AuthRoute, StudentRoute, HttpRoute]);

export default router;